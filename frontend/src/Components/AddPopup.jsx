import "./AddPopup.css"
import {useEffect, useRef} from "react"

const API_BASE = import.meta.env.VITE_API_URL || "/api"

const AddPopup = ({position, onClose, title, author, cover, user}) => {
    const popupRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [onClose])

    const addToLibrary = async({library}) => {
        const response = await fetch(`${API_BASE}/add-book`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                author: author,
                cover: cover,
                user: user
            })
        })

        const response2 = await fetch(`${API_BASE}/add-to-library`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user,
                title: title,
                libraryName: library
            })
        })

        onClose()
    }

    return(
        <div ref={popupRef} className="add-popup" style={{top: position?.top, left: position?.left}}>
            <button onClick={() => addToLibrary({library: "Want to Read"})}>Want to Read</button>
            <button onClick={() => addToLibrary({library: "Current Reads"})}>Currently Reading</button>
            <button onClick={() => addToLibrary({library: "Read"})}>Read</button>
        </div>
    )
}

export default AddPopup