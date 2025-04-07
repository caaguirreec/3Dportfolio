import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { ForestScene } from '../components/ForestScene'
import { CyclistAnimated } from '../models/CyclistAnimated'
import { Suspense, useState, useEffect } from 'react'

export default function BikePackingGame() {
  const [isRotating, setIsRotating] = useState(false)
  const [currentStage, setCurrentStage] = useState(1)
  const [currentFocusPoint, setCurrentFocusPoint] = useState(null)
  const [cyclistPosition, setCyclistPosition] = useState([0, 0, 0])
  const [cyclistRotation, setCyclistRotation] = useState(0)
  const [movementSpeed] = useState(0.1)
  const [activeKeys, setActiveKeys] = useState(new Set())

  // Handle keyboard controls
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
        
        // Only set isRotating to false if no arrow keys are pressed
        if (activeKeys.size === 1) { // If this was the last key being released
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

  return (
    <div className="w-full h-screen">
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 50 }}
      >
        <Suspense fallback={null}>
          <Environment preset="forest" />
          <ForestScene />
          <CyclistAnimated
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
            currentFocusPoint={currentFocusPoint}
            position={cyclistPosition}
            rotation={[0, cyclistRotation, 0]}
            scale={[1, 1, 1]}
          />
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>
    </div>
  )
} 