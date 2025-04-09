import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Text } from '@react-three/drei'
import { ForestScene } from '../components/ForestScene'
import { DesertScene } from '../components/DesertScene'
import { SceneSelector } from '../components/SceneSelector'
import { CyclistAnimated } from '../models/CyclistAnimated'
import { Suspense, useState, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { SnowScene } from '../components/SnowScene'

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

// Function to get scene objects based on current scene
const getSceneObjects = (scene) => {
  const objects = []

  if (scene === 'forest') {
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

    // Add river
    objects.push({
      position: [0, 0, 0],
      radius: 1,
      isRiver: true
    })
  } else if (scene === 'snow') {
    // Add snowmen (15 snowmen with random positions)
    for (let i = 0; i < 15; i++) {
      objects.push({
        position: [
          Math.random() * 40 - 20,
          0,
          Math.random() * 40 - 20
        ],
        radius: 1
      })
    }

    // Add pine trees (30 trees with random positions)
    for (let i = 0; i < 30; i++) {
      objects.push({
        position: [
          Math.random() * 40 - 20,
          0,
          Math.random() * 40 - 20
        ],
        radius: 0.5
      })
    }

    // Add ice lake
    objects.push({
      position: [0, 0, 0],
      radius: 2,
      isLake: true
    })
  } else if (scene === 'desert') {
    // Add cacti (30 cacti with random positions)
    for (let i = 0; i < 30; i++) {
      objects.push({
        position: [
          Math.random() * 40 - 20,
          0,
          Math.random() * 40 - 20
        ],
        radius: 0.5
      })
    }

    // Add sand dunes (8 dunes with random positions)
    for (let i = 0; i < 8; i++) {
      objects.push({
        position: [
          Math.random() * 40 - 20,
          0,
          Math.random() * 40 - 20
        ],
        radius: 2
      })
    }

    // Add oasis
    objects.push({
      position: [0, 0, 0],
      radius: 1.5,
      isOasis: true
    })
  }

  // Add houses (common to all scenes)
  objects.push(
    { position: [-15, 0, -15], radius: 2 }, // Campsite
    { position: [15, 0, -15], radius: 2.5 }, // Computer House
    { position: [0, 0, 15], radius: 4 } // Theater
  )

  return objects
}

// Game state management
const INITIAL_ENERGY = 100
const INITIAL_FOOD = 5
const ENERGY_DECREASE_RATE = 0.1 // Energy decreases per second
const FOOD_ENERGY_VALUE = 20 // Energy restored per food item

// Add findSafePosition function
const findSafePosition = (sceneObjects) => {
  let attempts = 0;
  let position;
  let isSafe = false;

  while (!isSafe && attempts < 100) {
    // Generate random position within bounds
    position = [
      Math.random() * 30 - 15, // x: -15 to 15
      0,
      Math.random() * 30 - 15  // z: -15 to 15
    ];

    // Check if position is safe (not too close to any objects)
    isSafe = true;
    for (const obj of sceneObjects) {
      const distance = Math.sqrt(
        Math.pow(position[0] - obj.position[0], 2) +
        Math.pow(position[2] - obj.position[2], 2)
      );
      if (distance < obj.radius + 1) { // 1 is cyclist radius
        isSafe = false;
        break;
      }
    }

    attempts++;
  }

  // If we couldn't find a safe position after 100 attempts, return a default position
  if (!isSafe) {
    return [0, 0, 0];
  }

  return position;
};

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

  // Game state
  const [energy, setEnergy] = useState(INITIAL_ENERGY)
  const [food, setFood] = useState(INITIAL_FOOD)
  const [collectedItems, setCollectedItems] = useState({
    forest: [],
    desert: [],
    snow: []
  })
  const [currentObjective, setCurrentObjective] = useState('Find a campsite to rest')
  const [isCamping, setIsCamping] = useState(false)
  const [gameTime, setGameTime] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [showCampsitePopup, setShowCampsitePopup] = useState(false)
  const [isAtCampsite, setIsAtCampsite] = useState(false)

  // Game objectives for each scene
  const objectives = {
    forest: [
      { id: 'mushroom', name: 'Collect 3 mushrooms', count: 0, required: 3 },
      { id: 'berries', name: 'Collect 5 berries', count: 0, required: 5 },
      { id: 'firewood', name: 'Gather firewood', count: 0, required: 1 }
    ],
    desert: [
      { id: 'cactus_flower', name: 'Find 2 cactus flowers', count: 0, required: 2 },
      { id: 'desert_crystal', name: 'Collect desert crystal', count: 0, required: 1 },
      { id: 'water', name: 'Fill water bottle', count: 0, required: 1 }
    ],
    snow: [
      { id: 'ice_crystal', name: 'Collect 3 ice crystals', count: 0, required: 3 },
      { id: 'snow_flower', name: 'Find snow flower', count: 0, required: 1 },
      { id: 'firewood', name: 'Gather firewood', count: 0, required: 1 }
    ]
  }

  // Find a safe starting position
  useEffect(() => {
    const safePosition = findSafePosition(getSceneObjects(currentScene))
    setCyclistPosition(safePosition)
    setLastValidPosition(safePosition)
  }, [currentScene])

  // Handle energy consumption
  useEffect(() => {
    if (!isGameStarted || isCamping || isGameOver) return

    const energyInterval = setInterval(() => {
      setEnergy(prev => {
        const newEnergy = prev - ENERGY_DECREASE_RATE
        if (newEnergy <= 0) {
          setIsGameOver(true)
          return 0
        }
        return newEnergy
      })
    }, 1000)

    return () => clearInterval(energyInterval)
  }, [isGameStarted, isCamping, isGameOver])

  // Handle game time
  useEffect(() => {
    if (!isGameStarted || isGameOver) return

    const timeInterval = setInterval(() => {
      setGameTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timeInterval)
  }, [isGameStarted, isGameOver])

  // Handle camping
  const handleCamping = () => {
    if (energy < 20) {
      setIsCamping(true)
      const campingInterval = setInterval(() => {
        setEnergy(prev => {
          const newEnergy = prev + 1
          if (newEnergy >= 100) {
            clearInterval(campingInterval)
            setIsCamping(false)
            return 100
          }
          return newEnergy
        })
      }, 1000)
    }
  }

  // Handle food consumption
  const handleEatFood = () => {
    if (food > 0) {
      setFood(prev => prev - 1)
      setEnergy(prev => Math.min(100, prev + FOOD_ENERGY_VALUE))
    }
  }

  // Handle item collection
  const handleCollectItem = (itemId) => {
    setCollectedItems(prev => {
      const newItems = { ...prev }
      newItems[currentScene].push(itemId)
      return newItems
    })

    // Update objectives
    const currentObjectives = objectives[currentScene]
    const updatedObjectives = currentObjectives.map(obj => {
      if (obj.id === itemId) {
        return { ...obj, count: obj.count + 1 }
      }
      return obj
    })

    // Check if all objectives are completed
    const allCompleted = updatedObjectives.every(obj => obj.count >= obj.required)
    if (allCompleted) {
      setCurrentObjective('All objectives completed! Find a campsite to rest.')
    }
  }

  // Handle collisions with interactive objects
  const handleCollision = (type, position) => {
    switch (type) {
      case 'berry':
      case 'mushroom':
      case 'food':
        setFood(prev => prev + 1);
        // Remove the item from the scene
        setCollectedItems(prev => ({
          ...prev,
          [currentScene]: prev[currentScene].filter(item => 
            !(item === type && 
              Math.abs(item.position[0] - position[0]) < 0.5 && 
              Math.abs(item.position[2] - position[2]) < 0.5)
          )
        }));
        break;
      case 'campsite':
        setIsAtCampsite(true);
        setShowCampsitePopup(true);
        // Reset game state when at campsite
        setCyclistPosition([0, 0, 0]);
        setEnergy(100);
        setFood(0);
        setGameTime(0);
        setIsGameStarted(false);
        setShowSceneSelector(true);
        setCurrentScene('forest');
        setCollectedItems({ forest: [], desert: [], snow: [] });
        setIsGameOver(false);
        setIsCamping(false);
        setCyclistRotation(0);
        setCameraAngle(0);
        setManualRotation(0);
        setSceneRotation(0);
        setLastValidPosition([0, 0, 0]);
        setActiveKeys(new Set());
        setIsRotating(false);
        setCurrentStage(1);
        setCurrentFocusPoint(null);
        break;
      default:
        // For other objects, just remove them
        setCollectedItems(prev => ({
          ...prev,
          [currentScene]: prev[currentScene].filter(item => 
            !(item === type && 
              Math.abs(item.position[0] - position[0]) < 0.5 && 
              Math.abs(item.position[2] - position[2]) < 0.5)
          )
        }));
    }
  };

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

  // Update handleSceneSelect to use findSafePosition
  const handleSceneSelect = (scene) => {
    setCurrentScene(scene);
    setShowSceneSelector(false);
    setIsGameStarted(true);
    
    // Get scene objects and find a safe position
    const sceneObjects = getSceneObjects(scene);
    const safePosition = findSafePosition(sceneObjects);
    setCyclistPosition(safePosition);
    setLastValidPosition(safePosition);
  };

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
    if (isPositionSafe(newPosition, getSceneObjects(currentScene))) {
      setCyclistPosition(newPosition)
      setLastValidPosition(newPosition)
    } else {
      // If collision occurs, reset to last valid position
      setCyclistPosition(lastValidPosition)
      handleCollision('object', newPosition)
    }
  }

  const handleRotationChange = (newRotation) => {
    setCyclistRotation(newRotation[1])
  }

  // Add the campsite popup component
  const CampsitePopup = () => {
    const handleContinue = () => {
      // Reset all game states
      setShowCampsitePopup(false);
      setIsAtCampsite(false);
      setCyclistPosition([0, 0, 0]);
      setEnergy(100);
      setFood(0);
      setGameTime(0);
      setIsGameStarted(false);
      setShowSceneSelector(true);
      setCurrentScene('forest');
      setCollectedItems({ forest: [], desert: [], snow: [] });
      setIsGameOver(false);
      setIsCamping(false);
      setCyclistRotation(0);
      setCameraAngle(0);
      setManualRotation(0);
      setSceneRotation(0);
      setLastValidPosition([0, 0, 0]);
      setActiveKeys(new Set());
      setIsRotating(false);
      setCurrentStage(1);
      setCurrentFocusPoint(null);
    };

    if (!showCampsitePopup) return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Congratulations!</h2>
          <p className="text-center mb-6">World passed. You found a campsite to rest for today.</p>
          <button
            onClick={handleContinue}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-screen">
      {/* Game UI - Moved to bottom right with higher z-index */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-75 p-4 rounded-lg shadow-lg z-50">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold">Energy:</span>
            <div className="w-24 h-4 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${energy}%` }}
              />
            </div>
            <span>{Math.round(energy)}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold">Food:</span>
            <span>{food}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold">Time:</span>
            <span>{Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}</span>
          </div>
          <div className="font-bold text-sm max-w-xs">Objective: {currentObjective}</div>
          {isCamping && <div className="text-green-600">Resting at campsite...</div>}
          {isGameOver && <div className="text-red-600">Game Over! You ran out of energy.</div>}
        </div>
      </div>

      {/* Controls UI - Moved to bottom left with higher z-index */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-75 p-4 rounded-lg shadow-lg z-50">
        <div className="space-y-2">
          <button
            onClick={handleEatFood}
            disabled={food === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Eat Food (Restore Energy)
          </button>
          <div className="text-sm">Arrow keys to move, Mouse to look around</div>
        </div>
      </div>

      {/* Scene selector */}
      {showSceneSelector && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-center">Select Scene</h2>
            <div className="space-y-4">
              <button
                onClick={() => handleSceneSelect('forest')}
                className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Forest Scene
              </button>
              <button
                onClick={() => handleSceneSelect('snow')}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Snow Scene
              </button>
              <button
                onClick={() => handleSceneSelect('desert')}
                className="w-full py-3 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Desert Scene
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back to menu button */}
      {isGameStarted && (
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleBackToMenu}
            className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      )}

      {/* Campsite popup */}
      <CampsitePopup />
      
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
                    collectedItems={collectedItems.forest}
                  />
                ) : currentScene === 'snow' ? (
                  <SnowScene 
                    cyclistPosition={cyclistPosition}
                    onCollision={handleCollision}
                    collectedItems={collectedItems.snow}
                  />
                ) : (
                  <DesertScene 
                    cyclistPosition={cyclistPosition}
                    onCollision={handleCollision}
                    collectedItems={collectedItems.desert}
                  />
                )}
                {!isAtCampsite && (
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
                )}
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
    </div>
  )
} 