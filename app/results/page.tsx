import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Results | ChrisWrldArena',
  description: 'View our prediction results and success rate',
}

export default function ResultsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Prediction Results</h1>
      <div className="grid gap-6">
        {/* Add results listing here */}
      </div>
    </div>
  )
}
