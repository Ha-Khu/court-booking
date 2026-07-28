import {useState} from "react";

function Register({onDone}){
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    async function handleRegister(){
        try{
            const res = await fetch("http://localhost:8080/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, email, password})
            })
            if(!res.ok){
                setError("Register failed")
                return
            }
            onDone()
        } catch (err){
            setError("Register failed, please try again")
        }
    }

    return(
        <div>
            <div>
                <label>Name</label>
                <input
                    type="text"
                    placeholder="David"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
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
                onClick={handleRegister}
            >
                Sign up
            </button>
        </div>
    )
}

export default Register