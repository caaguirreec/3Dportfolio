import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Houses } from './Houses'

// Snowman component
function Snowman({ position, scale = [1, 1, 1] }) {
  const bottomGeometry = new THREE.SphereGeometry(1, 32, 32)
  const middleGeometry = new THREE.SphereGeometry(0.7, 32, 32)
  const topGeometry = new THREE.SphereGeometry(0.4, 32, 32)
  
  return (
    <group position={position} scale={scale}>
      <mesh geometry={bottomGeometry} position={[0, 1, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh geometry={middleGeometry} position={[0, 2.2, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh geometry={topGeometry} position={[0, 3, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

// Pine Tree component
function PineTree({ position, scale = [1, 1, 1] }) {
  const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8)
  const leavesGeometry = new THREE.ConeGeometry(1, 3, 8)
  
  return (
    <group position={position} scale={scale}>
      <mesh geometry={trunkGeometry}>
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      <mesh geometry={leavesGeometry} position={[0, 2, 0]}>
        <meshStandardMaterial color="#2E7D32" />
      </mesh>
    </group>
  )
}

// Ice Lake component
function IceLake({ position, scale = [1, 1, 1] }) {
  const geometry = new THREE.CircleGeometry(2, 32)
  
  return (
    <mesh position={position} scale={scale} rotation={[-Math.PI / 2, 0, 0]}>
      <primitive object={geometry} />
      <meshStandardMaterial color="#B3E5FC" />
    </mesh>
  )
}

export function SnowScene({ cyclistPosition, onCollision }) {
  const sceneRef = useRef()
  
  // Generate random positions for snowmen
  const snowmen = useMemo(() => {
    const positions = []
    for (let i = 0; i < 15; i++) {
      positions.push([
        Math.random() * 40 - 20,
        0,
        Math.random() * 40 - 20
      ])
    }
    return positions
  }, [])

  // Generate random positions for pine trees
  const pineTrees = useMemo(() => {
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

  // Check for collisions
  useFrame(() => {
    if (!cyclistPosition || !onCollision) return

    const cyclistRadius = 1 // Approximate cyclist collision radius
    const cyclistX = cyclistPosition[0]
    const cyclistZ = cyclistPosition[2]

    // Check snowman collisions
    snowmen.forEach(([x, _, z]) => {
      const distance = Math.sqrt(
        Math.pow(cyclistX - x, 2) + Math.pow(cyclistZ - z, 2)
      )
      if (distance < cyclistRadius + 1) { // Snowman collision radius
        onCollision('snowman')
      }
    })

    // Check pine tree collisions
    pineTrees.forEach(([x, _, z]) => {
      const distance = Math.sqrt(
        Math.pow(cyclistX - x, 2) + Math.pow(cyclistZ - z, 2)
      )
      if (distance < cyclistRadius + 0.5) { // Tree collision radius
        onCollision('tree')
      }
    })

    // Check ice lake collision
    const lakeRadius = 2
    if (
      Math.pow(cyclistX, 2) + Math.pow(cyclistZ, 2) < Math.pow(lakeRadius, 2)
    ) {
      onCollision('lake')
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
        <meshStandardMaterial color="#E3F2FD" />
      </mesh>

      {/* Snowmen */}
      {snowmen.map((position, index) => (
        <Snowman key={index} position={position} />
      ))}

      {/* Pine Trees */}
      {pineTrees.map((position, index) => (
        <PineTree key={index} position={position} />
      ))}

      {/* Ice Lake */}
      <IceLake position={[0, 0, 0]} />

      {/* Houses */}
      <Houses />

      {/* Ambient light */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
    </group>
  )
} 