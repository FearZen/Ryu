import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    // Check Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Check Profile Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile) {
        redirect('/login') // Should not happen if auth is valid but safety check
    }

    // Get current path to allow specific exceptions
    const headersList = await headers();
    const domain = headersList.get('host') || "";
    const fullUrl = headersList.get('referer') || "";
    // Note: getting pathname in server component layout is tricky in Next.js 13+ without middleware passing it headers.
    // Using a simpler logic: strict role check.

    // Logic: 
    // - Admin: Access All
    // - Treasurer: Access All (or subset, but definitely admin pages)
    // - Member: Access ONLY Treasury

    // If Member, we need to know if they are accessing /admin/treasury. 
    // Since we can't easily get pathname in Layout (without middleware hacks), we can:
    // 1. Block 'member' generally here.
    // 2. BUT we want to allow /admin/treasury. 
    // 
    // Alternative: Do the check in the PAGE or implement a CLIENT component wrapper for the layout that checks pathname.
    // Server-side redirect is better for security.
    // 
    // Let's rely on the middleware.ts for the broad protection? No, user wants specific "forced access" protection.
    // 
    // Let's render the children, but we'll use a Client Component check inside here for the specific path logic if server-side is too hard?
    // Actually, 'member' role should generally NOT be in '/admin' root.
    // EXCEPT /admin/treasury.

    // If I can't check path, I can't selectively allow.
    // 
    // Workaround: We will let 'member' pass this layout check, BUT we rely on the specific Page guards for Dashboard/Users.
    // AND we will redirect them if they hit the root /admin or /admin/dashboard in those specific files.
    // 
    // However, `AdminNav` is inside the pages (imported), not this layout.
    // Wait, I saw `import AdminNav` in `TreasuryPage`. So `AdminNav` is NOT in `app/admin/layout.tsx` (which didn't exist).
    // 
    // So, creating this layout is purely for Access Control.
    // 
    // If I allow 'member' here, I must protect /admin/dashboard and /admin/users.
    // 
    // Let's implement the block:
    // If (role === 'member') -> Redirect to '/dashboard' ? 
    // BUT then they can't access Treasury.
    // 
    // Okay, plan:
    // 1. Layout allows everyone authenticated.
    // 2. `AdminNav` hides itself for Members.
    // 3. `/admin/dashboard/page.tsx`: Add check "If member -> redirect".
    // 4. `/admin/users/page.tsx`: Add check "If member -> redirect".
    // 5. `/admin/treasury/page.tsx`: Allow member.

    // Actually, I can use middleware to pass the pathname in headers if I really wanted to, but individual page checks are robust enough.

    // Let's just create a pass-through layout that ensures profile exists, to be safe.

    return (
        <>
            {children}
        </>
    )
}
