'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function DebugPage() {
    const [status, setStatus] = useState('Checking...')
    const [envCheck, setEnvCheck] = useState<any>({})
    const [dbCheck, setDbCheck] = useState<any>(null)

    useEffect(() => {
        const runDiagnostics = async () => {
            // 1. Env Vars
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL
            const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

            setEnvCheck({
                url_val: url,
                key_exists: !!key,
                key_length: key?.length
            })

            if (!url || !key) {
                setStatus("MISSING ENV VARS")
                return
            }

            // 2. Direct Fetch Test (Ping Supabase)
            try {
                const res = await fetch(`${url}/rest/v1/`, {
                    headers: {
                        apikey: key,
                        Authorization: `Bearer ${key}`
                    }
                })
                console.log("Ping Status:", res.status)
            } catch (e: any) {
                console.error("Ping Error:", e)
            }

            // 3. Client Library Test
            try {
                const supabase = createClient()
                const { data, error } = await supabase.from('crafting_items').select('count', { count: 'exact', head: true })

                if (error) {
                    setDbCheck({ success: false, message: error.message, details: error, hint: error.hint })
                    setStatus("SUPABASE ERROR")
                } else {
                    setDbCheck({ success: true, data })
                    setStatus("SUCCESS")
                }
            } catch (e: any) {
                setDbCheck({ success: false, message: e.message, name: e.name, stack: e.stack })
                setStatus("CLIENT EXCEPTION")
            }
        }

        runDiagnostics()
    }, [])

    return (
        <div className="min-h-screen bg-black text-white p-8 font-mono text-sm">
            <h1 className="text-xl font-bold text-blue-400 mb-4">Diagnostics</h1>

            <div className="space-y-4">
                <div className="p-4 bg-slate-900 border border-white/10 rounded">
                    <h2 className="font-bold mb-2 text-slate-400">Environment</h2>
                    <pre className="whitespace-pre-wrap break-all">
                        URL: {envCheck.url_val || 'UNDEFINED'} {'\n'}
                        KEY Length: {envCheck.key_length || 0} chars
                    </pre>
                </div>

                <div className="p-4 bg-slate-900 border border-white/10 rounded">
                    <h2 className="font-bold mb-2 text-slate-400">Connection Status: <span className="text-white">{status}</span></h2>
                    {dbCheck && (
                        <pre className="whitespace-pre-wrap break-all text-xs text-red-300">
                            {JSON.stringify(dbCheck, null, 2)}
                        </pre>
                    )}
                </div>

                <div className="text-slate-500 text-xs">
                    Check your browser console (F12) for network errors.
                </div>
            </div>
        </div>
    )
}
