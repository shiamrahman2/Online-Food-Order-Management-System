import { Loader2 } from 'lucide-react'

export default function Loading({ label = 'Loading...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink/70">
      <Loader2 className="animate-spin text-mango" size={32} />
      <span className="font-body text-sm">{label}</span>
    </div>
  )

  if (fullScreen) {
    return <div className="min-h-[60vh] flex items-center justify-center">{content}</div>
  }
  return content
}
