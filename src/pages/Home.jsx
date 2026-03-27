import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import sakura from "../assets/sakura.mp3";
import { Loader } from "../components";
import { soundoff, soundon } from "../assets/icons";
import {
  Terrain,
  BikeController,
  TrailPath,
  TRAIL_STOPS,
  TrailUI,
  Trees,
  Rocks,
  Bushes,
  GrassPatches,
  Wildflowers,
  Water,
  Clouds,
  Campfire,
  Tent,
  ClimbingWall,
  PrayerFlags,
  Husky,
} from "../world";
import { heightAt } from "../world/Terrain";

const Home = () => {
  const audioRef = useRef(new Audio(sakura));
  audioRef.current.volume = 0.4;
  audioRef.current.loop = true;

  const [currentStage, setCurrentStage] = useState(1);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const bikePositionRef = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (isPlayingMusic) {
      audioRef.current.play();
    }
    return () => {
      audioRef.current.pause();
    };
  }, [isPlayingMusic]);

  // Detect which trail stop the bike is near
  const handleStageChange = useCallback((x, z) => {
    let nearestStage = null;
    for (const stop of TRAIL_STOPS) {
      const dx = x - stop.position[0];
      const dz = z - stop.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < stop.radius) {
        nearestStage = stop.stage;
        break;
      }
    }
    setCurrentStage(nearestStage);
  }, []);

  // Pre-compute stop positions with terrain height (smaller world)
  const campsitePos = [-15, heightAt(-15, -20), -20];
  const climbingPos = [-25, heightAt(-25, 25) + 5, 25];
  const summitPos = [5, heightAt(5, 40) + 0.5, 40];

  return (
    <section className="w-full h-screen relative">
      <TrailUI currentStage={currentStage} isMobile={isMobile} />

      <Canvas
        className="w-full h-screen bg-transparent"
        camera={{ fov: 60, near: 0.1, far: 150, position: [0, 8, -10] }}
        shadows={false}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={<Loader />}>
          {/* Lighting — keep minimal for performance */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[60, 80, 40]}
            intensity={1.2}
            color="#fff5e6"
          />
          <hemisphereLight skyColor="#87ceeb" groundColor="#4a7c3f" intensity={0.4} />

          {/* Sky gradient */}
          <fog attach="fog" args={["#c9e8ff", 30, 85]} />
          <color attach="background" args={["#87ceeb"]} />

          {/* World */}
          <Terrain />
          <TrailPath />
          <Trees />
          <Rocks />
          <Bushes />
          <GrassPatches />
          <Wildflowers />
          <Water />
          <Clouds />

          {/* Stop decorations */}
          <Campfire position={campsitePos} />
          <Tent position={[campsitePos[0] - 2, campsitePos[1], campsitePos[2] + 1.5]} />
          <ClimbingWall position={climbingPos} />
          <PrayerFlags position={summitPos} />

          {/* Player */}
          <BikeController
            bikePositionRef={bikePositionRef}
            onStageChange={handleStageChange}
          />

          {/* Husky companion */}
          <Husky bikePosition={bikePositionRef} />
        </Suspense>
      </Canvas>

      {/* Music toggle */}
      <div className="absolute bottom-2 left-2 z-[3]">
        <img
          src={!isPlayingMusic ? soundoff : soundon}
          alt="jukebox"
          onClick={() => setIsPlayingMusic(!isPlayingMusic)}
          className="w-10 h-10 cursor-pointer object-contain"
        />
      </div>
    </section>
  );
};

export default Home;
