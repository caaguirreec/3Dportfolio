import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";

import sakura from "../assets/sakura.mp3";
import { HomeInfo, Loader } from "../components";
import { soundoff, soundon } from "../assets/icons";
import { Tulia, Cyclist, CyclistAnimated, Camping, Sky } from "../models";

const Home = () => {
  const audioRef = useRef(new Audio(sakura));
  audioRef.current.volume = 0.4;
  audioRef.current.loop = true;

  const [currentStage, setCurrentStage] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  useEffect(() => {
    if (isPlayingMusic) {
      audioRef.current.play();
    }

    return () => {
      audioRef.current.pause();
    };
  }, [isPlayingMusic]);

  const adjustTuliaForScreenSize = () => {
    let screenScale, screenPosition;

    // If screen width is less than 768px, adjust the scale and position
    if (window.innerWidth < 768) {
      screenScale = [2.2, 2.2, 2.2];
      screenPosition = [-3, -4, -4];
    } else {
      screenScale = [2.2, 2.2, 2.2];
      screenPosition = [-3, -4, -4];
    }

    return [screenScale, screenPosition];
  };

  const adjustCampingForScreenSize  = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [4.5, 4.5, 4.5];
      screenPosition = [10, -29.5, -73.4];
    } else {
      screenScale = [4.5, 4.5, 4.5];
      screenPosition = [10, -29.5, -73.4];
    }

    return [screenScale, screenPosition];
  };
  const adjustCyclistForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [1.5, 1.5, 1.5];
      screenPosition = [0.1, -0.3, 2];
    } else {
      screenScale = [1.5, 1.5, 1.5];
      screenPosition = [-0.1, -0.3, 2];
    }
    return [screenScale, screenPosition];
  };
  const adjustCyclistAnimatedForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [1.5, 1.5, 1.5];
      screenPosition = [0.1, -0.3, 2];
    } else {
      screenScale = [1.0, 1.0, 1.0];
      screenPosition = [0.1, -1.4, 2];
    }
    return [screenScale, screenPosition];
  };

  const [tuliaScale, tuliaPosition] = adjustTuliaForScreenSize();
  const [campingScale, campingPosition] = adjustCampingForScreenSize();
  const [cyclistScale, cyclistPosition] = adjustCyclistForScreenSize();
  const [cyclistAnimatedScale, cyclistAnimatedPosition] = adjustCyclistAnimatedForScreenSize();

  return (
    <section className='w-full h-screen relative'>
      <div className='absolute top-28 left-0 right-0 z-10 flex items-center justify-center'>
        {currentStage && <HomeInfo currentStage={currentStage} />}
      </div>

      <Canvas
        className={`w-full h-screen bg-transparent ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
        }`}
        camera={{ near: 0.9, far: 1000 }}
      >
        <Suspense fallback={<Loader />}>
          <directionalLight position={[1, 1, 1]} intensity={2} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 5, 10]} intensity={2} />
          <spotLight
            position={[0, 50, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
          />
          <hemisphereLight
            skyColor='#b1e1ff'
            groundColor='#000000'
            intensity={1}
          />
          
         
          <Sky isRotating={isRotating} />
          <Camping 
            isRotating={isRotating} 
            position={campingPosition}
            rotation={[0, 4.9, 0]}
            scale={campingScale}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
          />
          {/*<Tulia
            setIsRotating={setIsRotating}
            isRotating={isRotating}
            position={tuliaPosition}
            rotation={[0.1, 0.7077, 0]}
            scale={tuliaScale}
          />     
          <CyclistAnimated
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
            position={cyclistAnimatedPosition}
            rotation={[0.1, 0.7077, 0]}
            scale={cyclistAnimatedScale}
          />*/}
        </Suspense>
      </Canvas>

      <div className='absolute bottom-2 left-2'>
        <img
          src={!isPlayingMusic ? soundoff : soundon}
          alt='jukebox'
          onClick={() => setIsPlayingMusic(!isPlayingMusic)}
          className='w-10 h-10 cursor-pointer object-contain'
        />
      </div>
    </section>
  );
};

export default Home;
