import { Badge } from "../ui/badge"
import { Card , CardContent } from "../ui/card"
import { Star, Quote } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "High School Student",
      content:
        "tutorr helped me improve my math grades from C to A+ in just 3 months. The personalized approach and flexible scheduling made all the difference!",
      rating: 5,
      avatar: "/diverse-student-portraits.png",
    },
    {
      name: "Michael Chen",
      role: "College Student",
      content:
        "Finding the right chemistry tutor was so easy with tutorr. The platform's matching system connected me with an expert who understood my learning style perfectly.",
      rating: 5,
      avatar: "/college-student-portrait.png",
    },
    {
      name: "Emily Rodriguez",
      role: "Parent",
      content:
        "As a parent, I love how tutorr keeps me informed about my daughter's progress. The booking system is simple and the tutors are incredibly professional.",
      rating: 5,
      avatar: "/loving-parent-portrait.png",
    },
  ]

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-12">
          <Badge className="bg-white border border-neutral-300 text-neutral-700 px-3 py-1 mb-4">
            <div className="flex gap-1 justify-center items-center">
              <Quote className="h-4 w-4 stroke-green-600" />
              <p className="text-md">Testimonials</p>
            </div>
          </Badge>
          <h2 className="max-w-4xl text-green-900 tracking-tight font-semibold leading-tight text-4xl md:text-5xl text-center">
            What our students and parents say about tutorr
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <CardContent className="p-6">
                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Content */}
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>

                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-green-900 mb-2">10,000+</div>
            <div className="text-gray-600">Happy Students</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-900 mb-2">500+</div>
            <div className="text-gray-600">Expert Tutors</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-900 mb-2">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-900 mb-2">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
        </div>
      </div>
    </section>
  )
}
