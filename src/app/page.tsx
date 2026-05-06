import { HeroSection } from '@/components/home/HeroSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { ProductsSection } from '@/components/home/ProductsSection'
import { WhyUsSection } from '@/components/home/WhyUsSection'
import { ClassesTeaser } from '@/components/home/ClassesTeaser'
import { ContactCta } from '@/components/home/ContactCta'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Serlab Natura — Centro de Bienestar Natural en Córdoba',
  description:
    'Centro de bienestar natural en Córdoba, con terapias, estética con INDIBA, reflexología, clases de Tai-Chí, pilates y mindfulness y nuestra tienda online de productos naturales y herbolario.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <WhyUsSection />
      <ProductsSection />
      <ClassesTeaser />
      <ContactCta />
    </>
  )
}
