import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

function Register({ onDone }) {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    async function handleRegister() {
        try {
            const res = await fetch("http://localhost:8080/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            })
            if (!res.ok) { setError("Register failed"); return }
            onDone()
        } catch (err) {
            setError("Register failed, please try again")
        }
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Sign up</CardTitle>
                <CardDescription>Create a new account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Name</Label>
                    <Input type="text" placeholder="David" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button className="w-full" onClick={handleRegister}>Sign up</Button>
            </CardContent>
        </Card>
    )
}

export default Register