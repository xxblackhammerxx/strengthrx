export interface FAQ {
  id: string
  question: string
  answer: string
}

export const faqs: FAQ[] = [
  {
    id: 'who-is-candidate',
    question: 'Who is a good candidate for testosterone therapy?',
    answer:
      'Men experiencing symptoms of low testosterone such as fatigue, decreased muscle mass, low libido, mood changes, or poor sleep quality may benefit from TRT. We require comprehensive lab testing and medical evaluation to determine candidacy.',
  },
  {
    id: 'how-fast-results',
    question: 'How quickly will I see results?',
    answer:
      'Most patients begin noticing improvements in energy and mood within 2-4 weeks. Physical changes like increased muscle mass and improved body composition typically become apparent within 8-12 weeks of consistent treatment.',
  },
  {
    id: 'telehealth-how-works',
    question: 'How does telehealth work?',
    answer:
      "After scheduling a consultation, you'll meet with our licensed providers via secure video call. We'll review your health history, symptoms, and lab results to create a personalized treatment plan. Follow-up appointments are also conducted virtually for your convenience.",
  },
  {
    id: 'what-states-served',
    question: 'What states do you serve?',
    answer:
      'We currently provide telehealth services in Arizona, Idaho, Wyoming, Iowa, Utah, New Mexico, Nevada, and Colorado. Our licensed providers are credentialed in each state we serve.',
  },
  {
    id: 'lab-testing-required',
    question: 'Is lab testing required?',
    answer:
      'Yes, comprehensive lab testing is essential for safe and effective treatment. We require baseline labs before starting any therapy and ongoing monitoring throughout treatment to ensure optimal results and safety.',
  },
  {
    id: 'insurance-coverage',
    question: 'Do you accept insurance?',
    answer:
      "We operate on a direct-pay model to ensure personalized care and faster service. While we don't directly bill insurance, many patients successfully submit receipts to their insurance for potential reimbursement. We provide detailed receipts for this purpose.",
  },
]
