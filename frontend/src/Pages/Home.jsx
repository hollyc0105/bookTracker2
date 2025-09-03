import "./Home.css"
import Header from "../Components/Header.jsx"
import CurrentRead from "../Components/CurrentRead.jsx"
import Search from "../Components/Search.jsx"
import {useState} from "react"

const Home = () => {
    const [refreshCurrent, setRefreshCurrent] = useState(false)

    const triggerRefresh = () => setRefreshCurrent(prev => !prev)

    return(
        <div className="home-container">
            <Header />
            <CurrentRead refresh={refreshCurrent}/>
            <Search onBookAdded={triggerRefresh}/>
        </div>
    )
}

export default Home