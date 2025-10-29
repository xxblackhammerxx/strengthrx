import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { testimonials } from '@/content/testimonials'

export function Testimonials() {
  // Show only first 3 testimonials on homepage
  const displayedTestimonials = testimonials.slice(0, 3)

  return (
    <section className="py-16 sm:py-24 bg-accent text-white">
      <Container>
        <div className="text-center mb-12">
          <Heading as="h2" size="3xl" className="mb-4 text-white">
            What Our Patients Say
          </Heading>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Real results from real people who have transformed their health and performance with
            StrengthRX.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Rating stars */}
              {testimonial.rating && (
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}

              <blockquote className="text-white/90 mb-4">"{testimonial.quote}"</blockquote>

              <div className="flex items-center">
                <div
                  className={`shrink-0 w-10 h-10 ${index % 2 === 0 ? 'bg-primary' : 'bg-white/20'} text-white rounded-full flex items-center justify-center text-sm font-semibold`}
                >
                  {testimonial.initials}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                  {testimonial.location && (
                    <p className="text-xs text-white/60">{testimonial.location}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
