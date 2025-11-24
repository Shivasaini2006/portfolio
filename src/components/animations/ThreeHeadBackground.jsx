import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeHeadBackground() {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const headRef = useRef(null)
  const animationIdRef = useRef(null)
  // Removed mouse-driven movement per request

  useEffect(() => {
    if (!containerRef.current) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = null // transparent
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.set(0, 0, 450)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lights
    const light1 = new THREE.DirectionalLight(0xffffff, 1.2)
    light1.position.set(200, 200, 200)
    scene.add(light1)

    const light2 = new THREE.DirectionalLight(0xffffff, 0.6)
    light2.position.set(-200, -100, 200)
    scene.add(light2)

    const light3 = new THREE.AmbientLight(0xffffff, 0.2)
    scene.add(light3)

    // Create base sphere
    const sphere = new THREE.SphereGeometry(120, 48, 40)

    // Sculpt into a face-like low-poly head
    const pos = sphere.attributes.position
    const v = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      v.set(pos.getX(i), pos.getY(i), pos.getZ(i))

      // Normalize helpers
      const r = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1
      const nx = v.x / r
      const ny = v.y / r
      const nz = v.z / r

      // Coordinate references
      const y = v.y
      const ax = Math.abs(v.x)

      // Base head proportions: elongate vertically, slightly narrow width
      if (y >= 0) {
        v.y *= 1.12 // taller upper head
      } else {
        v.y *= 1.45 // longer jaw area
      }
      v.x *= 0.95 // subtle width reduction overall

      // Jawline narrowing and chin shaping (lower y)
      if (y < -20) {
        const t = Math.min(1, Math.max(0, (-20 - y) / 120)) // 0..1 as y goes down
        v.x *= 1 - 0.28 * t // narrow jaw
        v.z *= 1 - 0.15 * t // slightly flatten depth

        // Chin bulge centered
        if (y < -85 && ax < 28) {
          v.z += 14 * (1 - ax / 28) // push chin forward
        }
      }

      // Cheekbones (mid-upper y, outer x) — push slightly outward
      if (y > 5 && y < 70 && ax > 38) {
        const t = (Math.min(70, y) - 5) / 65 // 0..1 within band
        const s = 1 + 0.06 * t
        v.x *= v.x >= 0 ? s : -s
        // subtle outward along normal
        v.x += nx * 2
        v.z += nz * 2
      }

      // Eye sockets (front, mid y, mid x) — carve inward
      if (y > 18 && y < 55 && ax > 22 && ax < 55 && v.z > 0) {
        const dy = 1 - Math.abs((y - 36.5) / 18.5) // peak at ~36.5
        const dx = 1 - Math.abs((ax - 38.5) / 16.5)
        const power = Math.max(0, dy * dx)
        v.z -= 10 * power // recess sockets
      }

      // Nose bridge (center x, mid-upper y) — push forward
      if (ax < 16 && y > 25 && y < 90) {
        const t = (Math.min(90, y) - 25) / 65
        v.z += 12 * t * (1 - ax / 16)
      }

      // Brow ridge (upper y, near center x) — slight forward
      if (ax < 26 && y > 55 && y < 95) {
        const t = 1 - Math.abs((y - 75) / 20)
        if (t > 0) v.z += 5 * t * (1 - ax / 26)
      }

      // Mouth area flattening
      if (y > -35 && y < -8) {
        const t = 1 - Math.abs((y + 21.5) / 13.5)
        if (t > 0 && v.z > 0) v.z -= 6 * t
      }

      // Forehead smoothing (upper y) — slightly backward to avoid too bulbous
      if (y > 95 && v.z > 0) {
        const t = Math.min(1, (y - 95) / 50)
        v.z -= 6 * t
      }

      // Cranium fullness
      if (y > 80) {
        const t = Math.min(1, (y - 80) / 80)
        v.x *= 1 + 0.04 * t
        v.z *= 1 + 0.04 * t
      }

      // Very mild geometric noise for low-poly character
      v.x += (Math.random() - 0.5) * 3
      v.y += (Math.random() - 0.5) * 3
      v.z += (Math.random() - 0.5) * 3

      pos.setXYZ(i, v.x, v.y, v.z)
    }
    pos.needsUpdate = true
    sphere.computeVertexNormals()

    const material = new THREE.MeshStandardMaterial({
      color: 0x111111,
      flatShading: true,
      metalness: 0.3,
      roughness: 0.8,
    })

    const head = new THREE.Mesh(sphere, material)
    scene.add(head)
    headRef.current = head

    let autoRotation = 0

    const onResize = () => {
      if (!rendererRef.current || !cameraRef.current) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', onResize)

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      autoRotation += 0.01
      if (headRef.current) {
        // Keep subtle auto-rotation only (no cursor tracking)
        headRef.current.rotation.y = autoRotation
        headRef.current.rotation.x = 0.02
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener('resize', onResize)
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current)

      if (rendererRef.current) {
        rendererRef.current.dispose()
        if (rendererRef.current.domElement && containerRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
      }
      // Three will GC meshes when no refs remain; explicit dispose material/geometry
      material.dispose()
      sphere.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
