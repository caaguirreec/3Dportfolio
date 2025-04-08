import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { ForestScene } from '../components/ForestScene'
import { DesertScene } from '../components/DesertScene'
import { SceneSelector } from '../components/SceneSelector'
import { CyclistAnimated } from '../models/CyclistAnimated'
import { Suspense, useState, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// Camera component that follows the cyclist
function Camera({ cyclistPosition, cameraAngle, cameraDistance, cameraHeight }) {
  const { camera } = useThree()
  
  useFrame(() => {
    // Calculate camera position
    const x = cyclistPosition[0] - Math.sin(cameraAngle) * cameraDistance
    const y = cyclistPosition[1] + cameraHeight
    const z = cyclistPosition[2] - Math.cos(cameraAngle) * cameraDistance

    // Update camera position
    camera.position.set(x, y, z)
    
    // Make camera look at cyclist
    camera.lookAt(new THREE.Vector3(...cyclistPosition))
  })

  return null
}

// Scene component that handles rotation
function Scene({ children, rotationSpeed, manualRotation }) {
  const sceneRef = useRef()
  
  useFrame((state, delta) => {
    if (sceneRef.current) {
      if (rotationSpeed !== 0) {
        sceneRef.current.rotation.y += delta * rotationSpeed
      }
      if (manualRotation !== 0) {
        sceneRef.current.rotation.y = manualRotation
      }
    }
  })

  return (
    <group ref={sceneRef} rotation={[0, 0, 0]}>
      {children}
    </group>
  )
}

// Function to check if a position is safe
const isPositionSafe = (position, objects) => {
  const cyclistRadius = 1
  const [x, _, z] = position

  for (const obj of objects) {
    const distance = Math.sqrt(
      Math.pow(x - obj.position[0], 2) + Math.pow(z - obj.position[2], 2)
    )
    if (distance < cyclistRadius + obj.radius) {
      return false
    }
  }
  return true
}

export default function BikePackingGame() {
  const [isRotating, setIsRotating] = useState(false)
  const [currentStage, setCurrentStage] = useState(1)
  const [currentFocusPoint, setCurrentFocusPoint] = useState(null)
  const [cyclistPosition, setCyclistPosition] = useState([0, 0, 0])
  const [cyclistRotation, setCyclistRotation] = useState(0)
  const [movementSpeed] = useState(0.1)
  const [activeKeys, setActiveKeys] = useState(new Set())
  const [lastValidPosition, setLastValidPosition] = useState([0, 0, 0])
  const [cameraAngle, setCameraAngle] = useState(0)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [lastMouseX, setLastMouseX] = useState(0)
  const [cameraDistance, setCameraDistance] = useState(5)
  const [cameraHeight, setCameraHeight] = useState(2)
  const [rotationSpeed, setRotationSpeed] = useState(0.001)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [manualRotation, setManualRotation] = useState(0)
  const [isRightMouseDown, setIsRightMouseDown] = useState(false)
  const [sceneRotation, setSceneRotation] = useState(0)
  const [currentScene, setCurrentScene] = useState('forest')
  const [showSceneSelector, setShowSceneSelector] = useState(true)
  const [isGameStarted, setIsGameStarted] = useState(false)

  // Define all objects in the scene
  const sceneObjects = useMemo(() => {
    const objects = []

    // Add trees (50 trees with random positions)
    for (let i = 0; i < 50; i++) {
      objects.push({
        position: [
          Math.random() * 40 - 20,
          0,
          Math.random() * 40 - 20
        ],
        radius: 0.5
      })
    }

    // Add mountains (5 mountains with random positions)
    for (let i = 0; i < 5; i++) {
      objects.push({
        position: [
          Math.random() * 40 - 20,
          0,
          Math.random() * 40 - 20
        ],
        radius: 3
      })
    }

    // Add houses
    objects.push(
      { position: [-15, 0, -15], radius: 2 }, // Campsite
      { position: [15, 0, -15], radius: 2.5 }, // Computer House
      { position: [0, 0, 15], radius: 4 } // Theater
    )

    // Add river
    objects.push({
      position: [0, 0, 0],
      radius: 1,
      isRiver: true
    })

    return objects
  }, [])

  // Find a safe starting position
  useEffect(() => {
    const findSafePosition = () => {
      let attempts = 0
      let position = [0, 0, 0]
      
      while (!isPositionSafe(position, sceneObjects) && attempts < 100) {
        position = [
          Math.random() * 30 - 15, // Keep within reasonable bounds
          0,
          Math.random() * 30 - 15
        ]
        attempts++
      }

      if (attempts >= 100) {
        // If we can't find a random safe position, use a known safe position
        position = [20, 0, 20] // Far from most objects
      }

      return position
    }

    const safePosition = findSafePosition()
    setCyclistPosition(safePosition)
    setLastValidPosition(safePosition)
  }, [sceneObjects])

  // Handle collisions
  const handleCollision = (type) => {
    // Reset position to last valid position when collision occurs
    setCyclistPosition(lastValidPosition)
    
    // You can add different behaviors based on collision type
    switch (type) {
      case 'tree':
        console.log('Collided with a tree!')
        break
      case 'mountain':
        console.log('Collided with a mountain!')
        break
      case 'river':
        console.log('Collided with the river!')
        break
      case 'house':
        console.log('Collided with a house!')
        break
    }
  }

  // Handle mouse events for camera rotation and zoom
  useEffect(() => {
    const handleMouseDown = (event) => {
      if (event.button === 0) { // Left mouse button
        setIsMouseDown(true)
        setLastMouseX(event.clientX)
      } else if (event.button === 2) { // Right mouse button
        setIsRightMouseDown(true)
        setLastMouseX(event.clientX)
        event.preventDefault() // Prevent context menu
      }
    }

    const handleMouseUp = (event) => {
      if (event.button === 0) {
        setIsMouseDown(false)
      } else if (event.button === 2) {
        setIsRightMouseDown(false)
        setSceneRotation(manualRotation) // Store the final rotation
      }
    }

    const handleMouseMove = (event) => {
      if (isMouseDown) {
        const deltaX = event.clientX - lastMouseX
        setCameraAngle(prev => prev + deltaX * 0.01)
        setLastMouseX(event.clientX)
      } else if (isRightMouseDown) {
        const deltaX = event.clientX - lastMouseX
        setManualRotation(sceneRotation + deltaX * 0.01)
        setLastMouseX(event.clientX)
      }
    }

    const handleWheel = (event) => {
      event.preventDefault()
      const zoomSpeed = 0.5
      const newDistance = cameraDistance + event.deltaY * 0.01 * zoomSpeed
      
      // Clamp the camera distance between min and max values
      const clampedDistance = Math.max(3, Math.min(15, newDistance))
      setCameraDistance(clampedDistance)
      
      // Adjust camera height based on distance for better perspective
      const newHeight = 1 + (clampedDistance / 5)
      setCameraHeight(newHeight)
    }

    const handleContextMenu = (event) => {
      event.preventDefault() // Prevent context menu on right click
    }

    const handleKeyDown = (event) => {
      if (event.key === 'r') {
        setIsAutoRotating(prev => !prev)
      } else if (event.key === '+') {
        setRotationSpeed(prev => Math.min(2, prev + 0.1))
      } else if (event.key === '-') {
        setRotationSpeed(prev => Math.max(0, prev - 0.1))
      }
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMouseDown, isRightMouseDown, lastMouseX, cameraDistance, sceneRotation])

  // Handle keyboard controls for cyclist movement
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        setActiveKeys(prev => new Set([...prev, event.key]))
        setIsRotating(true)
      }

      const newPosition = [...cyclistPosition]
      let newRotation = cyclistRotation

      switch (event.key) {
        case 'ArrowUp':
          newPosition[0] += Math.sin(newRotation) * movementSpeed
          newPosition[2] += Math.cos(newRotation) * movementSpeed
          break
        case 'ArrowDown':
          newPosition[0] -= Math.sin(newRotation) * movementSpeed
          newPosition[2] -= Math.cos(newRotation) * movementSpeed
          break
        case 'ArrowLeft':
          newRotation += 0.1
          break
        case 'ArrowRight':
          newRotation -= 0.1
          break
        default:
          return
      }

      // Store the last valid position before updating
      setLastValidPosition(cyclistPosition)
      setCyclistPosition(newPosition)
      setCyclistRotation(newRotation)
    }

    const handleKeyUp = (event) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        setActiveKeys(prev => {
          const newSet = new Set(prev)
          newSet.delete(event.key)
          return newSet
        })
        
        if (activeKeys.size === 1) {
          setIsRotating(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [cyclistPosition, cyclistRotation, movementSpeed, activeKeys])

  const handleSceneSelect = (scene) => {
    setCurrentScene(scene)
    setShowSceneSelector(false)
    setIsGameStarted(true)
    // Reset cyclist position when changing scenes
    const safePosition = findSafePosition()
    setCyclistPosition(safePosition)
    setLastValidPosition(safePosition)
  }

  const handleBackToMenu = () => {
    setShowSceneSelector(true)
    setIsGameStarted(false)
    // Reset game state
    setCyclistPosition([0, 0, 0])
    setCyclistRotation(0)
    setCameraAngle(0)
    setManualRotation(0)
    setSceneRotation(0)
  }

  const handlePositionChange = (newPosition) => {
    // Check for collisions before updating position
    if (isPositionSafe(newPosition, sceneObjects)) {
      setCyclistPosition(newPosition)
      setLastValidPosition(newPosition)
    } else {
      // If collision occurs, reset to last valid position
      setCyclistPosition(lastValidPosition)
      handleCollision('object')
    }
  }

  const handleRotationChange = (newRotation) => {
    setCyclistRotation(newRotation[1])
  }

  return (
    <div className="w-full h-screen">
      {showSceneSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Select Environment</h2>
            <div className="flex gap-4">
              <button
                className={`px-6 py-3 rounded-lg transition-colors ${
                  currentScene === 'forest'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => handleSceneSelect('forest')}
              >
                Forest
              </button>
              <button
                className={`px-6 py-3 rounded-lg transition-colors ${
                  currentScene === 'desert'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => handleSceneSelect('desert')}
              >
                Desert
              </button>
            </div>
          </div>
        </div>
      )}
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 50 }}
      >
        <Suspense fallback={null}>
          {isGameStarted && (
            <>
              <Scene 
                rotationSpeed={isAutoRotating ? rotationSpeed : 0}
                manualRotation={manualRotation}
              >
                <Camera
                  cyclistPosition={cyclistPosition}
                  cameraAngle={cameraAngle}
                  cameraDistance={cameraDistance}
                  cameraHeight={cameraHeight}
                />
                <Environment preset={currentScene === 'forest' ? 'forest' : 'sunset'} />
                {currentScene === 'forest' ? (
                  <ForestScene 
                    cyclistPosition={cyclistPosition}
                    onCollision={handleCollision}
                  />
                ) : (
                  <DesertScene 
                    cyclistPosition={cyclistPosition}
                    onCollision={handleCollision}
                  />
                )}
                <CyclistAnimated
                  isRotating={isRotating}
                  setIsRotating={setIsRotating}
                  setCurrentStage={setCurrentStage}
                  currentFocusPoint={currentFocusPoint}
                  position={cyclistPosition}
                  rotation={[0, cyclistRotation, 0]}
                  scale={[1, 1, 1]}
                  onPositionChange={handlePositionChange}
                  onRotationChange={handleRotationChange}
                />
              </Scene>
              <OrbitControls
                enableZoom={false}
                enablePan={true}
                enableRotate={false}
                minDistance={5}
                maxDistance={20}
                target={cyclistPosition}
              />
            </>
          )}
        </Suspense>
      </Canvas>
      {isGameStarted && (
        <button
          onClick={handleBackToMenu}
          className="fixed top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors z-50"
        >
          Back to Menu
        </button>
      )}
    </div>
  )
} 