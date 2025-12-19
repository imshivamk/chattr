import React, { use, useEffect, useState } from 'react'
import { getCurrentUser } from '../lib/user';


type User = {
    _id: string;
    email: string;
    name: string;
    isVerified: boolean;
}
const DashboardPage = () => {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=>{
        (async ()=>{
            try {
                const data = await getCurrentUser();
                setUser(data.user);
            } catch (error: any) {
                setError(error?.response?.data?.message || "Failed to load user");
            } finally{
                setLoading(false);
            }
        })()
    }, [])

    if (loading) return <div>Loading dashboard...</div>;
    if (error) return <div>{error}</div>;
    if (!user) return <div>No user data</div>;

    return (
        <div className=' min-h-screen bg-amber-100
        dark:bg-gray-950 dark:text-white flex flex-col items-center justify-center'>
            <div className="flex flex-col gap-2 
            bg-gray-700 p-10 rounded-3xl text-white
            items-center justify-center">
                <h1>Dashboard</h1>
                <p>Welcome, {user?.name}</p>
                <p>Email: {user?.email}</p>
                <p>Status : {(user?.isVerified) ? "Verified" : "Not verified"}</p>
            </div>
            
        </div>
    )
}

export default DashboardPage
