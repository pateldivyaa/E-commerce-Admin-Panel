import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RiArrowLeftLine, RiHomeLine } from 'react-icons/ri'

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-xl bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard" className="btn btn-primary">
            <RiHomeLine className="mr-2" />
            Return to Dashboard
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="btn btn-outline"
          >
            <RiArrowLeftLine className="mr-2" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default PageNotFound