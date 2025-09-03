import "./Login.css"
import Header from "../Components/Header.jsx"
import {useState, useContext} from "react"
import {appContext} from "../Context/Context.jsx"
import {useNavigate} from "react-router-dom"

const API_BASE = import.meta.env.VITE_API_URL || "/api"

const Login = () => {
    const [loginMode, setLoginMode] = useState("Login")
    const [usernameInput, setUsernameInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")
    const {currentUser, setCurrentUser} = useContext(appContext)
    const navigate = useNavigate()

    const handleUsernameChange = (e) => {
        setUsernameInput(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPasswordInput(e.target.value)
    }

    const loginHandler = async() => {
        if (loginMode === "Create Account") {
            try {
                const response = await fetch(`${API_BASE}/add-user`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({username: usernameInput, password: passwordInput})
                })
            } catch (error) {
                console.error("Error creating new user", error)
            }
        }

        const params = new URLSearchParams({
            username: usernameInput,
            password: passwordInput
        })
        try {
            const response = await fetch(`${API_BASE}/get-userid?${params}`)
            const data = await response.json()
            setCurrentUser(data[0].user_id)
            console.log("test")
            console.log(data)
            navigate("/home")
        } catch (error) {
            console.error("Failed to login")
        }
    }

    return(
        <div style={{width: "100vw"}}>
            <Header />
            <div className="login-container">
                <div className="login-mode"><button className="login-mode-button" onClick={()=>setLoginMode("Login")}>Login</button><button className="create-button" onClick={()=>setLoginMode("Create Account")}>Create Account</button></div>
                <p>Username:</p>
                <input onChange={handleUsernameChange}></input>
                <p>Password:</p>
                <input onChange={handlePasswordChange}></input>
                <button onClick={loginHandler}>{loginMode}</button>
            </div>
        </div>
    )
}

export default Login