import "./CurrentRead.css"
import UpdatePopup from "./UpdatePopup"
import {useState, useEffect, useContext} from "react"
import {appContext} from "../Context/Context.jsx"
import '@fortawesome/fontawesome-free/css/all.min.css'

const API_BASE = import.meta.env.VITE_API_URL || "/api"

const CurrentRead = ({refresh}) => {
    const [currentBooks, setCurrentBooks] = useState([])
    const [viewedBook, setViewedBook] = useState(0)
    const [showPopup, setShowPopup] = useState(false)
    const {currentUser} = useContext(appContext)

    useEffect(() => {
        const fetchCurrentBooks = async () => {
            const params = new URLSearchParams({
                libraryName: "Current Reads", 
                userId: currentUser
            })
            try {
                const response = await fetch(`${API_BASE}/get-library-books?${params}`)
                const data = await response.json()
                setCurrentBooks(data)
                console.log(data)
            } catch (error) {
                console.error("Error fetching current books:", error)
            }
        }

        fetchCurrentBooks()
    }, [showPopup, refresh])

    return(
        <div>
            {currentBooks && currentBooks.length > 0 ? <div className="current-read">
                <div className="current-cover-container">
                    <button className="prev-book" onClick={() => setViewedBook(viewedBook-1)} style={{ visibility: viewedBook > 0 ? "visible" : "hidden" , marginRight: "5%"}}><i className="fa-solid fa-arrow-left"></i></button>
                    <img className="current-cover" src={currentBooks[viewedBook].cover}></img>
                    <button className="next-book" onClick={() => setViewedBook(viewedBook+1)} style={{ visibility: viewedBook < currentBooks.length-1 ? "visible" : "hidden", marginLeft: "5%"}}><i className="fa-solid fa-arrow-right"></i></button>
                </div>
                <p className="current-title">{currentBooks[viewedBook].title}</p>
                <div className="progress-container"><div className="progress-bar"><div className="progress-made" style={{width: `${currentBooks[viewedBook].progress}%`}}></div></div><p>{currentBooks[viewedBook].progress}%</p></div>
                <button className="update-button" onClick={()=>setShowPopup(true)}>Update Progress</button>
                {showPopup && <UpdatePopup book={currentBooks[viewedBook]} onClose={()=>setShowPopup(false)}/>}
            </div>
            :<div className="current-read">
                <h3>Search and add books to get started!</h3>
            </div>}
        </div>
        
    )
}

export default CurrentRead