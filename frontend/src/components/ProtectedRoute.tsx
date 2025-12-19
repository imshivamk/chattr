import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom';

interface Props{
    children: React.JSX.Element
}
const ProtectedRoute = ({children}:Props) => {
    const {user, loading} = useAuth();
    if(loading){
        return (
            <div className="loading">
                Loading...
            </div>
        )
    }
    if(!user){
        return (
            <Navigate to={"/login"} replace/>
        )
    }
    return children;
}

export default ProtectedRoute
