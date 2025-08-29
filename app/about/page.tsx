"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/Home/header"
import { TrustBadgesSection } from "@/components/Home/trustbadges"
import { 
  Gem, 
  Sparkles, 
  Heart, 
  Users, 
  Award, 
  Leaf, 
  Target,
  Instagram,
  Facebook,
  Twitter,
  Youtube
} from "lucide-react"
import { motion } from "framer-motion"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Priya Sharma",
      role: "Founder & Creative Director",
      image: "/team-member-1.jpg",
      bio: "With over 15 years in jewelry design, Priya brings exquisite craftsmanship to every piece."
    },
    {
      name: "Aisha Khan",
      role: "Head Designer",
      image: "/team-member-2.jpg",
      bio: "Aisha's innovative designs blend traditional techniques with contemporary elegance."
    },
    {
      name: "Riya Patel",
      role: "Quality Assurance",
      image: "/team-member-3.jpg",
      bio: "Riya ensures every piece meets our highest standards of quality and perfection."
    }
  ]

  const values = [
    {
      icon: Gem,
      title: "Exquisite Craftsmanship",
      description: "Each piece is meticulously handcrafted by skilled artisans with attention to every detail."
    },
    {
      icon: Sparkles,
      title: "Timeless Elegance",
      description: "We create jewelry that transcends trends and becomes cherished heirlooms."
    },
    {
      icon: Heart,
      title: "Ethical Practices",
      description: "Committed to sustainable sourcing and ethical manufacturing processes."
    },
    {
      icon: Users,
      title: "Customer Love",
      description: "Building lasting relationships through exceptional service and quality."
    }
  ]

  const milestones = [
    { year: "2010", event: "Founded with a vision to redefine women's jewelry" },
    { year: "2014", event: "Opened first flagship store in Mumbai" },
    { year: "2018", event: "Launched international shipping worldwide" },
    { year: "2022", event: "100,000+ happy customers served" },
    { year: "2024", event: "Featured in Vogue and Elle magazine" }
  ]

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-amber-50 via-white to-rose-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-light text-gray-900 mb-6 font-serif">
                Our Story of <span className="text-amber-600">Elegance</span> & <span className="text-rose-600">Craftsmanship</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                For over a decade, we've been creating exquisite jewelry that celebrates the modern Indian woman. 
                Each piece tells a story of tradition, innovation, and timeless beauty.
              </p>
              <div className="flex space-x-4">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full">
                  Shop Collection
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 px-8 py-3 rounded-full">
                  Our Process
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/about-hero.jpg"
                  alt="Elegant jewelry craftsmanship"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 left-6 bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-amber-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">12+</p>
                    <p className="text-sm text-gray-600">Years of Excellence</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 mb-4 font-serif">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Guided by principles that define everything we create and every relationship we build
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl bg-gradient-to-b from-white to-gray-50 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 mb-4 font-serif">Our Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to becoming a beloved name in women's jewelry
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center`}
                >
                  <div className="w-1/2">
                    <div className={`p-6 bg-white rounded-2xl shadow-lg ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <span className="text-amber-600 font-bold text-lg">{milestone.year}</span>
                      <p className="text-gray-700 mt-2">{milestone.event}</p>
                    </div>
                  </div>
                  
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mx-6 relative z-10">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
            
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-amber-200 top-0 -z-0"></div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 mb-4 font-serif">Meet Our Artisans</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The talented hands and creative minds behind our exquisite collections
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="relative mb-6 rounded-2xl overflow-hidden">
                  <div className="aspect-square relative">
                    <Image
                      src={member.image || "/placeholder-team.jpg"}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-amber-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="py-20 bg-gradient-to-r from-amber-50 to-rose-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl p-2 inline-flex items-center mb-6">
                <Leaf className="h-6 w-6 text-green-600 mr-2" />
                <span className="text-green-700 font-medium">Sustainable Practices</span>
              </div>
              
              <h2 className="text-3xl font-light text-gray-900 mb-6 font-serif">
                Crafting with <span className="text-green-600">Consciousness</span>
              </h2>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                We believe beautiful jewelry should also be responsible. Our commitment to sustainability 
                includes ethically sourced materials, eco-friendly packaging, and supporting local artisans.
              </p>
              
              <ul className="space-y-3 mb-8">
                {[
                  "100% conflict-free materials",
                  "Eco-conscious packaging",
                  "Supporting women artisans",
                  "Carbon-neutral shipping"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <Target className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full">
                Learn About Our Process
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="aspect-square relative rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={`/sustainability-${item}.jpg`}
                    alt="Sustainable practices"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-6 font-serif">Join Our Family of Elegance</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover the perfect piece that tells your story and becomes part of your legacy
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full">
              Explore Collections
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-full">
              Book Consultation
            </Button>
          </div>
          
          {/* Social Links */}
          <div className="flex justify-center space-x-6 mt-12">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-amber-400 hover:bg-white/10 rounded-full"
              >
                <Icon className="h-5 w-5" />
              </Button>
            ))}
          </div>
        </div>
      </section>

      <TrustBadgesSection />
    </div>
  )
}