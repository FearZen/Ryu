'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts'
import { TrendingUp, Package, AlertTriangle } from 'lucide-react'

type Props = {
    data: {
        name: string
        stock: number
        category: string
    }[]
}

export default function InventoryChart({ data }: Props) {
    if (!data || data.length === 0) return null

    // Sort data by stock desc
    const sortedData = [...data].sort((a, b) => b.stock - a.stock).slice(0, 10) // Top 10 items

    // Calculate statistics
    const totalItems = data.length
    const totalStock = data.reduce((sum, item) => sum + item.stock, 0)
    const lowStockItems = data.filter(item => item.stock < 10).length

    // Category distribution for pie chart
    const categoryData = data.reduce((acc, item) => {
        const existing = acc.find(c => c.name === item.category)
        if (existing) {
            existing.value += item.stock
        } else {
            acc.push({ name: item.category, value: item.stock })
        }
        return acc
    }, [] as { name: string, value: number }[])

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']

    return (
        <div className="w-full space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider">Total Items</p>
                            <p className="text-2xl font-black text-blue-400">{totalItems}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider">Total Stock</p>
                            <p className="text-2xl font-black text-green-400">{totalStock}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider">Low Stock</p>
                            <p className="text-2xl font-black text-red-400">{lowStockItems}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar Chart - Stock Distribution */}
                <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                        Stock Distribution (Top 10)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={sortedData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorStock" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                            <XAxis
                                type="number"
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                stroke="#f8fafc"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={120}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    borderColor: '#334155',
                                    color: '#f8fafc',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                                }}
                                itemStyle={{ color: '#22c55e' }}
                                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                                labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                            />
                            <Bar
                                dataKey="stock"
                                radius={[0, 8, 8, 0]}
                                barSize={24}
                                animationDuration={800}
                            >
                                {sortedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.stock < 10 ? '#ef4444' : 'url(#colorStock)'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart - Category Distribution */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full" />
                        By Category
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                animationDuration={800}
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    borderColor: '#334155',
                                    color: '#f8fafc',
                                    borderRadius: '8px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
