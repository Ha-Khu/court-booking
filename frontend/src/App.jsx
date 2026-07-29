import { useState } from "react"
import Login from "./Components/Login"
import Register from "./Components/Register.jsx"
import CourtList from "./Components/CourtList.jsx"
import ReservationList from "./Components/ReservationList.jsx"
import { Button } from "@/components/ui/button"

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [showRegister, setShowRegister] = useState(false)

    if (!token) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 p-4">
                {showRegister
                    ? <Register onDone={() => setShowRegister(false)} />
                    : <Login onLogin={setToken} />}
                <Button variant="link" onClick={() => setShowRegister(!showRegister)}>
                    {showRegister ? "Already have an account? Sign in" : "No account? Sign up"}
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
                    <h1 className="text-xl font-semibold">🎾 Court Booking</h1>
                    <Button variant="outline" onClick={() => { localStorage.removeItem("token"); setToken(null) }}>
                        Log out
                    </Button>
                </div>
            </header>
            <main className="max-w-4xl mx-auto p-4 space-y-6">
                <CourtList />
                <ReservationList />
            </main>
        </div>
    )
}

export default App