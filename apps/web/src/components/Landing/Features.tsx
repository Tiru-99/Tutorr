import { Badge } from "../ui/badge"
import { Card, CardContent } from "../ui/card"
import { ScanBarcode as ScanQrCode, Globe, Wallet, XCircle, RefreshCw, Search } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Globe className="h-8 w-8 stroke-green-600" />,
      title: "International Timezones",
      description:
        "Schedule lessons across different time zones with automatic conversion and smart scheduling suggestions.",
    },
    {
      icon: <Wallet className="h-8 w-8 stroke-green-600" />,
      title: "Manage Wallet",
      description: "Secure digital wallet to manage payments, track spending, and handle transactions seamlessly.",
    },
    {
      icon: <RefreshCw className="h-8 w-8 stroke-green-600" />,
      title: "Booking Cancellation & Refunds",
      description: "Easy cancellation process with automatic refund handling and flexible rescheduling options.",
    },
    {
      icon: <XCircle className="h-8 w-8 stroke-green-600" />,
      title: "Cancel Booking",
      description: "Quick and hassle-free booking cancellation with instant confirmation and refund processing.",
    },
    {
      icon: <Search className="h-8 w-8 stroke-green-600" />,
      title: "Find Teachers by Needs",
      description:
        "Advanced search and matching system to find the perfect teacher based on your specific requirements.",
    },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-green-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-6">
          <Badge className="bg-white/80 backdrop-blur-sm border border-green-200 text-green-700 px-4 py-2 shadow-sm">
            <div className="flex gap-2 items-center">
              <ScanQrCode className="h-4 w-4 stroke-green-600" />
              <span className="text-sm font-medium">Features</span>
            </div>
          </Badge>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 tracking-tight text-balance leading-tight max-w-5xl mx-auto">
            Latest advanced technologies to ensure <span className="text-green-600">everything you need</span>
          </h2>
          <p className="text-lg text-neutral-600 mt-6 max-w-2xl mx-auto leading-relaxed">
            Discover powerful features designed to enhance your tutoring experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group border-0 bg-white/60 backdrop-blur-sm hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="relative">
                    <div className="p-4 bg-green-100 rounded-2xl group-hover:bg-green-200 transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full opacity-80"></div>
                  </div>
                  <h3 className="text-xl font-bold text-green-900 leading-tight">{feature.title}</h3>
                  <p className="text-neutral-600 leading-relaxed text-sm">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
