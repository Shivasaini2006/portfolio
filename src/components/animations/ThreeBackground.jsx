import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeBackground() {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const clockRef = useRef(new THREE.Clock())
  const lodObjectsRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x000000, 1, 15000)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      15000
    )
    camera.position.z = 1000
    cameraRef.current = camera

    // Lights
    const pointLight = new THREE.PointLight(0x8B5CF6, 3, 0, 0) // Purple
    pointLight.position.set(0, 0, 0)
    scene.add(pointLight)

    const dirLight = new THREE.DirectionalLight(0x10B981, 3) // Green
    dirLight.position.set(0, 0, 1).normalize()
    scene.add(dirLight)

    // Create LOD geometry
    const geometry = [
      [new THREE.IcosahedronGeometry(100, 16), 50],
      [new THREE.IcosahedronGeometry(100, 8), 300],
      [new THREE.IcosahedronGeometry(100, 4), 1000],
      [new THREE.IcosahedronGeometry(100, 2), 2000],
      [new THREE.IcosahedronGeometry(100, 1), 8000]
    ]

    const material = new THREE.MeshLambertMaterial({ 
      color: 0x8B5CF6, // Purple
      wireframe: true 
    })

    // Create 1000 LOD objects
    for (let j = 0; j < 1000; j++) {
      const lod = new THREE.LOD()

      for (let i = 0; i < geometry.length; i++) {
        const mesh = new THREE.Mesh(geometry[i][0], material)
        mesh.scale.set(1.5, 1.5, 1.5)
        mesh.updateMatrix()
        mesh.matrixAutoUpdate = false
        lod.addLevel(mesh, geometry[i][1])
      }

      lod.position.x = 10000 * (0.5 - Math.random())
      lod.position.y = 7500 * (0.5 - Math.random())
      lod.position.z = 10000 * (0.5 - Math.random())
      lod.updateMatrix()
      lod.matrixAutoUpdate = false
      scene.add(lod)
      lodObjectsRef.current.push(lod)
    }

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Mouse movement
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    let animationId
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      const delta = clockRef.current.getDelta()

      // Smooth camera movement based on mouse
      targetRef.current.x += (mouseRef.current.x * 300 - targetRef.current.x) * 0.05
      targetRef.current.y += (mouseRef.current.y * 300 - targetRef.current.y) * 0.05

      camera.position.x += (targetRef.current.x - camera.position.x) * 0.05
      camera.position.y += (targetRef.current.y - camera.position.y) * 0.05

      // Auto rotation
      camera.position.z += delta * 100
      if (camera.position.z > 5000) camera.position.z = 1000

      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      
      // Dispose geometries and materials
      geometry.forEach(([geo]) => geo.dispose())
      material.dispose()
      lodObjectsRef.current = []
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
        pointerEvents: 'none'
      }}
    />
  )
}
