import {useState} from "react";

function Login({onLogin}){
    const [email , setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    async function handleLogin(){
        try{
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({  email, password })
            })
            if(!response.ok){
                throw new Error(`Response status:  ${response.status}`)
            }
            const data = await response.text()
            localStorage.setItem("token", data)
            onLogin(data)
        } catch(err){
            setError("Login failed, please try again")
        }
    }

    return(
        <div>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div>
                <label>Password</label>
                <input
                    type="password"
                    placeholder="*********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {error && <p>{error}</p>}
            <button
                onClick={handleLogin}
            >
                Sign in
            </button>
        </div>
    )
}
export default Login