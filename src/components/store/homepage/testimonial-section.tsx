'use client'

import { useState, useEffect, useRef } from 'react'

const testimonials = [
  {
    quote: "The fastest delivery I've ever experienced. Quality products, fair prices — exactly what I needed.",
    name: 'Sarah M.',
    role: 'Verified Customer',
    initials: 'SM',
  },
  {
    quote: "I've ordered three times now and every single product exceeded my expectations. Webship is my go-to store.",
    name: 'James R.',
    role: 'Loyal Customer',
    initials: 'JR',
  },
  {
    quote: "Returns were super easy and the support team replied within minutes. Genuinely impressed.",
    name: 'Aisha K.',
    role: 'Verified Buyer',
    initials: 'AK',
  },
  {
    quote: "Found products here that I couldn't find anywhere else. The variety is incredible and prices are unbeatable.",
    name: 'Daniel T.',
    role: 'Verified Customer',
    initials: 'DT',
  },
  {
    quote: "Smooth checkout, fast shipping, and the packaging was beautiful. Will definitely shop here again.",
    name: 'Priya L.',
    role: 'Verified Buyer',
    initials: 'PL',
  },
]

const INTERVAL = 4500

export function TestimonialSection() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = (index: number) => {
    setCurrent((index + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length)
    }, INTERVAL)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [paused])

  return (
    <section
      style={{ padding: '96px 24px', backgroundColor: 'var(--g-ink)', overflow: 'hidden' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Label */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-block',
            padding: '5px 16px', borderRadius: 99,
            border: '1px solid var(--g-red)',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--g-red)',
          }}>
            What customers say
          </div>
        </div>

        {/* Slide track */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex',
              transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: `translateX(-${current * 100}%)`,
              willChange: 'transform',
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                style={{
                  minWidth: '100%',
                  textAlign: 'center',
                  padding: '0 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 32,
                }}
              >
                {/* Quote */}
                <blockquote style={{
                  fontSize: 'clamp(22px, 3.5vw, 42px)',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  color: 'var(--g-white)',
                  margin: 0,
                  maxWidth: 780,
                }}>
                  "{t.quote}"
                </blockquote>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    backgroundColor: 'var(--g-red)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: '#fff',
                    flexShrink: 0,
                  }}>
                    {t.initials}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--g-white)' }}>{t.name}</p>
                    <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot navigation */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 8,
          marginTop: 48,
        }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPaused(true); goTo(i); setTimeout(() => setPaused(false), 6000) }}
              aria-label={`Go to testimonial ${i + 1}`}
              style={{
                width: i === current ? 28 : 8,
                height: 8,
                borderRadius: 99,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: i === current ? 'var(--g-red)' : 'rgba(255,255,255,0.2)',
                padding: 0,
                transition: 'width 0.3s ease, background-color 0.3s ease',
              }}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
