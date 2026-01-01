import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl flex items-center justify-center min-h-[60vh]">
      <Spinner className="size-8" />
    </main>
  )
}

