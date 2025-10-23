import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UsersTable } from '@/components/users/users-table'

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch users from Supabase
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage your system users and their permissions.
          </p>
        </div>
        <UsersTable data={users || []} />
      </div>
    </div>
  )
}
