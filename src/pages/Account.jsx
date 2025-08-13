import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { 
  RiUser3Line, 
  RiLockLine, 
  RiNotification3Line, 
  RiShieldLine,
  RiUploadCloud2Line,
  RiEyeLine,
  RiEyeOffLine,
  RiCheckLine
} from 'react-icons/ri'

const Account = () => {
  const { currentUser, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [profileImage, setProfileImage] = useState(currentUser?.profilePicture)
  const [name, setName] = useState(currentUser?.name || '')
  const [email, setEmail] = useState(currentUser?.email || '')
  const [phone, setPhone] = useState(currentUser?.phone || '')
  const [address, setAddress] = useState(currentUser?.address || '')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const fileInputRef = useRef(null)
  
  const tabs = [
    { id: 'profile', label: 'Profile', icon: RiUser3Line },
    { id: 'security', label: 'Security', icon: RiLockLine },
    { id: 'notifications', label: 'Notifications', icon: RiNotification3Line },
    { id: 'privacy', label: 'Privacy', icon: RiShieldLine }
  ]
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setProfileImage(reader.result)
        updateProfile({ profilePicture: reader.result })
        toast.success('Profile picture updated successfully')
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleProfileUpdate = (e) => {
    e.preventDefault()
    updateProfile({ name, email, phone, address })
    toast.success('Profile information updated successfully')
  }
  
  const handlePasswordUpdate = (e) => {
    e.preventDefault()
    // Password validation and update logic would go here
    toast.success('Password updated successfully')
  }
  
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-500">Manage your profile and preferences</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-card p-4">
          <ul className="space-y-1">
            {tabs.map(tab => (
              <li key={tab.id}>
                <button
                  className={`flex items-center w-full p-3 rounded-lg transition-all ${
                    activeTab === tab.id 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon size={20} className="flex-shrink-0" />
                  <span className="ml-3 font-medium">{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div 
            className="bg-white rounded-lg shadow-card p-6"
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                
                <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
                  <div className="mb-4 md:mb-0 md:mr-8">
                    <div className="relative w-24 h-24">
                      <img 
                        src={profileImage || "/assets/default-avatar.png"} 
                        alt={currentUser?.name || "User"} 
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      <button 
                        className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full shadow-md"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <RiUploadCloud2Line size={16} />
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{currentUser?.name || "User"}</h3>
                    <p className="text-gray-500">{currentUser?.email || "user@example.com"}</p>
                    <p className="text-gray-500 mt-1">{currentUser?.role || "Admin"}</p>
                  </div>
                </div>
                
                <form onSubmit={handleProfileUpdate}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="input"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        className="input"
                        rows="3"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your address"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Security Settings */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                  <form onSubmit={handlePasswordUpdate}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            className="input pr-10"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? (
                              <RiEyeOffLine className="h-5 w-5 text-gray-400" />
                            ) : (
                              <RiEyeLine className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            className="input pr-10"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <RiEyeOffLine className="h-5 w-5 text-gray-400" />
                            ) : (
                              <RiEyeLine className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 mb-1">Password requirements:</p>
                          <ul className="text-xs text-gray-500 space-y-1">
                            <li className="flex items-center">
                              <RiCheckLine className="text-success-500 mr-1" />
                              Minimum 8 characters
                            </li>
                            <li className="flex items-center">
                              <RiCheckLine className="text-success-500 mr-1" />
                              At least one uppercase letter
                            </li>
                            <li className="flex items-center">
                              <RiCheckLine className="text-success-500 mr-1" />
                              At least one number
                            </li>
                            <li className="flex items-center">
                              <RiCheckLine className="text-success-500 mr-1" />
                              At least one special character
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="input pr-10"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <RiEyeOffLine className="h-5 w-5 text-gray-400" />
                            ) : (
                              <RiEyeLine className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button type="submit" className="btn btn-primary">
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                  <p className="text-gray-500 mb-4">Add an extra layer of security to your account by enabling two-factor authentication.</p>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-factor authentication</h4>
                      <p className="text-sm text-gray-500">Protect your account with an extra security layer</p>
                    </div>
                    <button className="btn btn-outline">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">New orders</p>
                          <p className="text-sm text-gray-500">Receive emails when new orders are placed</p>
                        </div>
                        <div className="relative inline-block w-12 h-6">
                          <input 
                            type="checkbox" 
                            id="new-orders" 
                            className="sr-only"
                            defaultChecked
                          />
                          <label 
                            htmlFor="new-orders" 
                            className="block w-12 h-6 bg-gray-300 rounded-full cursor-pointer transition-colors duration-200 ease-in-out before:absolute before:top-1 before:left-1 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform before:duration-200 before:ease-in-out checked:bg-primary-600 checked:before:transform checked:before:translate-x-6"
                          ></label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">Order status updates</p>
                          <p className="text-sm text-gray-500">Receive emails when order status changes</p>
                        </div>
                        <div className="relative inline-block w-12 h-6">
                          <input 
                            type="checkbox" 
                            id="order-updates" 
                            className="sr-only"
                            defaultChecked
                          />
                          <label 
                            htmlFor="order-updates" 
                            className="block w-12 h-6 bg-gray-300 rounded-full cursor-pointer transition-colors duration-200 ease-in-out before:absolute before:top-1 before:left-1 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform before:duration-200 before:ease-in-out checked:bg-primary-600 checked:before:transform checked:before:translate-x-6"
                          ></label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">Product inventory alerts</p>
                          <p className="text-sm text-gray-500">Receive emails when products are low in stock</p>
                        </div>
                        <div className="relative inline-block w-12 h-6">
                          <input 
                            type="checkbox" 
                            id="inventory-alerts" 
                            className="sr-only"
                            defaultChecked
                          />
                          <label 
                            htmlFor="inventory-alerts" 
                            className="block w-12 h-6 bg-gray-300 rounded-full cursor-pointer transition-colors duration-200 ease-in-out before:absolute before:top-1 before:left-1 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform before:duration-200 before:ease-in-out checked:bg-primary-600 checked:before:transform checked:before:translate-x-6"
                          ></label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">Marketing emails</p>
                          <p className="text-sm text-gray-500">Receive promotional emails and offers</p>
                        </div>
                        <div className="relative inline-block w-12 h-6">
                          <input 
                            type="checkbox" 
                            id="marketing-emails" 
                            className="sr-only"
                          />
                          <label 
                            htmlFor="marketing-emails" 
                            className="block w-12 h-6 bg-gray-300 rounded-full cursor-pointer transition-colors duration-200 ease-in-out before:absolute before:top-1 before:left-1 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform before:duration-200 before:ease-in-out checked:bg-primary-600 checked:before:transform checked:before:translate-x-6"
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">New orders</p>
                          <p className="text-sm text-gray-500">Receive push notifications when new orders are placed</p>
                        </div>
                        <div className="relative inline-block w-12 h-6">
                          <input 
                            type="checkbox" 
                            id="push-new-orders" 
                            className="sr-only"
                            defaultChecked
                          />
                          <label 
                            htmlFor="push-new-orders" 
                            className="block w-12 h-6 bg-gray-300 rounded-full cursor-pointer transition-colors duration-200 ease-in-out before:absolute before:top-1 before:left-1 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform before:duration-200 before:ease-in-out checked:bg-primary-600 checked:before:transform checked:before:translate-x-6"
                          ></label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">Order status updates</p>
                          <p className="text-sm text-gray-500">Receive push notifications when order status changes</p>
                        </div>
                        <div className="relative inline-block w-12 h-6">
                          <input 
                            type="checkbox" 
                            id="push-order-updates" 
                            className="sr-only"
                            defaultChecked
                          />
                          <label 
                            htmlFor="push-order-updates" 
                            className="block w-12 h-6 bg-gray-300 rounded-full cursor-pointer transition-colors duration-200 ease-in-out before:absolute before:top-1 before:left-1 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform before:duration-200 before:ease-in-out checked:bg-primary-600 checked:before:transform checked:before:translate-x-6"
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button type="button" className="btn btn-primary">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
            
            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Data Privacy</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">Cookie preferences</p>
                          <p className="text-sm text-gray-500">Manage cookies and tracking technologies</p>
                        </div>
                        <button className="btn btn-outline text-sm py-1">
                          Manage
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">Data collection</p>
                          <p className="text-sm text-gray-500">Allow us to collect usage data to improve our services</p>
                        </div>
                        <div className="relative inline-block w-12 h-6">
                          <input 
                            type="checkbox" 
                            id="data-collection" 
                            className="sr-only"
                            defaultChecked
                          />
                          <label 
                            htmlFor="data-collection" 
                            className="block w-12 h-6 bg-gray-300 rounded-full cursor-pointer transition-colors duration-200 ease-in-out before:absolute before:top-1 before:left-1 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform before:duration-200 before:ease-in-out checked:bg-primary-600 checked:before:transform checked:before:translate-x-6"
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Account Data</h3>
                    <div className="space-y-4">
                      <div>
                        <button className="btn btn-outline text-error-600 border-error-600 hover:bg-error-50">
                          Download my data
                        </button>
                        <p className="mt-1 text-sm text-gray-500">Download a copy of all your personal data</p>
                      </div>
                      
                      <div>
                        <button className="btn btn-outline text-error-600 border-error-600 hover:bg-error-50">
                          Delete account
                        </button>
                        <p className="mt-1 text-sm text-gray-500">Permanently delete your account and all data</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button type="button" className="btn btn-primary">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Account