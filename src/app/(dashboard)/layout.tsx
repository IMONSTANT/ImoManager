import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/sidebar'
import { MobileSidebar } from '@/components/dashboard/mobile-sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r bg-background backdrop-blur-none">
        <Sidebar userEmail={user.email} />
      </aside>

      {/* Sidebar Mobile com overlay e botão */}
      <MobileSidebar userEmail={user.email} />

      <main className="flex-1 md:pl-64 overflow-y-auto pt-16 md:pt-0">
        {children}
      </main>
    </div>
  )
}
