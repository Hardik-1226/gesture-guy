import Hero from "@/components/sections/hero"
import About from "@/components/sections/about"
import Features from "@/components/sections/features"
import SoftwarePreview from "@/components/sections/software-preview"
import Backend from "@/components/sections/backend"
import BackendConnection from "@/components/sections/backend-connection"
import MusicPlayer from "@/components/sections/music-player"
import Gallery from "@/components/sections/gallery"
import Testimonials from "@/components/sections/testimonials"
import Contact from "@/components/sections/contact"
import Footer from "@/components/sections/footer"
import NoiseOverlay from "@/components/noise-overlay"

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <NoiseOverlay />
      <Hero />
      <About />
      <Features />
      <SoftwarePreview />
      <Backend />
      <BackendConnection />
      <MusicPlayer />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}
