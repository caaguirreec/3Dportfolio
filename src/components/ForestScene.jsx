import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Houses } from './Houses'

// Tree component
function Tree({ position, scale = [1, 1, 1] }) {
  const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8)
  const leavesGeometry = new THREE.ConeGeometry(1, 2, 8)
  
  return (
    <group position={position} scale={scale}>
      <mesh geometry={trunkGeometry}>
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      <mesh geometry={leavesGeometry} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#2E7D32" />
      </mesh>
    </group>
  )
}

// Mountain component
function Mountain({ position, scale = [1, 1, 1] }) {
  const geometry = new THREE.ConeGeometry(3, 5, 8)
  
  return (
    <mesh position={position} scale={scale}>
      <primitive object={geometry} />
      <meshStandardMaterial color="#757575" />
    </mesh>
  )
}

// River component
function River({ position, scale = [1, 1, 1] }) {
  const geometry = new THREE.PlaneGeometry(20, 2, 1)
  
  return (
    <mesh position={position} scale={scale} rotation={[-Math.PI / 2, 0, 0]}>
      <primitive object={geometry} />
      <meshStandardMaterial color="#2196F3" />
    </mesh>
  )
}

// New collectible items components
function Mushroom({ position }) {
  const mesh = useRef()
  return (
    <mesh position={position} ref={mesh}>
      <cylinderGeometry args={[0.1, 0.2, 0.1, 8]} />
      <meshStandardMaterial color="#8B4513" />
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#FF0000" />
      </mesh>
    </mesh>
  )
}

function Berries({ position }) {
  const mesh = useRef()
  return (
    <group position={position}>
      <mesh ref={mesh}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FF0000" />
      </mesh>
      <mesh position={[0.2, 0, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FF0000" />
      </mesh>
      <mesh position={[-0.2, 0, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FF0000" />
      </mesh>
    </group>
  )
}

function Firewood({ position }) {
  const mesh = useRef()
  return (
    <mesh position={position} ref={mesh}>
      <boxGeometry args={[0.5, 0.1, 0.1]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  )
}

function Campsite({ position }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.2, 0.4, 0.2]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>
    </group>
  )
}

function Food({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshStandardMaterial color="#FFD700" />
    </mesh>
  )
}

export function ForestScene({ cyclistPosition, onCollision, collectedItems }) {
  const sceneRef = useRef()
  
  // Generate random positions for trees
  const trees = useMemo(() => {
    const positions = []
    for (let i = 0; i < 50; i++) {
      positions.push([
        Math.random() * 40 - 20,
        0,
        Math.random() * 40 - 20
      ])
    }
    return positions
  }, [])

  // Generate random positions for mountains
  const mountains = useMemo(() => {
    const positions = []
    for (let i = 0; i < 5; i++) {
      positions.push([
        Math.random() * 40 - 20,
        0,
        Math.random() * 40 - 20
      ])
    }
    return positions
  }, [])

  // Generate collectible items
  const items = useMemo(() => {
    const items = []
    
    // Generate mushrooms
    for (let i = 0; i < 5; i++) {
      items.push({
        type: 'mushroom',
        position: [
          Math.random() * 30 - 15,
          0,
          Math.random() * 30 - 15
        ]
      })
    }
    
    // Generate berries
    for (let i = 0; i < 8; i++) {
      items.push({
        type: 'berries',
        position: [
          Math.random() * 30 - 15,
          0,
          Math.random() * 30 - 15
        ]
      })
    }
    
    // Generate firewood
    for (let i = 0; i < 3; i++) {
      items.push({
        type: 'firewood',
        position: [
          Math.random() * 30 - 15,
          0,
          Math.random() * 30 - 15
        ]
      })
    }
    
    // Generate campsites
    for (let i = 0; i < 3; i++) {
      items.push({
        type: 'campsite',
        position: [
          Math.random() * 30 - 15,
          0,
          Math.random() * 30 - 15
        ]
      })
    }
    
    // Generate food
    for (let i = 0; i < 5; i++) {
      items.push({
        type: 'food',
        position: [
          Math.random() * 30 - 15,
          0,
          Math.random() * 30 - 15
        ]
      })
    }
    
    return items
  }, [])

  // Check for collisions
  useFrame(() => {
    if (!cyclistPosition || !onCollision) return

    const cyclistRadius = 1 // Approximate cyclist collision radius
    const cyclistX = cyclistPosition[0]
    const cyclistZ = cyclistPosition[2]

    // Check tree collisions
    trees.forEach(([x, _, z]) => {
      const distance = Math.sqrt(
        Math.pow(cyclistX - x, 2) + Math.pow(cyclistZ - z, 2)
      )
      if (distance < cyclistRadius + 0.5) { // Tree collision radius
        onCollision('tree')
      }
    })

    // Check mountain collisions
    mountains.forEach(([x, _, z]) => {
      const distance = Math.sqrt(
        Math.pow(cyclistX - x, 2) + Math.pow(cyclistZ - z, 2)
      )
      if (distance < cyclistRadius + 3) { // Mountain collision radius
        onCollision('mountain')
      }
    })

    // Check river collision
    const riverWidth = 2
    const riverLength = 20
    if (
      Math.abs(cyclistZ) < riverWidth / 2 &&
      Math.abs(cyclistX) < riverLength / 2
    ) {
      onCollision('river')
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

    // Check for collisions with items
    items.forEach(item => {
      const distance = Math.sqrt(
        Math.pow(cyclistX - item.position[0], 2) +
        Math.pow(cyclistZ - item.position[2], 2)
      )
      
      if (distance < 1 && !collectedItems.includes(item.type)) {
        onCollision(item.type)
      }
    })
  })

  return (
    <group ref={sceneRef}>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>

      {/* Trees */}
      {trees.map((position, index) => (
        <Tree key={index} position={position} />
      ))}

      {/* Mountains */}
      {mountains.map((position, index) => (
        <Mountain key={index} position={position} scale={[2, 2, 2]} />
      ))}

      {/* River */}
      <River position={[0, 0, 0]} scale={[1, 1, 1]} />

      {/* Houses */}
      <Houses />

      {/* Ambient light */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      {/* Render collectible items */}
      {items.map((item, index) => {
        if (collectedItems.includes(item.type)) return null
        
        switch (item.type) {
          case 'mushroom':
            return <Mushroom key={`mushroom-${index}`} position={item.position} />
          case 'berries':
            return <Berries key={`berries-${index}`} position={item.position} />
          case 'firewood':
            return <Firewood key={`firewood-${index}`} position={item.position} />
          case 'campsite':
            return <Campsite key={`campsite-${index}`} position={item.position} />
          case 'food':
            return <Food key={`food-${index}`} position={item.position} />
          default:
            return null
        }
      })}
    </group>
  )
} 