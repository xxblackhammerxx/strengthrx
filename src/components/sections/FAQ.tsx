'use client'

import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { faqs } from '@/content/faq'
import { useState } from 'react'

export function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // Show first 6 FAQs on homepage
  const displayedFaqs = faqs.slice(0, 6)

  return (
    <section className="py-16 sm:py-24 bg-neutral-800">
      <Container>
        <div className="text-center mb-12">
          <Heading as="h2" size="3xl" className="mb-4 text-white">
            Frequently Asked Questions
          </Heading>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Get answers to common questions about our services, processes, and what to expect on
            your wellness journey.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {displayedFaqs.map((faq, index) => (
            <div
              key={faq.id}
              className="border border-neutral-600 rounded-lg overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between bg-neutral-700 hover:bg-neutral-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                onClick={() => toggleItem(faq.id)}
                aria-expanded={openItems.includes(faq.id)}
              >
                <span className="font-semibold text-white pr-4">{faq.question}</span>
                <svg
                  className={`h-5 w-5 text-gray-300 transition-transform ${
                    openItems.includes(faq.id) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {openItems.includes(faq.id) && (
                <div className="px-6 pb-4 bg-neutral-600">
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
