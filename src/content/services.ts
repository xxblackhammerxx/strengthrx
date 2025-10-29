export interface Service {
  id: string
  title: string
  description: string
  benefits: string[]
  slug: string
}

export const services: Service[] = [
  {
    id: 'testosterone-optimization',
    title: 'Testosterone Optimization (TRT)',
    description:
      'Comprehensive testosterone replacement therapy with ongoing monitoring and optimization.',
    benefits: [
      'Increased energy and vitality',
      'Improved muscle mass and strength',
      'Enhanced mood and mental clarity',
      'Better sleep quality',
      'Optimized body composition',
    ],
    slug: 'testosterone-optimization',
  },
  {
    id: 'peptide-therapies',
    title: 'Peptide Therapies',
    description: 'Advanced peptide protocols for recovery, performance, and anti-aging benefits.',
    benefits: [
      'Accelerated healing and recovery',
      'Enhanced growth hormone production',
      'Improved skin and hair quality',
      'Better cognitive function',
      'Increased muscle growth',
    ],
    slug: 'peptide-therapies',
  },
  {
    id: 'weight-loss-programs',
    title: 'Weight Loss Programs',
    description:
      'Medically supervised weight management with GLP-1 medications and lifestyle coaching.',
    benefits: [
      'Significant weight reduction',
      'Appetite control and regulation',
      'Improved metabolic health',
      'Sustainable lifestyle changes',
      'Professional medical oversight',
    ],
    slug: 'weight-loss-programs',
  },
  {
    id: 'performance-recovery',
    title: 'Performance & Recovery',
    description: 'Optimize athletic performance and recovery through targeted interventions.',
    benefits: [
      'Enhanced workout performance',
      'Faster recovery between sessions',
      'Reduced inflammation',
      'Better stress adaptation',
      'Improved endurance and power',
    ],
    slug: 'performance-recovery',
  },
  {
    id: 'labs-monitoring',
    title: 'Labs & Monitoring',
    description: 'Comprehensive lab testing and ongoing health monitoring for optimal results.',
    benefits: [
      'Complete hormone panels',
      'Regular progress tracking',
      'Biomarker optimization',
      'Personalized adjustments',
      'Preventive health screening',
    ],
    slug: 'labs-monitoring',
  },
  {
    id: 'telehealth-consults',
    title: 'Telehealth Consults',
    description: 'Convenient virtual consultations with licensed healthcare providers.',
    benefits: [
      'Convenient online appointments',
      'Licensed medical professionals',
      'Personalized treatment plans',
      'Ongoing support and guidance',
      'Secure patient portal access',
    ],
    slug: 'telehealth-consults',
  },
]
