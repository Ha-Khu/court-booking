import {useState} from "react";
import Login from './Components/Login'
import CourtList from "./Components/CourtList.jsx";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"))

    if(!token) return <Login onLogin={setToken} />
    return <CourtList/>
}

export default App
