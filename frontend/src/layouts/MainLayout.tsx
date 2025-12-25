import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"

const MainLayout = () => {
  return (
      <div className="min-h-screen flex flex-col">
        <Navbar/>
        <Outlet/>
      </div>
  )
}

export default MainLayout
