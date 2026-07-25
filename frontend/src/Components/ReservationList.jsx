import { useState } from 'react'
import { useEffect } from 'react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

function ReservationList(){
    const [reservations, setReservations] = useState([])
    const [courts, setCourts] = useState([])
    const [selectedCourt, setSelectedCourt] = useState("")
    const [error, setError] = useState("")

    async function loadReservations(){
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8080/reservations",{
            headers: {Authorization: "Bearer " + token}
        })
        if(res.status === 403){
            localStorage.removeItem("token")
            window.location.reload()
            return
        }
        const data = await res.json()
        setReservations(data)
    }

    async function createReservation(){
        if(!selectedCourt){
            setError("Choose Court")
            return
        }
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8080/reservations",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                court: {id: selectedCourt},
                startTime: "2027-03-20T08:00:00",
                endTime: '2027-03-20T09:30:00'
            })
        })
        if(res.status === 403){
            localStorage.removeItem("token")
            window.location.reload()
            return
        }
        if(!res.ok){
            setError("Slot obsadený")
            return
        }
        loadReservations()
    }

    async function loadCourt(){
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8080/courts", {
            headers: {"Authorization": "Bearer " + token}
        })
        if(res.status === 403){
            localStorage.removeItem("token")
            window.location.reload()
            return
        }
        const data = await res.json()
        setCourts(data)
    }

    useEffect(() => {
        loadCourt()
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            onConnect: () => {
                client.subscribe("/topic/reservations", () => {
                    loadReservations()
                })
            }
        })
        client.activate()
        return () => client.deactivate()
    }, [])

    return(
        <div>
            <div>
                {reservations.map((r)=>(
                    <div key={r.id}>
                         {r.startTime} - {r.court?.sport} - {r.user?.username}
                    </div>
                ))}
            </div>
            <select value={selectedCourt} onChange={(e) => setSelectedCourt((e.target.value))}>
                <option value={""}>-- Choose Court --</option>
                {courts.map((court)=>(
                    <option key={court.id} value={court.id}>
                        {court.sport} {court.outdoor ? "(outdoor)" : "(indoor)"}
                    </option>
                ))}
            </select>
            <div>
                <button onClick={loadReservations}>Load reservations</button>
                <button onClick={createReservation}>Reserve</button>
            </div>
            {error && <p>{error}</p>}
        </div>
    )

}

export default ReservationList