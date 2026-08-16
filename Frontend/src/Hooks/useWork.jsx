import { useEffect,useContext,useState,createContext } from "react";
import {createWorkSpace,getWorkSpace } from '../services/workspace'


export const WorkContext = createContext()

export function WorkProvider({children}){
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(false)
    const [name,setName] = useState('')
    useEffect(()=>{},[])
    // i have to mount what the backeend will send using useEffect i will also use useState from for the name of the workspace name
    return(
        <WorkContext.Provider>
            {children}
        </WorkContext.Provider>
    )
}


export default function useWork() {
  return (
    useContext(WorkContext)
  )
}
