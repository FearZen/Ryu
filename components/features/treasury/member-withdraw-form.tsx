'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowUpRight, X, Upload, Plus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

type WithdrawFormProps = {
    items: Array<{
        id: string
        name: string
        stock: number
    }>
    onSuccess: () => void
}

type WithdrawItem = {
    itemId: string
    quantity: number
}

export default function MemberWithdrawForm({ items, onSuccess }: WithdrawFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    // Multi-item state
    const [withdrawItems, setWithdrawItems] = useState<WithdrawItem[]>([{ itemId: '', quantity: 1 }])
    const [requesterName, setRequesterName] = useState('')
    const [treasurerName, setTreasurerName] = useState('')
    const [notes, setNotes] = useState('')
    const [proofImage, setProofImage] = useState<File | null>(null)
    const [proofImagePreview, setProofImagePreview] = useState<string | null>(null)

    const supabase = createClient()

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setProofImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setProofImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const addItem = () => {
        setWithdrawItems([...withdrawItems, { itemId: '', quantity: 1 }])
    }

    const removeItem = (index: number) => {
        if (withdrawItems.length > 1) {
            setWithdrawItems(withdrawItems.filter((_, i) => i !== index))
        }
    }

    const updateItem = (index: number, field: 'itemId' | 'quantity', value: string | number) => {
        const updated = [...withdrawItems]
        updated[index] = { ...updated[index], [field]: value }
        setWithdrawItems(updated)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            // Validation
            if (!requesterName.trim()) throw new Error('Requester name is required')
            if (!treasurerName.trim()) throw new Error('Treasurer name is required')

            // Validate all items
            for (let i = 0; i < withdrawItems.length; i++) {
                const item = withdrawItems[i]
                if (!item.itemId) throw new Error(`Please select item #${i + 1}`)
                if (item.quantity < 1) throw new Error(`Quantity for item #${i + 1} must be at least 1`)

                const selectedItem = items.find(it => it.id === item.itemId)
                if (selectedItem && item.quantity > selectedItem.stock) {
                    throw new Error(`Not enough stock for ${selectedItem.name}. Available: ${selectedItem.stock}`)
                }
            }

            // Check for duplicate items
            const itemIds = withdrawItems.map(w => w.itemId)
            if (new Set(itemIds).size !== itemIds.length) {
                throw new Error('Cannot select the same item multiple times. Please combine quantities.')
            }

            // Upload proof image if provided
            let proofImageUrl = null
            if (proofImage) {
                const fileExt = proofImage.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('treasury-proofs')
                    .upload(fileName, proofImage)

                if (uploadError) {
                    console.error('Upload error:', uploadError)
                    throw new Error(`Failed to upload image: ${uploadError.message}`)
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('treasury-proofs')
                    .getPublicUrl(fileName)

                proofImageUrl = publicUrl
            }

            // Create withdrawal transaction (parent transaction)
            const itemsSummary = withdrawItems.map(w => {
                const item = items.find(i => i.id === w.itemId)
                return `${w.quantity}x ${item?.name || 'Unknown'}`
            }).join(', ')

            const { data: transaction, error: txError } = await supabase
                .from('treasury_transactions')
                .insert({
                    item_id: null, // Multi-item, so parent has no single item
                    type: 'WITHDRAW',
                    quantity: withdrawItems.reduce((sum, w) => sum + w.quantity, 0), // Total quantity
                    requester_name: requesterName,
                    treasurer_name: treasurerName,
                    proof_image_url: proofImageUrl,
                    notes: notes || `Multi-item withdrawal: ${itemsSummary}`
                })
                .select()
                .single()

            if (txError) {
                console.error('Transaction error:', txError)
                throw new Error(`Failed to create transaction: ${txError.message}`)
            }

            // Insert each item into treasury_transaction_items
            const transactionItems = withdrawItems.map(w => ({
                transaction_id: transaction.id,
                item_id: w.itemId,
                quantity: w.quantity
            }))

            const { error: itemsError } = await supabase
                .from('treasury_transaction_items')
                .insert(transactionItems)

            if (itemsError) {
                console.error('Items error:', itemsError)
                // Rollback: delete the transaction
                await supabase.from('treasury_transactions').delete().eq('id', transaction.id)
                throw new Error(`Failed to record items: ${itemsError.message}`)
            }

            // Update stock for each item - FETCH FRESH DATA FROM DB
            console.log('Starting stock updates for', withdrawItems.length, 'items')
            for (const w of withdrawItems) {
                // Fetch current stock from database (not from state which might be stale)
                const { data: currentItem, error: fetchError } = await supabase
                    .from('treasury_items')
                    .select('id, name, stock')
                    .eq('id', w.itemId)
                    .single()

                if (fetchError || !currentItem) {
                    console.error('Failed to fetch current item:', fetchError)
                    throw new Error(`Failed to fetch item data: ${fetchError?.message || 'Item not found'}`)
                }

                const newStock = currentItem.stock - w.quantity
                console.log(`Updating ${currentItem.name}: ${currentItem.stock} -> ${newStock}`)

                const { error: stockError } = await supabase
                    .from('treasury_items')
                    .update({ stock: newStock })
                    .eq('id', w.itemId)

                if (stockError) {
                    console.error('Stock update error:', stockError)
                    throw new Error(`Failed to update stock for ${currentItem.name}: ${stockError.message}`)
                }

                console.log(`✅ Stock updated for ${currentItem.name}`)
            }
            console.log('All stock updates completed successfully')

            // Reset form and close
            setIsOpen(false)
            setWithdrawItems([{ itemId: '', quantity: 1 }])
            setRequesterName('')
            setTreasurerName('')
            setNotes('')
            setProofImage(null)
            setProofImagePreview(null)

            onSuccess()
        } catch (err: any) {
            console.error('Withdrawal error:', err)
            setError(err.message || 'Failed to process withdrawal')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-red-500/20 flex items-center gap-2"
            >
                <ArrowUpRight className="w-5 h-5" />
                Request Withdrawal
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-900 border border-white/10 rounded-2xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="sticky top-0 right-0 float-right text-slate-400 hover:text-white z-10 bg-slate-900 rounded-full p-2 mb-2"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2 clear-both">
                                <ArrowUpRight className="w-6 h-6 text-red-500" />
                                Request Withdrawal (Multiple Items)
                            </h2>
                            <p className="text-slate-400 text-sm mb-6">
                                You can withdraw multiple items in one request (e.g., vest, weapon, ammo)
                            </p>

                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Items Section */}
                                <div className="space-y-4 bg-slate-800/30 rounded-xl p-4 border border-white/5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-base font-bold text-white">
                                            Items to Withdraw *
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Add Item
                                        </button>
                                    </div>

                                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                                        {withdrawItems.map((withdrawItem, index) => {
                                            const selectedItem = items.find(i => i.id === withdrawItem.itemId)
                                            return (
                                                <div key={index} className="flex gap-3 items-start p-4 bg-slate-800/70 rounded-xl border border-white/10 shadow-lg">
                                                    <div className="flex-1 space-y-3">
                                                        <div>
                                                            <label className="block text-xs font-bold text-blue-400 mb-2">
                                                                Item #{index + 1}
                                                            </label>
                                                            <select
                                                                value={withdrawItem.itemId}
                                                                onChange={(e) => updateItem(index, 'itemId', e.target.value)}
                                                                className="w-full px-3 py-2.5 bg-slate-900 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                                required
                                                            >
                                                                <option value="">-- Choose item --</option>
                                                                {items.map(item => (
                                                                    <option key={item.id} value={item.id}>
                                                                        {item.name} (Stock: {item.stock})
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-slate-400 mb-2">
                                                                Quantity
                                                                {selectedItem && (
                                                                    <span className="text-green-400 font-normal ml-2">
                                                                        (Max: {selectedItem.stock})
                                                                    </span>
                                                                )}
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                max={selectedItem?.stock || 999}
                                                                value={withdrawItem.quantity}
                                                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                                                className="w-full px-3 py-2.5 bg-slate-900 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    {withdrawItems.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(index)}
                                                            className="mt-7 p-2.5 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors border border-red-500/20"
                                                            title="Remove this item"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Requester Name */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">
                                        Requester Name *
                                        <span className="text-slate-500 font-normal ml-2">
                                            (Person making this request)
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={requesterName}
                                        onChange={(e) => setRequesterName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>

                                {/* Treasurer Name */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">
                                        Treasurer Name *
                                        <span className="text-slate-500 font-normal ml-2">
                                            (Person responsible/approving)
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={treasurerName}
                                        onChange={(e) => setTreasurerName(e.target.value)}
                                        placeholder="Enter treasurer name"
                                        className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>

                                {/* Notes (Optional) */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Add any additional notes (e.g., for war, territory defense, etc.)"
                                        rows={3}
                                        className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                                    />
                                </div>

                                {/* Proof Image (Optional) */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">
                                        Proof Image (Optional)
                                    </label>
                                    <div className="flex items-start gap-4">
                                        <label className="flex-1 px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-slate-400 cursor-pointer hover:bg-slate-700 transition-colors flex items-center gap-2">
                                            <Upload className="w-5 h-5" />
                                            {proofImage ? proofImage.name : 'Choose file...'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                        {proofImagePreview && (
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                                                <Image
                                                    src={proofImagePreview}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        disabled={isLoading}
                                        className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Processing...' : `Withdraw ${withdrawItems.length} Item(s)`}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
