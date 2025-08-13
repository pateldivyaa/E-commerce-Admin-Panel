import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../components/users/AuthContext'

const UsersPage = () => {
  // State variables
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [selectedRole, setSelectedRole] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [error, setError] = useState('')
  
  // Get auth context - including the registeredUsers array
  const { currentUser, registeredUsers, storeRegisteredUser } = useAuth();
  
  // API URL from environment or default
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  // Load users from MongoDB and merge with registered users
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // First try to get token from localStorage for backward compatibility
        const storedToken = localStorage.getItem('token');
        // Then use either the token from currentUser or the stored token
        const token = currentUser?.token || storedToken;
        
        let apiUsers = [];
        
        if (token) {
          try {
            console.log("Fetching users with token:", token);
            // Make authenticated API call to get all users
            const response = await axios.get(`${apiUrl}/getAll`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            console.log("API response:", response.data);
            
            if (response.data && Array.isArray(response.data)) {
              // Transform the data to match our expected format
              apiUsers = response.data.map(user => ({
                id: user._id || user.id,
                name: user.name || 'Unknown',
                lastName: user.lastName || '',
                email: user.email || 'No email',
                role: user.role || 'User',
                status: user.status || 'Active',
                joinDate: user.createdAt || new Date().toISOString(),
                lastLogin: user.lastLogin || null,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`
              }));
              
              console.log("Transformed users:", apiUsers);
            }
          } catch (apiError) {
            console.error("API error:", apiError);
            throw apiError; // Re-throw to be caught by outer try/catch
          }
        } else {
          console.log("No authentication token found");
          throw new Error("No authentication token found");
        }
        
        // Merge API users with registered users from AuthContext
        const mergedUsers = mergeUserLists(apiUsers, registeredUsers);
        console.log("Merged users:", mergedUsers);
        
        if (mergedUsers.length > 0) {
          setUsers(mergedUsers);
          setFilteredUsers(mergedUsers);
        } else {
          // Only fall back to demo users if we have absolutely no users
          handleFallbackUser();
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError('Error fetching users. Please check your connection or login again.');
        handleFallbackUser();
      } finally {
        setIsLoading(false);
      }
    };
    
    // Helper to merge user lists, prioritizing API data but including all users
    const mergeUserLists = (apiUsers, localUsers) => {
      const mergedList = [...apiUsers];
      const apiEmails = new Set(apiUsers.map(user => user.email));
      
      // Add local users that aren't already in the API list
      if (localUsers && Array.isArray(localUsers)) {
        localUsers.forEach(localUser => {
          if (!apiEmails.has(localUser.email)) {
            mergedList.push(localUser);
          }
        });
      }
      
      return mergedList;
    };
    
    const handleFallbackUser = () => {
      // Use demo data if no current user or API fails
      let fallbackUsers = [];
      
      if (currentUser) {
        // Create a user entry for the logged-in user
        fallbackUsers.push({
          id: "current-user",
          name: currentUser.name || currentUser.email.split('@')[0],
          lastName: currentUser.lastName || "",
          email: currentUser.email,
          role: currentUser.role || "User",
          status: "Active",
          joinDate: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || currentUser.email.split('@')[0])}&background=random`
        });
      }
      
      // Include registered users from AuthContext
      if (registeredUsers && registeredUsers.length > 0) {
        fallbackUsers = [...fallbackUsers, ...registeredUsers];
      } else {
        // Only add dummy users if we have no registered users at all
        fallbackUsers = [
          ...fallbackUsers,
          {
            id: 1,
            name: 'John',
            lastName: 'Smith',
            email: 'john.smith@example.com',
            role: 'Admin',
            status: 'Active',
            joinDate: '2023-01-15',
            lastLogin: '2023-12-01T14:30:00',
            avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=random'
          },
          {
            id: 2,
            name: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.j@example.com',
            role: 'Manager',
            status: 'Active',
            joinDate: '2023-03-22',
            lastLogin: '2023-11-28T09:15:00',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random'
          }
        ];
      }
      
      console.log("Using fallback users:", fallbackUsers);
      setUsers(fallbackUsers);
      setFilteredUsers(fallbackUsers);
    };
    
    fetchUsers();
  }, [apiUrl, currentUser, registeredUsers]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading users data...</p>
      </div>
    );
  }

  // Show user data display
  return (
    <motion.div
      className="min-h-screen bg-gray-100 p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MongoDB Users</h1>
            <p className="text-gray-500">Showing users from your MongoDB database</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* Users Table Display */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {user.role || 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No users found. Register a new user to see them here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UsersPage;