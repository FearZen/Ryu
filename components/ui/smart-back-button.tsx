'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SmartBackButton({
    fallbackRoute = '/',
    className,
    children
}: {
    fallbackRoute?: string,
    className?: string,
    children?: React.ReactNode
}) {
    const [backLink, setBackLink] = useState(fallbackRoute)
    const [label, setLabel] = useState('Return to Base')
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            // Check for admin user first
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setBackLink('/admin/dashboard')
                setLabel('Return to Command')
                return
            }

            // Check for member access
            const hasMemberAccess = localStorage.getItem('ryu_access_granted') === 'true'
            if (hasMemberAccess) {
                setBackLink('/dashboard')
                setLabel('Return to Base')
            }
        }
        checkUser()
    }, [supabase])

    if (children) {
        return (
            <Link href={backLink} className={className}>
                {children}
            </Link>
        )
    }

    return (
        <Link href={backLink} className={`inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors group mb-8 ${className || ''}`}>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all">
                <span className="group-hover:-translate-x-0.5 transition-transform">
                    <ArrowLeft className="w-4 h-4" />
                </span>
            </div>
            <span className="text-sm font-mono uppercase tracking-widest">{label}</span>
        </Link>
    )
}
