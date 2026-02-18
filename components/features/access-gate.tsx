'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// ACCESS_CODE is effectively handled by login now, but we check token
const ACCESS_CODE_CHECK = 'true'

export default function AccessGate({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const router = useRouter() // Import from next/navigation

    useEffect(() => {
        const checkAccess = async () => {
            const storedAuth = localStorage.getItem('ryu_access_granted')
            if (storedAuth === 'true') {
                setIsAuthenticated(true)
            } else {
                // Check if user is admin (optional, for safety, but admins are also members)
                const supabase = createClient() // We'll need to import this
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    setIsAuthenticated(true)
                } else {
                    router.push('/login')
                }
            }
        }
        checkAccess()
    }, [router])

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return <>{children}</>
}
