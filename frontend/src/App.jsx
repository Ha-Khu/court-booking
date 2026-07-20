import { useState } from 'react'

function App() {
  const [email , setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [courts, setCourts] = useState([])

  async function handleLogin(){
    try{
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({  email, password })
      })
      const data = await response.text()
      localStorage.setItem("token", data)
    } catch(err){
    setError("Login failed, please try again")
    }
  }

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

export default App
