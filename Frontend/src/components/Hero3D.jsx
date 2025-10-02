"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, MeshDistortMaterial, OrbitControls } from "@react-three/drei"

// Animated gradient blob component
function AnimatedBlob({ position, color, speed = 1 }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.2
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * speed * 0.8) * 0.3
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.5
    }
  })

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
      <MeshDistortMaterial color={color} attach="material" distort={0.4} speed={2} roughness={0.1} metalness={0.8} />
    </Sphere>
  )
}

// Main 3D scene component
function Scene() {
  const blobs = useMemo(
    () => [
      { position: [-2, 0, -1], color: "#8B5CF6", speed: 1 },
      { position: [2, 1, -2], color: "#EC4899", speed: 0.8 },
      { position: [0, -1, -1.5], color: "#06B6D4", speed: 1.2 },
      { position: [-1, 2, -3], color: "#10B981", speed: 0.9 },
    ],
    [],
  )

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#EC4899" />

      {blobs.map((blob, index) => (
        <AnimatedBlob key={index} position={blob.position} color={blob.color} speed={blob.speed} />
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  )
}

// Main Hero3D component
const Hero3D = ({ className = "" }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}

export default Hero3D
