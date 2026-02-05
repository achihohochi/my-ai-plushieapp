"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/components/admin-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileSpreadsheet,
  Download,
  Upload,
  LogOut,
  Smartphone,
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const { adminKey, isAuthenticated, logout } = useAdmin()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingVenmo: 0,
  })
  const [syncing, setSyncing] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && adminKey) {
      fetchStats()
    }
  }, [isAuthenticated, adminKey])

  const fetchStats = async () => {
    try {
      // Fetch orders count and revenue
      const ordersRes = await fetch('/api/admin/orders', {
        headers: { 'x-admin-key': adminKey || '' },
      })
      const ordersData = await ordersRes.json()

      // Fetch products count
      const productsRes = await fetch('/api/products')
      const productsData = await productsRes.json()

      // Fetch pending Venmo count
      const venmoRes = await fetch('/api/admin/venmo/pending', {
        headers: { 'x-admin-key': adminKey || '' },
      })
      const venmoData = await venmoRes.json()

      if (ordersData.success) {
        const revenue = ordersData.data.reduce(
          (sum: number, order: any) => sum + parseFloat(order.total),
          0
        )
        setStats({
          totalOrders: ordersData.count,
          totalProducts: productsData.count,
          totalRevenue: revenue,
          pendingVenmo: venmoData.data?.length ?? 0,
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSyncFromSheets = async () => {
    setSyncing(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/sync-sheets', {
        method: 'POST',
        headers: { 'x-admin-key': adminKey || '' },
      })

      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: data.message })
        fetchStats()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to sync from Google Sheets' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to sync from Google Sheets' })
    } finally {
      setSyncing(false)
    }
  }

  const handleExportToSheets = async () => {
    setExporting(true)
    setMessage(null)

    try {
      // Export products
      const productsRes = await fetch('/api/admin/sync-sheets', {
        method: 'PUT',
        headers: { 'x-admin-key': adminKey || '' },
      })

      // Export orders
      const ordersRes = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'x-admin-key': adminKey || '' },
      })

      const productsData = await productsRes.json()
      const ordersData = await ordersRes.json()

      if (productsData.success && ordersData.success) {
        setMessage({
          type: 'success',
          text: `Exported ${productsData.exported} products and ${ordersData.exported} orders`,
        })
      } else {
        setMessage({ type: 'error', text: 'Failed to export to Google Sheets' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export to Google Sheets' })
    } finally {
      setExporting(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="outline">View Store</Button>
              </Link>
              <Button variant="destructive" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Google Sheets Integration */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              <CardTitle>Google Sheets Integration</CardTitle>
            </div>
            <CardDescription>
              Sync product data with Google Sheets for easy management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleSyncFromSheets} disabled={syncing || exporting}>
                <Download className="h-4 w-4 mr-2" />
                {syncing ? 'Syncing...' : 'Import from Sheets'}
              </Button>
              <Button
                variant="outline"
                onClick={handleExportToSheets}
                disabled={syncing || exporting}
              >
                <Upload className="h-4 w-4 mr-2" />
                {exporting ? 'Exporting...' : 'Export to Sheets'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Make sure to set up Google Sheets credentials in your environment variables.
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/admin/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <CardTitle>Manage Orders</CardTitle>
                </div>
                <CardDescription>View and manage customer orders</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <CardTitle>Manage Products</CardTitle>
                </div>
                <CardDescription>Update product prices and inventory</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/venmo">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <CardTitle>Venmo Payments</CardTitle>
                  </div>
                  {stats.pendingVenmo > 0 && (
                    <div className="bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      {stats.pendingVenmo}
                    </div>
                  )}
                </div>
                <CardDescription>
                  {stats.pendingVenmo > 0
                    ? `${stats.pendingVenmo} payment${stats.pendingVenmo > 1 ? 's' : ''} awaiting verification`
                    : 'Verify Venmo payments'}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
