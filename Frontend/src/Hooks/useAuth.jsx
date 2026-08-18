import { useEffect,useContext,createContext,useState } from "react";
import {createUser,getMe,logoutUser,loginUser } from '../services/register'



export const AuthContext = createContext()




export default function AuthProvider({children}) {
    const [user,setUser] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(false)
    useEffect(()=>{
        async function checkSession(){
            try{
                const currentUser = await getMe()
                setUser(currentUser)
                
            }catch(err){
                setError(err.message)
                console.log("Session failed",err)
                throw err
            }finally{
                setLoading(false)
            }
        }
        checkSession()
    },[])
    async function register(formData){
        setLoading(true)
        setError(null)
        try {
            const newUser = await createUser(formData)
            setUser(newUser)
            return newUser
        } catch (error) {
            console.log("The sign up failed the err is",error)
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }
    async function login(form){
        setLoading(true)
        setError(null)
        try {
            setLoading(true)
            await loginUser(form)
            const profile = await getMe()
            setUser(profile)
            return profile
            
        } catch (error) {
            console.log("The error is ", error)
            throw error
        }
        finally {
            setLoading(false);
        }
    }
    async function logOut(){
        try {
            setLoading(true)
            await logoutUser()
            setUser(null)
        } catch (error) {
            console.log("The error is", error)
            setUser(null)
            throw error
        }
        finally{
            setLoading(false)
        }
    }


  return (
    <AuthContext.Provider value={{ register, loading, user, error,login,logOut }}>
        {children}
    </AuthContext.Provider>
  )
}


export function useAuth(){
    return useContext(AuthContext)
}
