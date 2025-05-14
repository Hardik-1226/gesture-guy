"use client"

import { motion } from "framer-motion"
import { Github, Twitter, Linkedin, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ]

  return (
    <footer className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gradient">GestureGuy</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-wrap justify-center gap-8 mb-8"
          >
            <a href="#hero" className="text-gray-400 hover:text-primary transition-colors">
              Home
            </a>
            <a href="#about" className="text-gray-400 hover:text-primary transition-colors">
              About
            </a>
            <a href="#features" className="text-gray-400 hover:text-primary transition-colors">
              Features
            </a>
            <a href="#preview" className="text-gray-400 hover:text-primary transition-colors">
              Preview
            </a>
            <a href="#backend" className="text-gray-400 hover:text-primary transition-colors">
              Backend
            </a>
            <a href="#gallery" className="text-gray-400 hover:text-primary transition-colors">
              Gallery
            </a>
            <a href="#contact" className="text-gray-400 hover:text-primary transition-colors">
              Contact
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex space-x-6 mb-8"
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                whileHover={{ y: -5, color: "#00FFFF" }}
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label={link.label}
              >
                <link.icon size={24} />
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center"
          >
            <p className="text-gray-500 mb-2">&copy; {new Date().getFullYear()} GestureGuy. All rights reserved.</p>
            <p className="text-gray-500">
              Made with <span className="text-accent">❤️</span> by Team GestureGuy
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
