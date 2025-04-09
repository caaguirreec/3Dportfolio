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

// New collectible items components
function CactusFlower({ position }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#FF69B4" />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FF69B4" />
      </mesh>
    </group>
  )
}

function DesertCrystal({ position }) {
  return (
    <mesh position={position}>
      <octahedronGeometry args={[0.3]} />
      <meshStandardMaterial color="#00FFFF" transparent opacity={0.8} />
    </mesh>
  )
}

function WaterBottle({ position }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 8]} />
        <meshStandardMaterial color="#ADD8E6" />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#ADD8E6" />
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

export function DesertScene({ cyclistPosition, onCollision, collectedItems }) {
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

  // Generate collectible items
  const items = useMemo(() => {
    const items = []
    
    // Generate cactus flowers
    for (let i = 0; i < 4; i++) {
      items.push({
        type: 'cactus_flower',
        position: [
          Math.random() * 30 - 15,
          0,
          Math.random() * 30 - 15
        ]
      })
    }
    
    // Generate desert crystals
    for (let i = 0; i < 3; i++) {
      items.push({
        type: 'desert_crystal',
        position: [
          Math.random() * 30 - 15,
          0,
          Math.random() * 30 - 15
        ]
      })
    }
    
    // Generate water bottles
    for (let i = 0; i < 3; i++) {
      items.push({
        type: 'water',
        position: [
          Math.random() * 30 - 15,
          0,
          Math.random() * 30 - 15
        ]
      })
    }
    
    // Generate oasis
    items.push({
      type: 'oasis',
      position: [0, 0, 0]
    })
    
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

      {/* Render collectible items */}
      {items.map((item, index) => {
        if (collectedItems.includes(item.type)) return null
        
        switch (item.type) {
          case 'cactus_flower':
            return <CactusFlower key={`flower-${index}`} position={item.position} />
          case 'desert_crystal':
            return <DesertCrystal key={`crystal-${index}`} position={item.position} />
          case 'water':
            return <WaterBottle key={`water-${index}`} position={item.position} />
          case 'oasis':
            return <Oasis key="oasis" position={item.position} />
          case 'food':
            return <Food key={`food-${index}`} position={item.position} />
          default:
            return null
        }
      })}
    </group>
  )
} 