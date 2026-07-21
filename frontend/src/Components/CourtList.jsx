import { useState } from 'react'

function CourtList() {
    const [error, setError] = useState("")
    const [courts, setCourts] = useState([])

    async function loadCourt(){
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8080/courts", {
            headers: {"Authorization": "Bearer " + token}
        })
        const data = await res.json()
        setCourts(data)
    }

    return(
        <div>
            <button
                onClick={loadCourt}
            >
                Load Courts
            </button>
            <div>
                {courts.map((court)=>(
                    <div
                        key={court.id}>
                        {court.id} - {court.sport} - {court.outdoor ? "outside" : "inside"}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CourtList
