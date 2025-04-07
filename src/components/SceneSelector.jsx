import { useState } from 'react'

export function SceneSelector({ onSceneSelect }) {
  const [selectedScene, setSelectedScene] = useState('forest')

  const handleSceneSelect = (scene) => {
    setSelectedScene(scene)
    onSceneSelect(scene)
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Select Environment</h2>
        <div className="flex gap-4">
          <button
            className={`px-6 py-3 rounded-lg transition-colors ${
              selectedScene === 'forest'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => handleSceneSelect('forest')}
          >
            Forest
          </button>
          <button
            className={`px-6 py-3 rounded-lg transition-colors ${
              selectedScene === 'desert'
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
  )
} 