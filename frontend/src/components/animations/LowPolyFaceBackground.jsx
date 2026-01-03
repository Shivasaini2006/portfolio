import { useEffect, useRef } from 'react'

export default function LowPolyFaceBackground() {
  const containerRef = useRef(null)
  const faceRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    let autoAngle = 0
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      autoAngle += 0.3 // rotation speed (deg/frame-ish)
      const rotY = autoAngle
      const rotX = Math.sin(autoAngle * 0.03) * 4
      if (faceRef.current) {
        faceRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`
      }
    }
    animate()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <style>{`
        .face-3d-layer {
          transform-style: preserve-3d;
        }
        .layer-headBase {
          transform: translateZ(0px);
        }
        .layer-jaw {
          transform: translateZ(25px);
        }
        .layer-mouth {
          transform: translateZ(40px);
        }
        .layer-forehead {
          transform: translateZ(55px);
        }
        .layer-cheeks {
          transform: translateZ(70px);
        }
        .layer-eyes {
          transform: translateZ(90px);
        }
        .layer-nose {
          transform: translateZ(120px);
        }
        
        /* Add backface visibility for better 3D rendering */
        .face-3d-wrapper {
          transform-style: preserve-3d;
          backface-visibility: visible;
        }
        
        /* Add 3D shading based on rotation */
        @keyframes subtle-glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.1); }
        }
      `}</style>

      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          perspective: '800px',
          perspectiveOrigin: '50% 50%',
          background: 'transparent',
        }}
      >
        <div
          className="face-3d-wrapper"
          style={{
            width: 'min(64vmin, 520px)',
            height: 'min(88vmin, 720px)',
            transformStyle: 'preserve-3d',
          }}
        >
          <svg
            ref={faceRef}
            viewBox="0 0 500 700"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              filter: 'drop-shadow(0 0 50px rgba(0,0,0,0.8))',
              transition: 'transform 0.1s ease-out',
            }}
          >
            {/* Head base - Layer 0 */}
            <g className="face-3d-layer layer-headBase">
              <polygon fill="#0a0a0a" points="
                250,20  350,70  420,170  400,320
                350,450 250,620 150,450 100,320
                80,170 150,70
              " />
            </g>

            {/* Jaw - Layer 20px */}
            <g className="face-3d-layer layer-jaw">
              <polygon fill="#070707" points="180,380 320,380 300,450 200,450" />
              <polygon fill="#050505" points="200,450 300,450 250,620" />
            </g>

            {/* Mouth - Layer 30px */}
            <g className="face-3d-layer layer-mouth">
              <polygon fill="#090909" points="200,420 300,420 270,460 230,460" />
            </g>

            {/* Forehead - Layer 40px */}
            <g className="face-3d-layer layer-forehead">
              <polygon fill="#111" points="250,20 350,70 250,120 150,70" />
              <polygon fill="#0d0d0d" points="150,70 250,120 180,200 120,150" />
              <polygon fill="#0f0f0f" points="350,70 250,120 320,200 380,150" />
            </g>

            {/* Cheeks - Layer 50px */}
            <g className="face-3d-layer layer-cheeks">
              <polygon fill="#121212" points="120,300 200,260 230,330 180,380" />
              <polygon fill="#121212" points="380,300 300,260 270,330 320,380" />
            </g>

            {/* Eyes - Layer 60px */}
            <g className="face-3d-layer layer-eyes">
              <polygon fill="#080808" points="170,250 230,240 230,280 160,290" />
              <polygon fill="#080808" points="330,250 270,240 270,280 340,290" />
            </g>

            {/* Nose - Layer 80px */}
            <g className="face-3d-layer layer-nose">
              <polygon fill="#0e0e0e" points="250,240 230,310 250,360 270,310" />
            </g>
          </svg>
        </div>
      </div>
    </>
  )
}
