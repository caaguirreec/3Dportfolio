import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Houses } from './Houses'

// Cactus component
function Cactus({ position, scale = [1, 1, 1] }) {
  const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 8)
  const armGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8)
  
  return (
    <group position={position} scale={scale}>
      <mesh geometry={trunkGeometry}>
        <meshStandardMaterial color="#2E7D32" />
      </mesh>
      <mesh geometry={armGeometry} position={[0.5, 1, 0]} rotation={[0, 0, Math.PI/4]}>
        <meshStandardMaterial color="#2E7D32" />
      </mesh>
      <mesh geometry={armGeometry} position={[-0.5, 1, 0]} rotation={[0, 0, -Math.PI/4]}>
        <meshStandardMaterial color="#2E7D32" />
      </mesh>
    </group>
  )
}

// Sand Dune component
function SandDune({ position, scale = [1, 1, 1] }) {
  const geometry = new THREE.ConeGeometry(2, 1.5, 8)
  
  return (
    <mesh position={position} scale={scale}>
      <primitive object={geometry} />
      <meshStandardMaterial color="#FDD835" />
    </mesh>
  )
}

// Oasis component
function Oasis({ position, scale = [1, 1, 1] }) {
  const geometry = new THREE.CircleGeometry(1.5, 32)
  
  return (
    <mesh position={position} scale={scale} rotation={[-Math.PI / 2, 0, 0]}>
      <primitive object={geometry} />
      <meshStandardMaterial color="#2196F3" />
    </mesh>
  )
}

export function DesertScene({ cyclistPosition, onCollision }) {
  const sceneRef = useRef()
  
  // Generate random positions for cacti
  const cacti = useMemo(() => {
    const positions = []
    for (let i = 0; i < 30; i++) {
      positions.push([
        Math.random() * 40 - 20,
        0,
        Math.random() * 40 - 20
      ])
    }
    return positions
  }, [])

  // Generate random positions for sand dunes
  const dunes = useMemo(() => {
    const positions = []
    for (let i = 0; i < 8; i++) {
      positions.push([
        Math.random() * 40 - 20,
        0,
        Math.random() * 40 - 20
      ])
    }
    return positions
  }, [])

  // Check for collisions
  useFrame(() => {
    if (!cyclistPosition || !onCollision) return

    const cyclistRadius = 1 // Approximate cyclist collision radius
    const cyclistX = cyclistPosition[0]
    const cyclistZ = cyclistPosition[2]

    // Check cactus collisions
    cacti.forEach(([x, _, z]) => {
      const distance = Math.sqrt(
        Math.pow(cyclistX - x, 2) + Math.pow(cyclistZ - z, 2)
      )
      if (distance < cyclistRadius + 0.5) { // Cactus collision radius
        onCollision('cactus')
      }
    })

    // Check dune collisions
    dunes.forEach(([x, _, z]) => {
      const distance = Math.sqrt(
        Math.pow(cyclistX - x, 2) + Math.pow(cyclistZ - z, 2)
      )
      if (distance < cyclistRadius + 2) { // Dune collision radius
        onCollision('dune')
      }
    })

    // Check oasis collision
    const oasisRadius = 1.5
    if (
      Math.pow(cyclistX, 2) + Math.pow(cyclistZ, 2) < Math.pow(oasisRadius, 2)
    ) {
      onCollision('oasis')
    }

    // Check house collisions
    const houses = [
      { position: [-15, 0, -15], radius: 2 }, // Campsite
      { position: [15, 0, -15], radius: 2.5 }, // Computer House
      { position: [0, 0, 15], radius: 4 } // Theater
    ]

    houses.forEach(({ position: [x, _, z], radius }) => {
      const distance = Math.sqrt(
        Math.pow(cyclistX - x, 2) + Math.pow(cyclistZ - z, 2)
      )
      if (distance < cyclistRadius + radius) {
        onCollision('house')
      }
    })
  })

  return (
    <group ref={sceneRef}>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#FFB74D" />
      </mesh>

      {/* Cacti */}
      {cacti.map((position, index) => (
        <Cactus key={index} position={position} />
      ))}

      {/* Sand Dunes */}
      {dunes.map((position, index) => (
        <SandDune key={index} position={position} scale={[2, 2, 2]} />
      ))}

      {/* Oasis */}
      <Oasis position={[0, 0, 0]} />

      {/* Houses */}
      <Houses />

      {/* Ambient light */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
    </group>
  )
} 