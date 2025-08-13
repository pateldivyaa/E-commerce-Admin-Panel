import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import MobileNav from './MobileNav'

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Close mobile nav when route changes
  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [location.pathname])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      {!isMobile && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
        />
      )}
      
      {/* Mobile navigation */}
      {isMobile && (
        <MobileNav
          isOpen={isMobileNavOpen}
          toggleMobileNav={toggleMobileNav}
        />
      )}
      
      {/* Main content area */}
      <div className={`flex flex-col flex-1 ${!isMobile && isSidebarOpen ? 'lg:ml-64' : ''} transition-all duration-300 ease-in-out`}>
        <TopBar 
          toggleSidebar={toggleSidebar} 
          toggleMobileNav={toggleMobileNav}
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
        />
        
        <motion.main 
          className="flex-1 p-4 md:p-6 overflow-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  )
}

export default DashboardLayout