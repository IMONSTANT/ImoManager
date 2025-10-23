'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SolutionsList } from '@/components/solutions/solutions-list'
import { CreateSolutionDialog } from '@/components/solutions/create-solution-dialog'
import { useSolutions, useDeleteSolution } from '@/hooks/use-solutions'
import { toast } from 'sonner'

export default function SolutionsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [organizationId] = useState('test-org-id') // TODO: Get from context/store
  const [userId] = useState('test-user-id') // TODO: Get from auth

  const { data: solutions, isLoading } = useSolutions(organizationId)
  const deleteSolution = useDeleteSolution()

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this solution?')) {
      try {
        await deleteSolution.mutateAsync(id)
        toast.success('Solution deleted')
      } catch (error) {
        toast.error('Error deleting solution')
      }
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Solutions</h1>
          <p className="text-muted-foreground">Manage your quick solutions</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Solution
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <SolutionsList solutions={solutions || []} onDelete={handleDelete} />
      )}

      <CreateSolutionDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        organizationId={organizationId}
        userId={userId}
      />
    </div>
  )
}
