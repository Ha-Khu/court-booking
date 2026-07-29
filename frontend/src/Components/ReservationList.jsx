import { useState, useEffect } from 'react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function ReservationList(){
    const [reservations, setReservations] = useState([])
    const [courts, setCourts] = useState([])
    const [selectedCourt, setSelectedCourt] = useState("")
    const [selectedSlot, setSelectedSlot] = useState("")
    const [error, setError] = useState("")

    async function loadReservations(){
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8080/reservations",{ headers: { Authorization: "Bearer " + token } })
        if(res.status === 403){ localStorage.removeItem("token"); window.location.reload(); return }
        setReservations(await res.json())
    }

    async function createReservation(){
        if(!selectedCourt){ setError("Choose a court"); return }
        if(!selectedSlot){ setError("Choose a time"); return }
        const endDate = new Date(new Date(selectedSlot).getTime() + 90 * 60 * 1000)
        const end = endDate.toISOString().slice(0, 19)
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8080/reservations",{
            method: "POST",
            headers:{ "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify({ court: { id: selectedCourt }, startTime: selectedSlot, endTime: end })
        })
        if(res.status === 403){ localStorage.removeItem("token"); window.location.reload(); return }
        if(!res.ok){ setError("Slot is occupied"); return }
        setError("")
        loadReservations()
    }

    async function deleteReservation(id){
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:8080/reservations/${id}`, {
            method: "DELETE", headers:{ "Authorization": "Bearer " + token }
        })
        if(!res.ok){ setError(await res.text() || "Can't delete this reservation"); return }
        loadReservations()
    }

    async function loadCourt(){
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8080/courts", { headers: { "Authorization": "Bearer " + token } })
        if(res.status === 403){ localStorage.removeItem("token"); window.location.reload(); return }
        setCourts(await res.json())
    }

    useEffect(() => {
        loadCourt(); loadReservations()
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            onConnect: () => { client.subscribe("/topic/reservations", () => loadReservations()) }
        })
        client.activate()
        return () => client.deactivate()
    }, [])

    return (
        <Card>
            <CardHeader><CardTitle>Reservations</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 items-center">
                    <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Choose court" /></SelectTrigger>
                        <SelectContent>
                            {courts.map((c) => (
                                <SelectItem key={c.id} value={String(c.id)}>
                                    {c.sport} {c.outdoor ? "(outdoor)" : "(indoor)"}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                        <SelectTrigger className="w-[200px]"><SelectValue placeholder="Choose time" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2026-08-10T08:00:00">10.8. 08:00 - 09:30</SelectItem>
                            <SelectItem value="2026-08-10T10:00:00">10.8. 10:00 - 11:30</SelectItem>
                            <SelectItem value="2026-08-10T12:00:00">10.8. 12:00 - 13:30</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={createReservation}>Reserve</Button>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="space-y-2">
                    {reservations.length === 0 && <p className="text-sm text-muted-foreground">No reservations yet.</p>}
                    {reservations.map((r) => (
                        <div key={r.id} className="flex items-center justify-between rounded-lg border bg-white p-3">
                            <div>
                                <span className="font-medium">{r.court?.sport}</span>
                                <span className="text-muted-foreground"> · {r.startTime?.replace("T", " ")} · {r.user?.username}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => deleteReservation(r.id)}>Delete</Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default ReservationList