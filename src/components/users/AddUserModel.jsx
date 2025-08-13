  import { useState } from 'react'
  import { motion } from 'framer-motion'
  import {
    RiUserAddLine,
    RiCloseLine,
    RiCheckLine,
    RiAddLine
  } from 'react-icons/ri'
  import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
  import axios from 'axios'

  const AddUserModal = ({ show, onClose, onUserAdded, roles }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
      name: '',
      lastName: '',
      email: '',
      role: '',
      status: 'Active',
      password: '',
      confirmPassword: '',
      sendWelcomeEmail: false
    })
    const [formErrors, setFormErrors] = useState({})

    // API URL from environment or default
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
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
      
      if (!formData.name.trim()) {
        errors.name = 'Name is required'
      }
      
      if (!formData.lastName.trim()) {
        errors.lastName = 'Last name is required'
      }
      
      if (!formData.email.trim()) {
        errors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email is invalid'
      }
      
      if (!formData.role) {
        errors.role = 'Role is required'
      }
      
      if (!formData.password) {
        errors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      }
      
      setFormErrors(errors)
      return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      
      if (!validateForm()) return
      
      setLoading(true)
      
      try {
        // Call the register API endpoint
        const response = await axios.post(`${apiUrl}/register`, {
          name: formData.name,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        });
        
        if (response.data && response.data.message === "User created successfully") {
          // Call the parent component's function to add the user
          onUserAdded({
            name: formData.name,
            lastName: formData.lastName,
            email: formData.email,
            role: formData.role,
            status: formData.status,
            password: formData.password
          });
        } else {
          throw new Error('Registration failed');
        }
        
      } catch (error) {
        console.error('Error adding user:', error);
        setFormErrors({
          ...formErrors,
          general: error.response?.data?.error || 'Failed to add user. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    }

    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${show ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
        
        <motion.div
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New User</h2>
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

            <form onSubmit={handleSubmit}>
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <RiUserAddLine size={32} className="text-gray-400" />
                  </div>
                  <button 
                    type="button"
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md"
                  >
                    <RiAddLine size={16} />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name*
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full py-2 pl-10 pr-3 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Enter first name"
                  />
                </div>
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name*
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full py-2 pl-10 pr-3 border ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Enter last name"
                  />
                </div>
                {formErrors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>
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
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full py-2 pl-10 pr-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Enter email address"
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role*
                  </label>
                  <select
                    name="role"
                    value={formData.role}
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
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password*
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full py-2 pl-10 pr-10 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password*
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full py-2 pl-10 pr-3 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Confirm password"
                  />
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>
                )}
              </div>

              <div className="flex items-center mb-6">
                <input
                  id="sendWelcomeEmail"
                  name="sendWelcomeEmail"
                  type="checkbox"
                  checked={formData.sendWelcomeEmail}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="sendWelcomeEmail" className="ml-2 block text-sm text-gray-900">
                  Send welcome email with login credentials
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <RiCheckLine size={18} />
                      Add User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  export default AddUserModal