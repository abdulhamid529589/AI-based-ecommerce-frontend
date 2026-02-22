import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-toastify'

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [expandedMenu, setExpandedMenu] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
    },
    {
      label: 'Orders',
      icon: ShoppingBag,
      path: '/admin/orders',
      submenu: [
        { label: 'All Orders', path: '/admin/orders' },
        { label: 'Pending', path: '/admin/orders?status=pending' },
        { label: 'Processing', path: '/admin/orders?status=processing' },
        { label: 'Shipped', path: '/admin/orders?status=shipped' },
      ],
    },
    {
      label: 'Products',
      icon: Package,
      path: '/admin/products',
      submenu: [
        { label: 'All Products', path: '/admin/products' },
        { label: 'Add Product', path: '/admin/products/add' },
        { label: 'Categories', path: '/admin/categories' },
        { label: 'Inventory', path: '/admin/inventory' },
      ],
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      path: '/admin/analytics',
    },
    {
      label: 'Settings',
      icon: Settings,
      path: '/admin/settings',
    },
  ]

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout')
      dispatch(logout())
      navigate('/login')
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const toggleSubmenu = (label) => {
    setExpandedMenu(expandedMenu === label ? null : label)
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 z-40 ${
          isOpen ? 'w-64' : 'w-20'
        } md:relative`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-center h-20">
          {isOpen && <h1 className="text-xl font-bold text-blue-400">BedTex Admin</h1>}
        </div>

        {/* Menu Items */}
        <nav className="mt-4 space-y-2 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            const hasSubmenu = item.submenu && item.submenu.length > 0
            const isExpanded = expandedMenu === item.label

            return (
              <div key={item.label}>
                <button
                  onClick={() => {
                    if (hasSubmenu) {
                      toggleSubmenu(item.label)
                    } else {
                      navigate(item.path)
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {isOpen && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {hasSubmenu && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </>
                  )}
                </button>

                {/* Submenu */}
                {isOpen && hasSubmenu && isExpanded && (
                  <div className="mt-2 space-y-1 pl-4 border-l border-gray-700">
                    {item.submenu.map((subitem) => (
                      <button
                        key={subitem.label}
                        onClick={() => navigate(subitem.path)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        {subitem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-0 right-0 px-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default AdminSidebar
