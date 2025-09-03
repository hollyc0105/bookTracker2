import "./Search.css"
import {useState, useEffect} from "react"
import SearchResult from "./SearchResult.jsx"

const Search = ({onBookAdded}) => {
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])

    const inputChangeHandler = (e) => {
        setSearch(e.target.value)
    }

    const searchClickHandler = async() => {
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}`)
            const bookData = await response.json()
            setSearchResults(bookData.items)
            console.log(bookData)
        } catch (error) {
            console.error("Error fetching search results:", error)
        }
    }

    return(
        <div className="search-container">
            <div className="search-header">
                <input
                    className="search-bar"
                    placeholder="Search by title or author"
                    onChange={inputChangeHandler}
                    value={search}
                />
                <button className="search-button" onClick={searchClickHandler}>Search</button>
            </div>
            <div className="results-container">
                {searchResults && searchResults.length > 0
                    ? searchResults.map((book, index) => (
                        <SearchResult key={book.id || index} book={book} onBookAdded={onBookAdded}/>
                    ))
                    : null}
            </div>
        </div>
    )
}

export default Search