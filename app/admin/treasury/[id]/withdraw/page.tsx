'use client'

import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Loader2, AlertTriangle } from "lucide-react"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import AdminNav from "@/components/layout/admin-nav"
import { TreasuryItem } from "@/types"

export default function WithdrawPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [item, setItem] = useState<TreasuryItem | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const fetchItem = async () => {
            const { data } = await supabase.from('treasury_items').select('*').eq('id', id).single()
            if (data) setItem(data)
        }
        fetchItem()
    }, [id])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const quantity = Number(formData.get('quantity'))

        if (quantity > (item?.stock || 0)) {
            setError("Insufficient stock!")
            setLoading(false)
            return
        }

        const { data: { user } } = await supabase.auth.getUser()

        // 1. Log Transaction
        const { error: txError } = await supabase.from('treasury_transactions').insert({
            item_id: id,
            user_id: user?.id,
            type: 'WITHDRAW',
            quantity: quantity,
            notes: formData.get('notes')
        })

        if (txError) {
            setError(txError.message)
            setLoading(false)
            return
        }

        // 2. Update Stock
        const newStock = (item?.stock || 0) - quantity
        await supabase.from('treasury_items').update({ stock: newStock }).eq('id', id)

        setLoading(false)
        router.push('/admin/treasury')
        router.refresh()
    }

    if (!item) return <div className="p-10 text-white">Loading item...</div>

    return (
        <div className="min-h-screen bg-black text-white">
            <AdminNav />

            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/treasury" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-red-500 flex items-center gap-2">
                            <ArrowUpRight className="w-8 h-8" />
                            Withdraw
                        </h1>
                        <p className="text-slate-400">Taking items from: <span className="text-white font-bold">{item.name}</span></p>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-slate-900 border border-red-500/20 p-6 rounded-2xl space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-black/40 rounded-xl border border-white/5">
                        <div className="text-sm">
                            <p className="text-slate-400">Available Stock</p>
                            <p className="text-2xl font-bold text-white">{item.stock}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-400">Quantity to Withdraw</label>
                        <input
                            name="quantity"
                            type="number"
                            min="1"
                            max={item.stock}
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500 text-xl font-bold"
                            placeholder="0"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-400">Reason / Notes</label>
                        <textarea
                            name="notes"
                            rows={2}
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500"
                            placeholder="Used for operation X..."
                        />
                    </div>

                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3 text-yellow-500 text-sm">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <p>This action will be logged under your user account and cannot be undone.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing Withdrawal...
                            </>
                        ) : (
                            <>
                                <ArrowUpRight className="w-5 h-5" />
                                Confirm Withdrawal
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
