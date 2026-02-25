import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageCircleQuestion } from "lucide-react"

const faqs = [
  {
    question: 'How do I add a task?',
    answer: 'Go to Home, enter title and description, then click Add Todo.',
  },
  {
    question: 'How do I mark a task completed?',
    answer: 'Use the checkbox next to each task to toggle completed status.',
  },
  {
    question: 'How do I edit or delete tasks?',
    answer: 'Use the edit and delete buttons on each todo card.',
  },
]

const Help = () => {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Help</h2>
          <p className="mt-1 text-sm text-zinc-600">Quick support resources for using your todo workspace.</p>
        </div>

        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-900">
              <MessageCircleQuestion className="h-4 w-4" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border border-zinc-200 p-3">
                <h3 className="text-sm font-semibold text-zinc-900">{faq.question}</h3>
                <p className="mt-1 text-sm text-zinc-600">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-900">
              <Mail className="h-4 w-4" />
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600">Need more help? Reach out at support@todoapp.local</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Help
