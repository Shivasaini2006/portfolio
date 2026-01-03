import { useEffect, useRef } from 'react'

export default function VantaBackground() {
  const vantaRef = useRef(null)
  const vantaEffect = useRef(null)

  useEffect(() => {
    if (!vantaEffect.current) {
      // Dynamically import Vanta NET effect and THREE
      Promise.all([
        import('three'),
        import('vanta/dist/vanta.net.min')
      ]).then(([THREE, NET]) => {
        vantaEffect.current = NET.default({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x8B5CF6, // Purple particles
          backgroundColor: 0x000000, // Pure black background
          points: 8.00, // Number of particle nodes
          maxDistance: 25.00, // Maximum distance for line connections
          spacing: 18.00, // Space between particles
          showDots: true, // Show particle dots
          color2: 0x10B981 // Green connecting lines
        })
      }).catch(err => {
        console.error('Failed to load Vanta NET:', err)
      })
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
      }
    }
  }, [])

  return (
    <>
      <div className="vanta-hero-bg" ref={vantaRef}></div>
      <div className="golden-glow-hero"></div>
    </>
  )
}
