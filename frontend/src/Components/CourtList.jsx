import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function CourtList() {
    const [courts, setCourts] = useState([])

    async function loadCourt(){
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8080/courts", {
            headers: { "Authorization": "Bearer " + token }
        })
        if(res.status === 403){ localStorage.removeItem("token"); window.location.reload(); return }
        const data = await res.json()
        setCourts(data)
    }

    useEffect(() => { loadCourt() }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Courts</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
                {courts.map((court) => (
                    <div key={court.id} className="rounded-lg border bg-white p-4 flex items-center justify-between">
                        <span className="font-medium">{court.sport}</span>
                        <Badge variant={court.outdoor ? "default" : "secondary"}>
                            {court.outdoor ? "Outdoor" : "Indoor"}
                        </Badge>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export default CourtList