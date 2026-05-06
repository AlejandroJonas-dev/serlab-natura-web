'use client'

import { useEffect, useRef } from 'react'

export function useReveal(options?: IntersectionObserverInit) {
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = containerRef.current ?? document
    const elements = root.querySelectorAll<HTMLElement>('.reveal, .reveal-left')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, ...options }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [options])

  return containerRef
}
