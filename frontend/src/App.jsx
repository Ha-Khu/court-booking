import {useState} from "react";
import Login from './Components/Login'
import CourtList from "./Components/CourtList.jsx";
import ReservationList from "./Components/ReservationList.jsx";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"))

    if(!token) return <Login onLogin={setToken} />
    return (
        <div>
            <CourtList/>
            <ReservationList/>
        </div>
    )
}

export default App
