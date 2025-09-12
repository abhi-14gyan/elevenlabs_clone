import { AdminPanel } from "@/components/admin-panel"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage audio files and monitor system health for the ElevenLabs clone.
          </p>
        </div>

        <AdminPanel />
      </div>
    </div>
  )
}
