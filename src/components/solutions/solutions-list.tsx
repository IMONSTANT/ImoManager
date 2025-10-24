'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, Edit } from 'lucide-react'
import type { Database } from '@/types/supabase'
import { format } from 'date-fns'

type Solution = Database['public']['Tables']['solutions']['Row']

interface Props {
  solutions: Solution[]
  onDelete?: (id: string) => void
  onEdit?: (solution: Solution) => void
}

export function SolutionsList({ solutions, onDelete, onEdit }: Props) {
  if (solutions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No solutions yet. Create your first one!
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {solutions.map((solution) => (
          <TableRow key={solution.id}>
            <TableCell className="font-medium">{solution.title}</TableCell>
            <TableCell>
              <Badge variant="outline">{solution.category}</Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  solution.status === 'published' ? 'default' :
                  solution.status === 'draft' ? 'secondary' :
                  'destructive'
                }
              >
                {solution.status}
              </Badge>
            </TableCell>
            <TableCell>{solution.created_at ? format(new Date(solution.created_at), 'MMM dd, yyyy') : 'N/A'}</TableCell>
            <TableCell className="text-right space-x-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(solution)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(solution.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
