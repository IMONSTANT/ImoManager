import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Configuration Error</CardTitle>
          <CardDescription>Environment variables are not properly configured</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            The application cannot start because required environment variables are missing or invalid.
          </p>

          <div className="rounded-lg bg-gray-100 p-4">
            <h3 className="mb-2 font-semibold text-sm">Required Variables:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              <li>SUPABASE_SERVICE_ROLE_KEY</li>
            </ul>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-sm text-blue-900">How to Fix:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Copy <code className="bg-blue-100 px-1 rounded">.env.example</code> to <code className="bg-blue-100 px-1 rounded">.env.local</code></li>
              <li>Fill in your Supabase credentials</li>
              <li>Restart the development server</li>
            </ol>
          </div>

          <p className="text-xs text-gray-500">
            See <code className="bg-gray-200 px-1 rounded">README.md</code> for detailed setup instructions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
