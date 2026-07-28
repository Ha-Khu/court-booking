import {useState} from "react";
import Login from './Components/Login'
import Register from './Components/Register.jsx'
import CourtList from "./Components/CourtList.jsx";
import ReservationList from "./Components/ReservationList.jsx";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [showRegister, setShowRegister] = useState(false)

    if(!token){
        return (
            <div>
                {showRegister
                    ? <Register onDone={() => setShowRegister(false)} />
                    : <Login onLogin={setToken} />
                }
                <button onClick={() => setShowRegister(!showRegister)}>
                    {showRegister ? "Sign In" : "Sign Up"}
                </button>
            </div>
        )
    }

    return (
        <div>
            <CourtList/>
            <ReservationList/>
        </div>
    )
}

export default App
