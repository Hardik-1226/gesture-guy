"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function Gallery() {
  const [activeImage, setActiveImage] = useState<number | null>(null)

  const galleryImages = [
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "Hand gesture recognition",
      title: "Precision Gesture Control",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "Smartwatch integration",
      title: "Smartwatch Integration",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "3D interface",
      title: "3D Interface Navigation",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "Multi-device control",
      title: "Multi-Device Control",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "IoT integration",
      title: "IoT Integration",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "Custom gesture mapping",
      title: "Custom Gesture Mapping",
    },
  ]

  return (
    <section id="gallery" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Visual <span className="text-primary">Experience</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the AirBoard interface and see how it transforms your digital interaction.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -10 }}
              className="group relative"
              onMouseEnter={() => setActiveImage(index)}
              onMouseLeave={() => setActiveImage(null)}
            >
              <div className="overflow-hidden rounded-xl">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: activeImage === index ? 1 : 0,
                      y: activeImage === index ? 0 : 20,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-0 right-0 p-4 text-white"
                  >
                    <h3 className="text-lg font-bold">{image.title}</h3>
                  </motion.div>
                </div>
              </div>

              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: activeImage === index ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 h-1 bg-primary"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
