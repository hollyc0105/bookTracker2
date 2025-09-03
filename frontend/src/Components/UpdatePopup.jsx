import "./UpdatePopup.css"
import {useState, useContext} from "react"
import {appContext} from "../Context/Context.jsx"
import '@fortawesome/fontawesome-free/css/all.min.css'

const API_BASE = import.meta.env.VITE_API_URL || "/api"

const UpdatePopup = ({book, onClose}) => {
    const [userInput, setUserInput] = useState("")
    const {currentUser} = useContext(appContext)

    const handleInputChange = (e) => {
        setUserInput(e.target.value)
    }

    const handleUpdate = async() => {
        try {
            const response = await fetch(`${API_BASE}/update-progress`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title: book.title, progress: userInput, user: currentUser})
            })
        } catch (error) {
            console.error("Error updating progress", error)
        }
        onClose()
        
    }

    return(
        <div className="update-popup">
            <button className="close-button" onClick={()=>onClose()}><i class="fa fa-times" aria-hidden="true"></i></button>
            <h2>Progress:</h2>
            <div className="input-container">
                <input onChange={handleInputChange}></input>
                <p>%</p>
            </div>
            <button className="submit-progress" type="button" onClick={handleUpdate}>Update</button>
        </div>
    ) 
}

export default UpdatePopup