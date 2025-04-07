import * as THREE from 'three'

// Campsite component
function Campsite({ position, scale = [1, 1, 1] }) {
  const tentGeometry = new THREE.ConeGeometry(2, 3, 4)
  const baseGeometry = new THREE.BoxGeometry(3, 0.2, 3)
  
  return (
    <group position={position} scale={scale}>
      <mesh geometry={baseGeometry} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh geometry={tentGeometry} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#FFA500" />
      </mesh>
    </group>
  )
}

// Computer House component
function ComputerHouse({ position, scale = [1, 1, 1] }) {
  const baseGeometry = new THREE.BoxGeometry(4, 3, 4)
  const roofGeometry = new THREE.ConeGeometry(3, 2, 4)
  
  return (
    <group position={position} scale={scale}>
      <mesh geometry={baseGeometry} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#808080" />
      </mesh>
      <mesh geometry={roofGeometry} position={[0, 3.5, 0]}>
        <meshStandardMaterial color="#A9A9A9" />
      </mesh>
    </group>
  )
}

// Theater component
function Theater({ position, scale = [1, 1, 1] }) {
  const baseGeometry = new THREE.BoxGeometry(6, 4, 8)
  const stageGeometry = new THREE.BoxGeometry(4, 0.5, 6)
  
  return (
    <group position={position} scale={scale}>
      <mesh geometry={baseGeometry} position={[0, 2, 0]}>
        <meshStandardMaterial color="#B8860B" />
      </mesh>
      <mesh geometry={stageGeometry} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#DAA520" />
      </mesh>
    </group>
  )
}

export function Houses() {
  return (
    <group>
      <Campsite position={[-15, 0, -15]} />
      <ComputerHouse position={[15, 0, -15]} />
      <Theater position={[0, 0, 15]} />
    </group>
  )
} 