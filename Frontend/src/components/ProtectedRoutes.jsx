import { Navigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";


export default function ProtectedRoutes({children}) {
    const {user,loading} =useAuth()
    if(loading){
        return <div className="min-h-screen flex items-center justify-center">Loading session...</div>;
    }
    if (!user) {
    return <Navigate to="/signup" replace />;
    }
  return (
    children
  )
}
