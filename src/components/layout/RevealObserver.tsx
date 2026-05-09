'use client'

import { useEffect } from 'react'

const SELECTOR = '.reveal:not(.visible), .reveal-left:not(.visible)'

export function RevealObserver() {
  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            intersectionObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    const observe = (el: Element) => {
      if (!(el instanceof HTMLElement)) return
      if (el.classList.contains('visible')) return
      intersectionObserver.observe(el)
    }

    // Initial pass — catch elements present on first render.
    document.querySelectorAll(SELECTOR).forEach(observe)

    // Watch for nodes added later (TanStack Query results, route changes, etc.).
    // Without this, async-rendered cards stay at opacity: 0 forever.
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (node.matches('.reveal, .reveal-left')) observe(node)
          node.querySelectorAll(SELECTOR).forEach(observe)
        })
      }
    })

    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      intersectionObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  return null
}
