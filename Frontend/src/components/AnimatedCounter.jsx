"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const AnimatedCounter = ({ end, duration = 2, suffix = "", className = "" }) => {
  const [count, setCount] = useState(0)
  const counterRef = useRef()

  useEffect(() => {
    const element = counterRef.current
    if (!element) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      setCount(end)
      return
    }

    const counter = { value: 0 }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        // toggleActions: "play none none reverse",
        once: true,
      },
    })

    tl.to(counter, {
      value: end,
      duration: duration,
      ease: "power2.out",
      onUpdate: () => {
        setCount(Math.round(counter.value))
      },
    })

    return () => {
      tl.kill();
    }
  }, [end, duration])

  return (
    <span ref={counterRef} className={className}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export default AnimatedCounter
