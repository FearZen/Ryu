'use client'

import { Pencil, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type Props = {
    itemId: string
    itemName?: string
}

export default function ItemActions({ itemId, itemName }: Props) {
    const [deleting, setDeleting] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`)) return

        setDeleting(true)
        const { error } = await supabase.from('treasury_items').delete().eq('id', itemId)

        if (error) {
            alert("Failed to delete item: " + error.message)
            setDeleting(false)
        } else {
            router.refresh()
        }
    }

    return (
        <div className="flex gap-2">
            <Link
                href={`/admin/treasury/${itemId}/edit`}
                className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                title="Edit Item"
            >
                <Pencil className="w-4 h-4" />
            </Link>
            <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                title="Delete Item"
            >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
        </div>
    )
}
