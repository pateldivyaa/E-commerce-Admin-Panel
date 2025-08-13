import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  RiDashboardLine, 
  RiShoppingCart2Line, 
  RiUserLine, 
  RiSettings4Line, 
  RiStore2Line,
  RiCloseLine
} from 'react-icons/ri'

const navVariants = {
  open: {
    x: 0,
    transition: { duration: 0.3, ease: 'easeInOut' }
  },
  closed: {
    x: '-100%',
    transition: { duration: 0.3, ease: 'easeInOut' }
  }
}

const overlayVariants = {
  open: {
    opacity: 0.5,
    display: 'block',
    transition: { duration: 0.3 }
  },
  closed: {
    opacity: 0,
    transitionEnd: { display: 'none' },
    transition: { duration: 0.3 }
  }
}

const MobileNav = ({ isOpen, toggleMobileNav }) => {
  // Navigation links
  const navLinks = [
    { name: 'Dashboard', to: '/dashboard', icon: RiDashboardLine },
    { name: 'Products', to: '/products', icon: RiStore2Line },
    { name: 'Orders', to: '/orders', icon: RiShoppingCart2Line },
    { name: 'Users', to: '/users', icon: RiUserLine },
    { name: 'Account', to: '/account', icon: RiSettings4Line },
  ]

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-gray-900 z-30"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={toggleMobileNav}
          />
        )}
      </AnimatePresence>

      <motion.nav 
        className="fixed inset-y-0 left-0 w-64 bg-white z-40 shadow-xl"
        variants={navVariants}
        animate={isOpen ? 'open' : 'closed'}
        initial="closed"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="ml-3 font-semibold text-xl text-gray-800">
                EcomAdmin
              </span>
            </div>
            <button 
              onClick={toggleMobileNav}
              className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
            >
              <RiCloseLine size={20} />
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 py-6 overflow-y-auto">
            <ul className="space-y-2 px-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink 
                    to={link.to}
                    onClick={toggleMobileNav}
                    className={({ isActive }) => `
                      flex items-center p-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <link.icon size={20} className="flex-shrink-0" />
                    <span className="ml-3 font-medium">{link.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.nav>
    </>
  )
}

export default MobileNav