import { useState, useEffect } from 'react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const SLOT = 90

function generateSlots(date){
    const day = date.getDay()
    const weekend = day === 0 || day === 6
    const startHour = weekend ? 8 : 12
    const endHour = weekend ? 22 : 20

    const slots = []
    let t = new Date(date)
    t.setHours(startHour, 0, 0, 0)
    const end = new Date(date)
    end.setHours(endHour, 0, 0, 0)

    while (true){
        const slotEnd = new Date(t.getTime() + SLOT * 60000)
        if(slotEnd > end) break
        if(t > new Date()){
            slots.push(new Date(t))
        }
        t = slotEnd
    }
    return slots
}

function generateDays(){
    const days = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    for(let i = 0; i < 14; i++){
        const d = new Date(today)
        d.setDate(today.getDate() + i)
        days.push(d)
    }
    return days
}

function toLocalIso(date){
    const pad = (n) => String(n).padStart(2, "0")
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
}

function ReservationList(){
    const [reservations, setReservations] = useState([])
    const [courts, setCourts] = useState([])
    const [selectedCourt, setSelectedCourt] = useState(null)
    const [selectedDay, setSelectedDay] = useState(0)
    const [error, setError] = useState("")

    const days = generateDays()

    async function loadReservations(courtId){
        if(!courtId) return
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:8080/reservations/court/${courtId}`,{ headers: { Authorization: "Bearer " + token } })
        if(res.status === 403){ localStorage.removeItem("token"); window.location.reload(); return }
        setReservations(await res.json())
    }

    async function createReservation(slotDate){
        setError("")
        const token = localStorage.getItem("token")
        const start = toLocalIso(slotDate)
        const end = toLocalIso(new Date(slotDate.getTime() + SLOT * 60000))
        const res = await fetch("http://localhost:8080/reservations",{
            method: "POST",
            headers:{ "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify({ court: { id: selectedCourt }, startTime: start, endTime: end })
        })
        if(res.status === 403){ localStorage.removeItem("token"); window.location.reload(); return }
        if(!res.ok){ setError("Slot is occupied"); return }
        loadReservations(selectedCourt)
    }

    async function deleteReservation(id){
        setError("")
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:8080/reservations/${id}`, {
            method: "DELETE", headers:{ "Authorization": "Bearer " + token }
        })
        if(!res.ok){ setError(await res.text() || "Can't cancel"); return }
        loadReservations(selectedCourt)
    }

    async function loadCourt(){
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8080/courts", { headers: { "Authorization": "Bearer " + token } })
        if(res.status === 403){ localStorage.removeItem("token"); window.location.reload(); return }
        const data = await res.json()
        setCourts(data)
        if (data.length && !selectedCourt) setSelectedCourt(data[0].id)
    }

    useEffect(() => {loadCourt()}, [])
    useEffect(() => {loadReservations(selectedCourt)}, [selectedCourt]);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            onConnect: () => client.subscribe("/topic/reservations", () => loadReservations(selectedCourt))
        })
        client.activate()
        return () => client.deactivate()
    }, [selectedCourt]);

    function findReservation(slotDate){
        const iso = toLocalIso(slotDate)
        return reservations.find(r => r.startTime === iso)
    }

    const daySlots = selectedCourt ? generateSlots(days[selectedDay]) : []

    return (
        <Card>
            <CardHeader><CardTitle>Book a court</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    {courts.map(c => (
                        <Button key={c.id} variant={selectedCourt === c.id ? "default" : "outline"} onClick={() => setSelectedCourt(c.id)}>
                            {c.sport} {c.outdoor ? "☀️" : "🏠"}
                        </Button>
                    ))}
                </div>

                <div className="flex gap-1 overflow-x-auto pb-2">
                    {days.map((d, i) => (
                        <button key={i} onClick={() => setSelectedDay(i)}
                                className={`shrink-0 rounded-md px-3 py-2 text-sm ${selectedDay === i ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70"}`}>
                            {d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "numeric" })}
                        </button>
                    ))}
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {daySlots.map((slot, i) => {
                        const r = findReservation(slot)
                        const label = slot.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
                        if (r) {
                            return (
                                <button key={i} onClick={() => deleteReservation(r.id)}
                                        className="rounded-md border p-2 text-sm bg-red-100 border-red-300 text-red-700 hover:bg-red-200"
                                        title={`Booked by ${r.user?.username}`}>
                                    {label}
                                    <div className="text-xs opacity-70">{r.user?.username}</div>
                                </button>
                            )
                        }
                        return (
                            <button key={i} onClick={() => createReservation(slot)}
                                    className="rounded-md border p-2 text-sm bg-green-50 border-green-300 text-green-800 hover:bg-green-100">
                                {label}
                                <div className="text-xs opacity-60">free</div>
                            </button>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

export default ReservationList