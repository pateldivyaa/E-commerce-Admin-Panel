import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { 
  RiDashboardLine, 
  RiShoppingCart2Line, 
  RiUserLine, 
  RiSettings4Line, 
  RiStore2Line,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiLogoutBoxLine
} from 'react-icons/ri'

const navVariants = {
  open: {
    width: '16rem',
    transition: { duration: 0.3 }
  },
  closed: {
    width: '5rem',
    transition: { duration: 0.3 }
  }
}

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { currentUser, logout } = useAuth()
  
  // Navigation links
  const navLinks = [
    { name: 'Dashboard', to: '/dashboard', icon: RiDashboardLine },
    { name: 'Products', to: '/products', icon: RiStore2Line },
    { name: 'Orders', to: '/orders', icon: RiShoppingCart2Line },
    { name: 'Users', to: '/users', icon: RiUserLine },
    { name: 'Account', to: '/account', icon: RiSettings4Line },
  ]

  return (
    <motion.nav 
      className="fixed inset-y-0 left-0 bg-white border-r border-gray-200 z-20 shadow-sm overflow-hidden"
      variants={navVariants}
      animate={isOpen ? 'open' : 'closed'}
      initial={isOpen ? 'open' : 'closed'}
    >
      <div className="flex flex-col h-full">
        {/* Logo and toggle button */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            {isOpen && (
              <motion.span 
                className="ml-3 font-semibold text-xl text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                EcomAdmin
              </motion.span>
            )}
          </div>
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
          >
            {isOpen ? <RiArrowLeftSLine size={20} /> : <RiArrowRightSLine size={20} />}
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-2 px-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink 
                  to={link.to}
                  className={({ isActive }) => `
                    flex items-center p-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <link.icon size={20} className="flex-shrink-0" />
                  {isOpen && (
                    <motion.span 
                      className="ml-3 font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {link.name}
                    </motion.span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* User profile */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img 
                src={currentUser?.profilePicture || "/assets/default-avatar.png"} 
                alt={currentUser?.name || "User"}
                className="w-9 h-9 rounded-full object-cover"
              />
            </div>
            {isOpen && (
              <motion.div 
                className="ml-3 truncate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-sm font-medium text-gray-800 truncate">
                  {currentUser?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser?.email || "user@example.com"}
                </p>
              </motion.div>
            )}
          </div>
          <button 
            onClick={logout}
            className={`
              mt-4 flex items-center justify-center p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all w-full
              ${isOpen ? 'justify-start' : 'justify-center'}
            `}
          >
            <RiLogoutBoxLine size={18} />
            {isOpen && <span className="ml-2 text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </motion.nav>
  )
}

export default Sidebar