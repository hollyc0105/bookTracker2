import {createContext, useState} from "react"

export const appContext = createContext()

const ContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(1)

    return(
        <appContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}  
        </appContext.Provider>
    )
}

export default ContextProvider