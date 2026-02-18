'use client'

import { createClient } from "@/lib/supabase/client"
import ImageUpload from "@/components/features/image-upload"
import Link from "next/link"
import { ArrowLeft, ArrowDownLeft, Loader2 } from "lucide-react"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import AdminNav from "@/components/layout/admin-nav"
import { TreasuryItem } from "@/types"

export default function DepositPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [item, setItem] = useState<TreasuryItem | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [proofUrls, setProofUrls] = useState<string[]>([])
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
        if (proofUrls.length === 0) {
            setError("At least one proof image is required.")
            return
        }
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const quantity = Number(formData.get('quantity'))

        const { data: { user } } = await supabase.auth.getUser()

        // 1. Log Transaction
        const { error: txError } = await supabase.from('treasury_transactions').insert({
            item_id: id,
            user_id: user?.id,
            type: 'DEPOSIT',
            quantity: quantity,
            proof_image_urls: proofUrls, // Use new array column
            // proof_image_url: proofUrls[0], // Optional: keep for legacy if needed
            notes: formData.get('notes')
        })

        if (txError) {
            console.error("Transaction Error:", txError)
            setError(txError.message)
            setLoading(false)
            return
        }


        // 2. Update Stock
        const { error: updateError } = await supabase.rpc('increment_stock', {
            row_id: id,
            amount: quantity
        })

        // Fallback if RPC doesn't exist yet (Client-side update - slightly risky race condition but ok for MVP)
        if (updateError) {
            const newStock = (item?.stock || 0) + quantity
            await supabase.from('treasury_items').update({ stock: newStock }).eq('id', id)
        }

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
                        <h1 className="text-3xl font-black text-green-500 flex items-center gap-2">
                            <ArrowDownLeft className="w-8 h-8" />
                            Deposit
                        </h1>
                        <p className="text-slate-400">Adding stock to: <span className="text-white font-bold">{item.name}</span></p>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-slate-900 border border-green-500/20 p-6 rounded-2xl space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-black/40 rounded-xl">
                        <div className="text-sm">
                            <p className="text-slate-400">Current Stock</p>
                            <p className="text-2xl font-bold text-white">{item.stock}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-400">Quantity to Add</label>
                        <input
                            name="quantity"
                            type="number"
                            min="1"
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-green-500 text-xl font-bold"
                            placeholder="0"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-400">Proof Image (Required)</label>
                        <p className="text-xs text-slate-500 mb-2">Upload a screenshot/photo as proof of deposit.</p>
                        <div className="border border-white/10 rounded-xl overflow-hidden bg-black/50">
                            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/50 p-4">
                                <ImageUpload
                                    multiple={true}
                                    onUpload={(urls) => {
                                        if (Array.isArray(urls)) setProofUrls(urls)
                                        else if (urls) setProofUrls([urls])
                                        else setProofUrls([])
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-400">Notes (Optional)</label>
                        <textarea
                            name="notes"
                            rows={2}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-green-500"
                            placeholder="Any content details..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing Deposit...
                            </>
                        ) : (
                            <>
                                <ArrowDownLeft className="w-5 h-5" />
                                Confirm Deposit
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
