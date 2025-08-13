import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  RiShoppingBag3Line, 
  RiUserLine, 
  RiMoneyDollarCircleLine,
  RiArrowUpLine,
  RiArrowDownLine
} from 'react-icons/ri'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Stats data
  const statsData = [
    {
      id: 1,
      title: 'Total Sales',
      value: '$48,258.32',
      percentage: 12.5,
      isIncrease: true,
      icon: RiMoneyDollarCircleLine,
      color: 'primary'
    },
    {
      id: 2,
      title: 'Total Orders',
      value: '356',
      percentage: 8.2,
      isIncrease: true,
      icon: RiShoppingBag3Line,
      color: 'secondary'
    },
    {
      id: 3,
      title: 'Total Customers',
      value: '1,245',
      percentage: 3.8,
      isIncrease: false,
      icon: RiUserLine,
      color: 'accent'
    }
  ]
  
  // Chart data
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4200 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5800 },
    { name: 'Jul', sales: 7000 },
    { name: 'Aug', sales: 8000 },
    { name: 'Sep', sales: 7500 },
    { name: 'Oct', sales: 9000 },
    { name: 'Nov', sales: 8200 },
    { name: 'Dec', sales: 9800 }
  ]
  
  // Order status data
  const orderStatusData = [
    { status: 'Pending', value: 120 },
    { status: 'Processing', value: 86 },
    { status: 'Shipped', value: 102 },
    { status: 'Delivered', value: 284 },
    { status: 'Cancelled', value: 32 }
  ]
  
  // Order status colors
  const COLORS = ['#FFC107', '#6C63FF', '#42C2B8', '#4CAF50', '#F44336']
  
  // Top selling products
  const topSellingProducts = [
    { id: 1, name: 'Wireless Bluetooth Headphones', price: 79.99, sold: 158, stock: 42 },
    { id: 2, name: 'Smartphone Case', price: 24.99, sold: 143, stock: 78 },
    { id: 3, name: 'Smart Watch', price: 159.99, sold: 98, stock: 15 },
    { id: 4, name: 'Portable Power Bank', price: 49.99, sold: 87, stock: 54 },
    { id: 5, name: 'Wireless Earbuds', price: 89.99, sold: 76, stock: 23 }
  ]
  
  // Recent orders
  const recentOrders = [
    { id: 'ORD-2023-1A', customer: 'John Doe', date: '2023-12-01', amount: 153.99, status: 'Delivered' },
    { id: 'ORD-2023-2B', customer: 'Sarah Smith', date: '2023-12-02', amount: 79.99, status: 'Shipped' },
    { id: 'ORD-2023-3C', customer: 'Michael Johnson', date: '2023-12-03', amount: 249.99, status: 'Pending' },
    { id: 'ORD-2023-4D', customer: 'Emily Brown', date: '2023-12-04', amount: 124.50, status: 'Processing' },
    { id: 'ORD-2023-5E', customer: 'David Wilson', date: '2023-12-05', amount: 49.99, status: 'Cancelled' }
  ]
  
  // Category sales data
  const categorySalesData = [
    { name: 'Electronics', sales: 8500 },
    { name: 'Clothing', sales: 6200 },
    { name: 'Home', sales: 5100 },
    { name: 'Beauty', sales: 3700 },
    { name: 'Sports', sales: 2900 }
  ]
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-lg animate-pulse">
              <div className="h-full bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
          <div className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Admin</p>
        </div>
        <div className="mt-4 md:mt-0">
          <select 
            className="input w-44"
            defaultValue="thisMonth"
          >
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="thisYear">This Year</option>
            <option value="allTime">All Time</option>
          </select>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((stat) => (
          <motion.div 
            key={stat.id}
            className="card p-6"
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900">{stat.value}</h3>
                <div className={`flex items-center mt-2 ${stat.isIncrease ? 'text-success-600' : 'text-error-600'}`}>
                  {stat.isIncrease ? <RiArrowUpLine size={16} /> : <RiArrowDownLine size={16} />}
                  <span className="text-sm font-medium ml-1">{stat.percentage}%</span>
                  <span className="text-gray-500 text-sm ml-1">vs previous period</span>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon size={24} className={`text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend */}
        <motion.div 
          className="card lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Sales Trend</h2>
            <select className="input w-32 py-1 text-sm">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly" selected>Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6C63FF" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)', 
                    border: 'none',
                    padding: '10px' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#6C63FF" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Order Status */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {orderStatusData.map((item, index) => (
              <div key={item.status} className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <div 
                    className="w-3 h-3 rounded-full mr-1" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-xs font-medium">{item.status}</span>
                </div>
                <p className="text-sm font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Sold</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {topSellingProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="py-3">{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.sold}</td>
                    <td>
                      {product.stock < 20 ? (
                        <span className="badge badge-error">Low: {product.stock}</span>
                      ) : (
                        product.stock
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {/* Recent Orders */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 font-medium">{order.id}</td>
                    <td>{order.customer}</td>
                    <td>${order.amount}</td>
                    <td>
                      <span 
                        className={`badge ${
                          order.status === 'Delivered' ? 'badge-success' : 
                          order.status === 'Shipped' || order.status === 'Processing' ? 'badge-info' : 
                          order.status === 'Pending' ? 'badge-warning' : 
                          'badge-error'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      
      {/* Category Sales */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Sales by Category</h2>
          <select className="input w-32 py-1 text-sm">
            <option value="thisWeek">This Week</option>
            <option value="thisMonth" selected>This Month</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categorySalesData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)', 
                  border: 'none',
                  padding: '10px' 
                }} 
              />
              <Bar 
                dataKey="sales" 
                fill="#42C2B8" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard