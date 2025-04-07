import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

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

export function ForestScene() {
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

  // Animate the scene
  useFrame((state, delta) => {
    if (sceneRef.current) {
      // Add subtle movement to the scene
      sceneRef.current.rotation.y += delta * 0.01
    }
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

      {/* Ambient light */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
    </group>
  )
} 