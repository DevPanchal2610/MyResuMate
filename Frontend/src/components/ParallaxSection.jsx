"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const ParallaxSection = ({ children, speed = 0.5, className = "" }) => {
  const sectionRef = useRef()

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })

    tl.fromTo(element, { y: 0 }, { y: -100 * speed, ease: "none" })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [speed])

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  )
}

export default ParallaxSection
