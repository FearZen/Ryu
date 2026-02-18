import { createClient } from "@/lib/supabase/server"
import AdminNav from "@/components/layout/admin-nav"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus, Archive, History, ArrowUpRight, ArrowDownLeft, Search, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { TreasuryItem, TreasuryTransaction } from "@/types"
import InventoryChart from "@/components/features/treasury/inventory-chart"
import ItemActions from "@/components/features/treasury/item-actions"

export const revalidate = 0

export default async function TreasuryPage() {
    const supabase = await createClient()

    // Security Check
    const { data: { user } } = await supabase.auth.getUser()
    const { data: myProfile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()

    if (myProfile?.role === 'member') {
        redirect('/treasury')
    }

    // Fetch Items
    const { data: items } = await supabase
        .from('treasury_items')
        .select('*')
        .order('name', { ascending: true })

    // Fetch Recent Transactions with multi-item support
    const { data: transactions } = await supabase
        .from('treasury_transactions')
        .select(`
            *,
            treasury_items(*),
            profiles(*),
            treasury_transaction_items(
                id,
                quantity,
                treasury_items:item_id(*)
            )
        `)
        .order('created_at', { ascending: false })
        .limit(10)

    return (
        <div className="min-h-screen bg-black text-white">
            <AdminNav />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-white mb-2 flex items-center gap-3">
                            <Archive className="w-8 h-8 text-green-500" />
                            TREASURY (BRANGKAS)
                        </h1>
                        <p className="text-slate-400">
                            Manage faction inventory, deposits, and withdrawals.
                        </p>
                    </div>
                    <Link
                        href="/admin/treasury/new"
                        className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-500/20 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Item
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Inventory Grid */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Inventory Stock</h2>
                        </div>

                        {/* Inventory Chart */}
                        <div className="mb-6">
                            <InventoryChart data={items || []} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {items?.map((item: TreasuryItem) => (
                                <div key={item.id} className="bg-slate-900 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all flex gap-4 group">
                                    <div className="relative w-20 h-20 bg-black rounded-xl overflow-hidden shrink-0 border border-white/5">
                                        {(item.image_urls?.[0] || item.image_url) ? (
                                            <Image
                                                src={item.image_urls?.[0] || item.image_url || ''}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-700">
                                                <Archive className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{item.name}</h3>
                                                <span className="text-xs font-bold px-2 py-1 rounded bg-slate-800 text-slate-400 uppercase tracking-wider">{item.category}</span>
                                            </div>
                                            <p className="text-slate-500 text-xs line-clamp-1">{item.description}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-2xl font-black text-blue-400">{item.stock} <span className="text-xs text-slate-500 font-normal">in stock</span></span>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <ItemActions itemId={item.id} itemName={item.name} />

                                                <Link
                                                    href={`/admin/treasury/${item.id}/deposit`}
                                                    className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                                                    title="Deposit"
                                                >
                                                    <ArrowDownLeft className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/treasury/${item.id}/withdraw`}
                                                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                                    title="Withdraw"
                                                >
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!items || items.length === 0) && (
                                <div className="col-span-full py-10 text-center text-slate-500">
                                    No items in treasury. Start by adding one.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Recent Activity */}
                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 h-fit">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <History className="w-5 h-5 text-slate-400" />
                            Recent Activity
                        </h2>
                        {/* Scrollable container with max height */}
                        <div className="space-y-6 relative max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700">
                            {/* Activity Timeline Line */}
                            <div className="absolute top-2 bottom-2 left-2 w-px bg-white/5" />

                            {transactions?.map((tx: any) => (
                                <div key={tx.id} className="relative pl-8 bg-slate-950/50 p-3 rounded-lg border border-white/5">
                                    <div className={`absolute left-[5px] top-4 w-2 h-2 rounded-full ${tx.type === 'DEPOSIT' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} />

                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${tx.type === 'DEPOSIT' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {tx.type}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-mono">
                                            {new Date(tx.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="mb-2">
                                        {/* Multi-item transaction */}
                                        {tx.treasury_transaction_items && tx.treasury_transaction_items.length > 0 ? (
                                            <div className="space-y-1">
                                                <p className="text-white text-xs font-bold mb-1">Items:</p>
                                                {tx.treasury_transaction_items.map((item: any, idx: number) => (
                                                    <p key={idx} className="text-white text-sm pl-2">
                                                        <span className="font-bold">{item.quantity}x</span> {item.treasury_items?.name}
                                                    </p>
                                                ))}
                                            </div>
                                        ) : (
                                            /* Single-item transaction (legacy) */
                                            <p className="text-white text-sm">
                                                <span className="font-bold">{tx.quantity}x</span> {tx.treasury_items?.name || 'Unknown Item'}
                                            </p>
                                        )}
                                        <p className="text-xs text-slate-400 mt-2">
                                            {tx.requester_name ? (
                                                <>Requested by <span className="text-blue-400">{tx.requester_name}</span></>
                                            ) : (
                                                <>by <span className="text-blue-400">{tx.profiles?.username || 'Unknown'}</span></>
                                            )}
                                        </p>
                                        {tx.treasurer_name && (
                                            <p className="text-xs text-slate-400">
                                                Approved by <span className="text-green-400">{tx.treasurer_name}</span>
                                            </p>
                                        )}
                                        {tx.notes && (
                                            <p className="text-xs text-slate-300 mt-1 italic border-l-2 border-slate-600 pl-2">
                                                "{tx.notes}"
                                            </p>
                                        )}
                                    </div>

                                    {tx.proof_image_url && (
                                        <div className="mt-2">
                                            <a href={tx.proof_image_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 underline flex items-center gap-1">
                                                <ImageIcon className="w-3 h-3" />
                                                View Proof
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {(!transactions || transactions.length === 0) && (
                                <p className="text-slate-500 text-sm text-center py-4">No recent activity.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
