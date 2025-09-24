"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
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
  Youtube,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight
} from "lucide-react"
import { motion } from "framer-motion"

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Priya Sharma",
      role: "Founder & Creative Director",
      image: "/team-member-1.jpg",
      bio: "With over 15 years in jewelry design, Priya brings exquisite craftsmanship to every piece.",
      social: { instagram: "#", linkedin: "#" }
    },
    {
      name: "Aisha Khan",
      role: "Head Designer",
      image: "/team-member-2.jpg",
      bio: "Aisha's innovative designs blend traditional techniques with contemporary elegance.",
      social: { instagram: "#", linkedin: "#" }
    },
    {
      name: "Riya Patel",
      role: "Quality Assurance",
      image: "/team-member-3.jpg",
      bio: "Riya ensures every piece meets our highest standards of quality and perfection.",
      social: { instagram: "#", linkedin: "#" }
    },
    {
      name: "Sneha Desai",
      role: "Master Goldsmith",
      image: "/team-member-4.jpg",
      bio: "Sneha's expertise in goldsmithing brings unparalleled quality to our collections.",
      social: { instagram: "#", linkedin: "#" }
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
    },
    {
      icon: Leaf,
      title: "Sustainable Luxury",
      description: "Beautiful jewelry that respects both people and the planet."
    },
    {
      icon: Award,
      title: "Award-Winning Designs",
      description: "Recognized internationally for innovation and excellence in jewelry design."
    }
  ]

  const milestones = [
    { year: "2010", event: "Founded with a vision to redefine women's jewelry", highlight: true },
    { year: "2012", event: "First collection launched to critical acclaim" },
    { year: "2014", event: "Opened first flagship store in Mumbai" },
    { year: "2016", event: "Received National Design Award for Excellence" },
    { year: "2018", event: "Launched international shipping worldwide", highlight: true },
    { year: "2020", event: "Introduced sustainable sourcing initiative" },
    { year: "2022", event: "100,000+ happy customers served", highlight: true },
    { year: "2024", event: "Featured in Vogue and Elle magazine" }
  ]

  const certifications = [
    { name: "Responsible Jewelry Council", icon: "RJC" },
    { name: "Fair Trade Certified", icon: "FT" },
    { name: "Carbon Neutral", icon: "CN" },
    { name: "Artisan Crafted", icon: "AC" }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-amber-50/20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-amber-200/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-amber-100/20 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 md:mb-6 font-serif leading-tight">
                  Crafting <span className="text-amber-600">Timeless</span> Elegance
                </h1>
                <p className="text-base sm:text-lg text-gray-700 mb-6 md:mb-8 leading-relaxed max-w-md sm:max-w-lg">
                  For over a decade, we've been creating exquisite jewelry that celebrates the modern Indian woman. 
                  Each piece tells a story of tradition, innovation, and timeless beauty that transcends generations.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <Button className="bg-black hover:bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-md font-medium text-sm sm:text-base">
                  Discover Collections
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 sm:px-8 py-3 sm:py-4 rounded-md font-medium text-sm sm:text-base">
                  Our Craftsmanship
                </Button>
              </div>
              
              {/* Quick stats */}
              <div className="flex flex-wrap gap-6 sm:gap-8 mt-8 sm:mt-12">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-amber-600">12+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Years of Excellence</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-amber-600">50k+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-amber-600">100%</div>
                  <div className="text-xs sm:text-sm text-gray-600">Handcrafted</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/about-hero.jpg"
                  alt="Elegant jewelry craftsmanship"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
              
              {/* Floating certification badge */}
              <motion.div 
                className="absolute -bottom-4 left-4 sm:left-8 bg-white rounded-xl shadow-lg p-4 sm:p-5 border border-amber-100"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center">
                  <div className="bg-amber-100 rounded-lg p-2 mr-2 sm:mr-3">
                    <Award className="h-5 sm:h-6 w-5 sm:w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Award Winning</p>
                    <p className="text-xs sm:text-sm text-gray-600">Since 2016</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadgesSection />

      {/* Our Values */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-amber-100 rounded-full px-3 sm:px-4 py-2 mb-4">
              <Sparkles className="h-3 sm:h-4 w-3 sm:w-4 text-amber-600 mr-2" />
              <span className="text-xs sm:text-sm font-medium text-amber-800">Our Philosophy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-4 font-serif">Guiding Principles</h2>
            <p className="text-gray-600 max-w-md sm:max-w-lg md:max-w-2xl mx-auto text-base sm:text-lg">
              The values that define everything we create and every relationship we build
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="p-6 md:p-8 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-amber-100 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 md:mb-6">
                  <value.icon className="h-5 md:h-6 w-5 md:w-6 text-amber-600" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4"> {value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-12 sm:py-16 md:py-24 bg-gray-50 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50/20 to-white/50" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-4 font-serif">Our Journey Through Time</h2>
            <p className="text-gray-600 max-w-md sm:max-w-lg md:max-w-2xl mx-auto text-base sm:text-lg">
              From humble beginnings to becoming a beloved name in women's jewelry
            </p>
          </motion.div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline */}
            <div className="space-y-8 md:space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`flex flex-col md:flex-row ${index % 2 === 0 ? '' : 'md:flex-row-reverse'} items-start gap-6 md:gap-8`}
                >
                  <div className="w-full md:w-1/2">
                    <div className={`p-4 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <span className={`text-base sm:text-lg font-bold ${milestone.highlight ? 'text-amber-600' : 'text-gray-700'}`}>
                        {milestone.year}
                      </span>
                      <p className="text-gray-700 mt-2 text-sm sm:text-base">{milestone.event}</p>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex relative">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center mx-6 mt-6 relative z-10 border-2 border-white shadow-lg
                      ${milestone.highlight ? 'bg-amber-600' : 'bg-gray-400'}`}>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-amber-200 top-0 -z-0"></div>
                  </div>
                  
                  <div className="md:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-4 font-serif">Meet Our Artisans</h2>
            <p className="text-gray-600 max-w-md sm:max-w-lg md:max-w-2xl mx-auto text-base sm:text-lg">
              The talented hands and creative minds behind our exquisite collections
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="relative mb-4 md:mb-6 rounded-xl overflow-hidden border border-gray-100 shadow-md">
                  <div className="aspect-square relative">
                    <Image
                      src={member.image || "/placeholder-team.jpg"}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/90 text-gray-700 hover:bg-white">
                          <Instagram className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/90 text-gray-700 hover:bg-white">
                          <Twitter className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-amber-600 font-medium mb-3 text-sm md:text-base">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability & Certifications */}
      <section className="py-12 sm:py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-amber-100 rounded-lg p-2 inline-flex items-center mb-4 md:mb-6 border border-amber-200">
                <Leaf className="h-4 sm:h-5 w-4 sm:w-5 text-amber-700 mr-2" />
                <span className="text-amber-800 font-medium text-xs sm:text-sm">Sustainable Practices</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-4 md:mb-6 font-serif leading-tight">
                Crafting with <span className="text-amber-600">Consciousness</span>
              </h2>
              
              <p className="text-gray-700 mb-4 md:mb-6 leading-relaxed text-base sm:text-lg">
                We believe beautiful jewelry should also be responsible. Our commitment to sustainability 
                includes ethically sourced materials, eco-friendly packaging, and supporting local artisans.
              </p>
              
              <ul className="space-y-3 mb-6 md:mb-8">
                {[
                  "100% conflict-free materials and diamonds",
                  "Eco-conscious and recyclable packaging",
                  "Supporting women artisans with fair wages",
                  "Carbon-neutral shipping and operations"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Target className="h-4 sm:h-5 w-4 sm:w-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Button className="bg-black hover:bg-gray-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium text-sm sm:text-base">
                Learn About Our Process
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {/* Certifications */}
              <div className="mt-8 md:mt-12">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Certifications & Memberships</h3>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="bg-white px-3 sm:px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">{cert.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 sm:gap-6"
            >
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="aspect-square relative rounded-xl overflow-hidden border border-gray-200 shadow-md">
                  <Image
                    src={`/sustainability-${item}.jpg`}
                    alt="Sustainable practices"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visit Us */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-xl"
            >
              <Image
                src="/store-front.jpg"
                alt="Our flagship store"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-4 md:mb-6 font-serif">Visit Our Flagship Store</h2>
              <p className="text-gray-700 mb-6 md:mb-8 leading-relaxed text-base sm:text-lg">
                Experience our collections in person at our beautifully designed flagship store. 
                Our expert consultants will help you find the perfect piece or create something custom just for you.
              </p>
              
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <div className="flex items-center">
                  <MapPin className="h-4 sm:h-5 w-4 sm:w-5 text-amber-600 mr-3" />
                  <span className="text-gray-700 text-sm sm:text-base">123 Jewelry District, Mumbai, MH 400001</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 sm:h-5 w-4 sm:w-5 text-amber-600 mr-3" />
                  <span className="text-gray-700 text-sm sm:text-base">Mon-Sat: 10AM-8PM | Sun: 11AM-6PM</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 sm:h-5 w-4 sm:w-5 text-amber-600 mr-3" />
                  <span className="text-gray-700 text-sm sm:text-base">+91 22 1234 5678</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 sm:h-5 w-4 sm:w-5 text-amber-600 mr-3" />
                  <span className="text-gray-700 text-sm sm:text-base">visit@example.com</span>
                </div>
              </div>
              
              <Button className="bg-amber-600 hover:bg-amber-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium text-sm sm:text-base">
                Book a Private Viewing
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-4 md:mb-6 font-serif">Join Our Family of Elegance</h2>
            <p className="text-gray-300 mb-6 md:mb-8 max-w-md sm:max-w-lg md:max-w-2xl mx-auto text-base sm:text-lg">
              Discover the perfect piece that tells your story and becomes part of your legacy
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-12">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-md font-medium text-sm sm:text-base">
                Explore Collections
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-md font-medium text-sm sm:text-base">
                Book Consultation
              </Button>
            </div>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-4">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-amber-400 hover:bg-white/10 rounded-md h-10 w-10"
                >
                  <Icon className="h-4 sm:h-5 w-4 sm:w-5" />
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 sm:py-16 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl sm:text-2xl font-light text-gray-900 mb-4">Stay Updated</h3>
          <p className="text-gray-600 mb-6 max-w-md sm:max-w-lg mx-auto text-sm sm:text-base">
            Join our newsletter for exclusive offers, new collection launches, and styling tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
            />
            <Button className="bg-black hover:bg-gray-800 text-white px-4 sm:px-6 py-3 rounded-md text-sm sm:text-base">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}