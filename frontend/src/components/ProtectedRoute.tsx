import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface Props{
    children: React.JSX.Element
}
const ProtectedRoute = ({children}:Props) => {
    const {user, loading} = useAuthStore();
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
