import React, { useState, useEffect } from 'react'
import AdminSidebar from '../components/Dashboard/AdminSidebar'
import AdminTopbar from '../components/Dashboard/AdminTopbar'
import KPI from '../components/Dashboard/KPI'
import RevenueChart from '../components/Dashboard/RevenueChart'
import OrdersTable from '../components/Dashboard/OrdersTable'

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    aov: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/v1/admin/dashboard')
        if (!response.ok) throw new Error('Failed to fetch dashboard metrics')
        const data = await response.json()
        setMetrics(data.metrics || data)
        setError(null)
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMetrics()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <AdminSidebar />

        <div className="flex-1">
          <AdminTopbar />

          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Overview & quick actions</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                Error loading metrics: {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-card rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KPI label="Revenue" value={`৳${metrics.revenue?.toLocaleString() || 0}`} />
                <KPI label="Orders" value={metrics.orders || 0} />
                <KPI label="Customers" value={metrics.customers || 0} />
                <KPI label="AOV" value={`৳${(metrics.aov || 0).toFixed(2)}`} />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-card rounded-lg p-4 shadow">
                <h3 className="font-semibold text-foreground mb-4">Revenue (30d)</h3>
                <RevenueChart />
              </div>

              <div className="bg-card rounded-lg p-4 shadow">
                <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded">
                    Add Product
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 text-foreground rounded">
                    Export Orders
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-card rounded-lg p-4 shadow">
              <h3 className="font-semibold text-foreground mb-4">Recent Orders</h3>
              <OrdersTable />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
