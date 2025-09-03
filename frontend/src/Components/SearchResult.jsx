import "./SearchResult.css"
import {appContext} from "../Context/Context.jsx"
import {useContext, useRef, useState}  from "react"
import AddPopup from "./AddPopup.jsx"

const SearchResult = ({book, onBookAdded}) => {
    const {currentUser} = useContext(appContext)
    const buttonRef = useRef(null)
    const [popupPos, setPopupPos] = useState(null)
    const [showPopup, setShowPopup] = useState(false)

    const addHandler = async() => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setPopupPos({ top: rect.top + window.scrollY, left: rect.right + window.scrollX })
            setShowPopup(true)
        }

        onBookAdded()
    }    

    return(
        <div className="search-result"> 
            <img className="result-cover" src={book.volumeInfo.imageLinks?.thumbnail} alt="Book Cover"></img>
            <p className="result-title">{book.volumeInfo.title}</p>
            <p className="result-author">{book.volumeInfo.authors?.join(", ")}</p>
            <button ref={buttonRef} onClick={addHandler} className="add-button">Add</button>
            {showPopup && <AddPopup position={popupPos} onClose={() => setShowPopup(false)} title={book.volumeInfo.title} author={book.volumeInfo.authors?.join(", ")} cover={book.volumeInfo.imageLinks?.thumbnail} user={currentUser}/>}
        </div>
    )
}

export default SearchResult