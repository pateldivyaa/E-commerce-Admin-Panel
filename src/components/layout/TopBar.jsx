import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { 
  RiMenu4Line, 
  RiNotification3Line, 
  RiSearchLine,
  RiCloseLine,
  RiSettings4Line,
  RiLogoutBoxLine,
  RiUser3Line
} from 'react-icons/ri'

const TopBar = ({ toggleSidebar, toggleMobileNav, isMobile, isSidebarOpen }) => {
  const { currentUser, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'New order received: #ORD-2023-1A',
      time: '5 min ago',
      read: false
    },
    {
      id: 2,
      message: 'Profile updated successfully',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      message: 'Low stock alert: Product XYZ',
      time: '3 hours ago',
      read: true
    }
  ])
  
  const profileRef = useRef(null)
  const notificationRef = useRef(null)

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
    if (isNotificationOpen) setIsNotificationOpen(false)
  }

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen)
    if (isProfileOpen) setIsProfileOpen(false)
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm z-10">
      <div className="flex items-center">
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-2 mr-3 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <RiMenu4Line size={20} />
          </button>
        )}
        
        {isMobile && (
          <button
            onClick={toggleMobileNav}
            className="p-2 mr-3 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <RiMenu4Line size={20} />
          </button>
        )}
        
        <div className="lg:flex items-center relative hidden">
          <RiSearchLine size={18} className="absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent w-64 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Notification button */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={toggleNotification}
            className="p-2 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300 relative"
          >
            <RiNotification3Line size={20} />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
          
          <AnimatePresence>
            {isNotificationOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-dropdown z-30"
              >
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            !notification.read ? 'bg-primary-50' : ''
                          }`}
                        >
                          <p className="text-sm text-gray-700">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-gray-100 text-center">
                  <button className="text-sm text-primary-600 hover:text-primary-700">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={toggleProfile}
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary-300 rounded-lg p-1"
          >
            <img
              src={currentUser?.profilePicture || "/assets/default-avatar.png"}
              alt={currentUser?.name || "User"}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {currentUser?.name || "User"}
            </span>
          </button>
          
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-dropdown z-30"
              >
                <div className="p-4 border-b border-gray-100">
                  <p className="font-medium text-gray-800">{currentUser?.name || "User"}</p>
                  <p className="text-sm text-gray-500">{currentUser?.email || "user@example.com"}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/account"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <RiUser3Line className="mr-3 text-gray-500" />
                    My Profile
                  </Link>
                  <Link
                    to="/account"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <RiSettings4Line className="mr-3 text-gray-500" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false)
                      logout()
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <RiLogoutBoxLine className="mr-3 text-red-500" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

export default TopBar