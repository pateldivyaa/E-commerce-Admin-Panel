import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  RiEditLine,
  RiCloseLine,
  RiDeleteBin6Line,
  RiMailSendLine,
  RiLockLine,
  RiAlertLine,
  RiCheckLine,
  RiEyeLine,
  RiEyeOffLine
} from 'react-icons/ri'
import { User, Mail, Calendar, Clock } from 'lucide-react'

const UserDetailsModal = ({ show, user, onClose, onUserUpdated, onUserDeleted, roles }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showResetPasswordConfirmation, setShowResetPasswordConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    status: ''
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      })
    }
  }, [user])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Never';
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleString(undefined, options)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      [name]: value
    })
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      })
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!userData.name.trim()) {
      errors.name = 'Name is required'
    }
    
    if (!userData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = 'Email is invalid'
    }
    
    if (!userData.role) {
      errors.role = 'Role is required'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      // In a real application, you would call your API here
      // const response = await axios.put(`/api/users/${user.id}`, userData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Call the parent component's function to update the user
      onUserUpdated({
        ...user,
        ...userData
      })
      
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating user:', error)
      setFormErrors({
        ...formErrors,
        general: 'Failed to update user. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    
    try {
      // In a real application, you would call your API here
      // const response = await axios.delete(`/api/users/${user.id}`)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Call the parent component's function to delete the user
      onUserDeleted(user.id)
    } catch (error) {
      console.error('Error deleting user:', error)
      setFormErrors({
        ...formErrors,
        general: 'Failed to delete user. Please try again.'
      })
    } finally {
      setLoading(false)
      setShowDeleteConfirmation(false)
    }
  }

  const handleResetPassword = async () => {
    setLoading(true)
    
    try {
      // In a real application, you would call your API here
      // const response = await axios.post(`/api/users/${user.id}/reset-password`)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success message or handle as needed
      alert(`Password reset email sent to ${user.email}`)
      setShowResetPasswordConfirmation(false)
    } catch (error) {
      console.error('Error resetting password:', error)
      setFormErrors({
        ...formErrors,
        general: 'Failed to reset password. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusClass = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto ${show ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={!showDeleteConfirmation && !showResetPasswordConfirmation ? onClose : undefined}></div>
      
      <motion.div
        className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative z-10 m-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Delete Confirmation Dialog */}
        {showDeleteConfirmation && (
          <div className="p-6">
            <div className="flex items-center mb-4 text-red-600">
              <RiAlertLine size={24} className="mr-2" />
              <h2 className="text-xl font-bold">Delete User</h2>
            </div>
            
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete <span className="font-semibold">{user.name}</span>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setShowDeleteConfirmation(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <RiDeleteBin6Line size={18} />
                    Delete User
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Reset Password Confirmation Dialog */}
        {showResetPasswordConfirmation && (
          <div className="p-6">
            <div className="flex items-center mb-4 text-indigo-600">
              <RiLockLine size={24} className="mr-2" />
              <h2 className="text-xl font-bold">Reset Password</h2>
            </div>
            
            <p className="mb-6 text-gray-700">
              Are you sure you want to send a password reset email to <span className="font-semibold">{user.email}</span>?
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setShowResetPasswordConfirmation(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <RiMailSendLine size={18} />
                    Send Reset Email
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Main User Details/Edit Form */}
        {!showDeleteConfirmation && !showResetPasswordConfirmation && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Edit User' : 'User Details'}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                onClick={onClose}
              >
                <RiCloseLine size={20} />
              </button>
            </div>
            
            {formErrors.general && (
              <div className="mb-4 bg-red-100 p-3 rounded-md text-red-800 text-sm">
                {formErrors.general}
              </div>
            )}
            
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0">
                <img
                  className="h-16 w-16 rounded-full object-cover"
                  src={user?.avatar}
                  alt={user?.name}
                />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(user?.status)}`}>
                  {user?.status}
                </span>
              </div>
            </div>
            
            {isEditing ? (
              // Edit Form
              <form>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name*
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      className={`w-full py-2 pl-10 pr-3 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                      placeholder="Enter full name"
                    />
                  </div>
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address*
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      className={`w-full py-2 pl-10 pr-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role*
                    </label>
                    <select
                      name="role"
                      value={userData.role}
                      onChange={handleInputChange}
                      className={`w-full py-2 px-3 border ${formErrors.role ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                    >
                      <option value="">Select role</option>
                      {roles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    {formErrors.role && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.role}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={userData.status}
                      onChange={handleInputChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <RiCheckLine size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              // View Details
              <>
                <div className="border-t border-gray-200 py-4 space-y-4">
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-gray-500">Role</div>
                    <div className="w-2/3 text-sm text-gray-900">{user?.role}</div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-gray-500">Email</div>
                    <div className="w-2/3 text-sm text-gray-900">{user?.email}</div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-gray-500">Status</div>
                    <div className="w-2/3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(user?.status)}`}>
                        {user?.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-gray-500">Join Date</div>
                    <div className="w-2/3 text-sm text-gray-900 flex items-center">
                      <Calendar size={14} className="mr-1 text-gray-400" />
                      {formatDate(user?.joinDate)}
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-gray-500">Last Login</div>
                    <div className="w-2/3 text-sm text-gray-900 flex items-center">
                      <Clock size={14} className="mr-1 text-gray-400" />
                      {formatDateTime(user?.lastLogin)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setShowResetPasswordConfirmation(true)}
                  >
                    <RiLockLine className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                    Reset Password
                  </button>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      onClick={() => setShowDeleteConfirmation(true)}
                    >
                      <RiDeleteBin6Line className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                      Delete
                    </button>
                    
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setIsEditing(true)}
                    >
                      <RiEditLine className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                      Edit
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default UserDetailsModal