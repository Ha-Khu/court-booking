import { useState } from 'react'

function ReservationList(){
    const [reservations, setReservations] = useState([])
    const [error, setError] = useState("")

    async function loadReservations(){
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8080/reservations",{
            headers: {Authorization: "Bearer " + token}
        })
        const data = await res.json()
        setReservations(data)
    }

    async function createReservation(){
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8080/reservations",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                court: {id: 1},
                startTime: "2026-10-10T10:00:00",
                endTime: "2026-10-10T11:30:00"
            })
        })
        if(!res.ok){
            setError("Slot obsadený")
            return
        }
        loadReservations()
    }

    return(
        <div>
            <div>
                {reservations.map((r)=>(
                    <div key={r.id}>
                         {r.startTime} - {r.court?.sport} - {r.user?.username}
                    </div>
                ))}
            </div>
            <div>
                <button onClick={loadReservations}>Load reservations</button>
                <button onClick={createReservation}>Reserve</button>
            </div>
            {error && <p>{error}</p>}
        </div>
    )

}

export default ReservationList