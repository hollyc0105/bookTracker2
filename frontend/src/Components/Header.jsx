import "./Header.css"

const Header = () => {
    return(
        <div className="header">
            <h1>Book Tracker</h1>
            <div className="nav-links">
                <button>Search</button>
                <button>Libraries</button>
                <button>Analytics</button>
                <button>Goals</button>
            </div>
        </div>
    )
}

export default Header