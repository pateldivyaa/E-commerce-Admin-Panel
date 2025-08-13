import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  RiSearchLine, 
  RiFilter3Line, 
  RiArrowDownSLine, 
  RiArrowUpSLine,
  RiEyeLine,
  RiDeleteBin6Line,
  RiCheckLine,
  RiCloseLine,
  RiTruckLine,
  RiDownload2Line
} from 'react-icons/ri'
import { format } from 'date-fns'

const OrdersPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  
  // Simulated order data
  const dummyOrders = [
    
    { 
      id: 'ORD-2023-001', 
      customer: 'John Smith', 
      email: 'john.smith@example.com',
      date: '2023-12-01T14:30:00', 
      amount: 156.99, 
      status: 'Delivered',
      items: 3,
      payment: 'Credit Card',
      shippingAddress: '123 Main St, Anytown, CA 12345',
      products: [
        { id: 'PRD-001', name: 'Wireless Headphones', price: 59.99, quantity: 1 },
        { id: 'PRD-002', name: 'Phone Case', price: 19.99, quantity: 1 },
        { id: 'PRD-003', name: 'USB-C Cable', price: 12.99, quantity: 2 }
      ]
    },
    { 
      id: 'ORD-2023-002', 
      customer: 'Jane Doe', 
      email: 'jane.doe@example.com',
      date: '2023-12-03T09:15:00', 
      amount: 89.97, 
      status: 'Shipped',
      items: 1,
      payment: 'PayPal',
      shippingAddress: '456 Oak Ave, Springfield, IL 67890',
      products: [
        { id: 'PRD-005', name: 'Smart Watch', price: 89.97, quantity: 1 }
      ]
    },
    { 
      id: 'ORD-2023-003', 
      customer: 'Robert Johnson', 
      email: 'robert.j@example.com',
      date: '2023-12-05T16:45:00', 
      amount: 214.95, 
      status: 'Pending',
      items: 2,
      payment: 'Credit Card',
      shippingAddress: '789 Pine Blvd, Westfield, NY 54321',
      products: [
        { id: 'PRD-008', name: 'Bluetooth Speaker', price: 79.99, quantity: 1 },
        { id: 'PRD-010', name: 'Tablet Stand', price: 24.99, quantity: 1 },
        { id: 'PRD-012', name: 'Wireless Charger', price: 29.99, quantity: 2 }
      ]
    },
    { 
      id: 'ORD-2023-004', 
      customer: 'Maria Garcia', 
      email: 'maria.g@example.com',
      date: '2023-12-06T11:20:00', 
      amount: 49.99, 
      status: 'Cancelled',
      items: 1,
      payment: 'Debit Card',
      shippingAddress: '101 Cedar St, Lakeside, MI 13579',
      products: [
        { id: 'PRD-015', name: 'Fitness Tracker', price: 49.99, quantity: 1 }
      ]
    },
    { 
      id: 'ORD-2023-005',
      customer: 'Emily Davis',
      email: 'maria.g@example.com',
      date: '2023-12-07T10:00:00',  
      amount: 120.00,
      status: 'Pending',
      items: 2,
      payment: 'Credit Card',
      shippingAddress: '202 Birch St, Hilltop, TX 24680',
      products: [
        { id: 'PRD-018', name: 'Laptop Stand', price: 39.99, quantity: 1 },
        { id: 'PRD-020', name: 'HDMI Cable', price: 15.99, quantity: 2 }
      ] 
    },  

  ]
  
  // Load orders
  useEffect(() => {
    const timer = setTimeout(() => {
      setOrders(dummyOrders)
      setFilteredOrders(dummyOrders)
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Filter orders based on status and search term
  useEffect(() => {
    let result = [...orders]
    
    // Filter by status
    if (selectedStatus !== 'All') {
      result = result.filter(order => order.status === selectedStatus)
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      result = result.filter(
        order => 
          order.id.toLowerCase().includes(lowerSearchTerm) ||
          order.customer.toLowerCase().includes(lowerSearchTerm) ||
          order.email.toLowerCase().includes(lowerSearchTerm)
      )
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]
        
        // Handle date comparison
        if (sortConfig.key === 'date') {
          aValue = new Date(a.date)
          bValue = new Date(b.date)
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    
    setFilteredOrders(result)
  }, [orders, selectedStatus, searchTerm, sortConfig])
  
  const handleSort = (key) => {
    let direction = 'asc'
    
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc'
    }
    
    setSortConfig({ key, direction })
  }
  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null
    }
    
    return sortConfig.direction === 'asc' ? 
      <RiArrowUpSLine className="ml-1" /> : 
      <RiArrowDownSLine className="ml-1" />
  }
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'badge-success'
      case 'Shipped':
        return 'badge-info'
      case 'Pending':
        return 'badge-warning'
      case 'Cancelled':
        return 'badge-error'
      default:
        return 'badge-info'
    }
  }
  
  const toggleFilterMenu = () => {
    setIsFilterOpen(!isFilterOpen)
  }
  
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy')
  }
  
  const formatTime = (dateString) => {
    return format(new Date(dateString), 'h:mm a')
  }
  
  // Handle view order
  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setViewModalOpen(true)
  }
  
  // Handle delete confirmation
  const handleDeleteConfirmation = (order) => {
    setSelectedOrder(order)
    setDeleteModalOpen(true)
  }
  
  // Handle delete order
  const handleDeleteOrder = () => {
    const updatedOrders = orders.filter(order => order.id !== selectedOrder.id)
    setOrders(updatedOrders)
    setDeleteModalOpen(false)
    setSelectedOrder(null)
  }
  
  // Handle export orders
  const handleExportOrders = () => {
    const ordersToExport = filteredOrders.map(order => ({
      'Order ID': order.id,
      'Customer': order.customer,
      'Email': order.email,
      'Date': formatDate(order.date),
      'Time': formatTime(order.date),
      'Amount': `$${order.amount.toFixed(2)}`,
      'Status': order.status,
      'Items': order.items,
      'Payment Method': order.payment
    }))
    
    // Convert to CSV
    const headers = Object.keys(ordersToExport[0])
    const csvContent = [
      headers.join(','),
      ...ordersToExport.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n')
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  // Handle status update
  const handleStatusUpdate = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus } 
        : order
    )
    setOrders(updatedOrders)
  }
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-16 bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    )
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
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500">Manage and track your customer orders</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            className="btn btn-primary flex items-center"
            onClick={handleExportOrders}
          >
            <RiDownload2Line className="mr-2" />
            Export Orders
          </button>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="input pl-10"
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <button 
                className="btn btn-outline w-full sm:w-auto flex items-center"
                onClick={toggleFilterMenu}
              >
                <RiFilter3Line className="mr-2" />
                Filter
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-dropdown z-10">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Filter Orders</h3>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order Status
                      </label>
                      <select 
                        className="input"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-between">
                      <button 
                        className="text-sm text-gray-600 hover:text-gray-800"
                        onClick={() => {
                          setSelectedStatus('All')
                          setIsFilterOpen(false)
                        }}
                      >
                        Reset
                      </button>
                      <button 
                        className="btn btn-primary text-sm px-3 py-1"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <select 
              className="input w-full sm:w-auto"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} className="cursor-pointer">
                  <div className="flex items-center">
                    Order ID
                    {getSortIcon('id')}
                  </div>
                </th>
                <th onClick={() => handleSort('customer')} className="cursor-pointer">
                  <div className="flex items-center">
                    Customer
                    {getSortIcon('customer')}
                  </div>
                </th>
                <th onClick={() => handleSort('date')} className="cursor-pointer">
                  <div className="flex items-center">
                    Date
                    {getSortIcon('date')}
                  </div>
                </th>
                <th onClick={() => handleSort('amount')} className="cursor-pointer">
                  <div className="flex items-center">
                    Amount
                    {getSortIcon('amount')}
                  </div>
                </th>
                <th onClick={() => handleSort('status')} className="cursor-pointer">
                  <div className="flex items-center">
                    Status
                    {getSortIcon('status')}
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium">{order.id}</td>
                    <td>
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.email}</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p>{formatDate(order.date)}</p>
                        <p className="text-xs text-gray-500">{formatTime(order.date)}</p>
                      </div>
                    </td>
                    <td>${order.amount.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button 
                          className="p-1 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100"
                          title="View Order"
                          onClick={() => handleViewOrder(order)}
                        >
                          <RiEyeLine size={18} />
                        </button>
                        
                        {order.status === 'Pending' && (
                          <button 
                            className="p-1 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100"
                            title="Mark as Shipped"
                            onClick={() => handleStatusUpdate(order.id, 'Shipped')}
                          >
                            <RiTruckLine size={18} />
                          </button>
                        )}
                        
                        {order.status === 'Shipped' && (
                          <button 
                            className="p-1 text-gray-500 hover:text-success-600 rounded-full hover:bg-gray-100"
                            title="Mark as Delivered"
                            onClick={() => handleStatusUpdate(order.id, 'Delivered')}
                          >
                            <RiCheckLine size={18} />
                          </button>
                        )}
                        
                        {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                          <button 
                            className="p-1 text-gray-500 hover:text-error-600 rounded-full hover:bg-gray-100"
                            title="Cancel Order"
                            onClick={() => handleStatusUpdate(order.id, 'Cancelled')}
                          >
                            <RiCloseLine size={18} />
                          </button>
                        )}
                        
                        <button 
                          className="p-1 text-gray-500 hover:text-error-600 rounded-full hover:bg-gray-100"
                          title="Delete Order"
                          onClick={() => handleDeleteConfirmation(order)}
                        >
                          <RiDeleteBin6Line size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No orders found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 rounded bg-primary-600 text-white hover:bg-primary-700">
              1
            </button>
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
      
      {/* View Order Modal */}
      {viewModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setViewModalOpen(false)}
              >
                <RiCloseLine size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Order Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span>{formatDate(selectedOrder.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span>{formatTime(selectedOrder.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`badge ${getStatusClass(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span>{selectedOrder.payment}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedOrder.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{selectedOrder.email}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-600">Shipping Address:</span>
                      <span className="mt-1 text-right">{selectedOrder.shippingAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.products.map((product) => (
                        <tr key={product.id}>
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.id}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">${product.price.toFixed(2)}</td>
                          <td className="py-4 px-4">{product.quantity}</td>
                          <td className="py-4 px-4">${(product.price * product.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="3" className="py-3 px-4 text-right font-medium">Subtotal</td>
                        <td className="py-3 px-4">${selectedOrder.amount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="py-3 px-4 text-right font-medium">Total</td>
                        <td className="py-3 px-4 font-semibold">${selectedOrder.amount.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  className="btn btn-outline mr-3"
                  onClick={() => setViewModalOpen(false)}
                >
                  Close
                </button>
                {selectedOrder.status === 'Pending' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      handleStatusUpdate(selectedOrder.id, 'Shipped')
                      setViewModalOpen(false)
                    }}
                  >
                    <RiTruckLine className="mr-2" />
                    Mark as Shipped
                  </button>
                )}
                {selectedOrder.status === 'Shipped' && (
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      handleStatusUpdate(selectedOrder.id, 'Delivered')
                      setViewModalOpen(false)
                    }}
                  >
                    <RiCheckLine className="mr-2" />
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6">
              <div className="text-center">
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-error-100 flex items-center justify-center text-error-600 mb-4">
                    <RiDeleteBin6Line size={24} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Order</h3>
                <p className="text-gray-600">
                  Are you sure you want to delete order <span className="font-medium">{selectedOrder.id}</span>? 
                  This action cannot be undone.
                </p>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  className="btn btn-outline"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-error"
                  onClick={handleDeleteOrder}
                >
                  Delete Order
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default OrdersPage