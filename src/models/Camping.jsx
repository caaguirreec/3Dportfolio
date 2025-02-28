import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import campingScene from "../assets/3d/camping.glb";


export function Camping({ isRotating, ...props }) {
  const camping = useGLTF(campingScene);
  const campingRef = useRef();

  // Note: Animation names can be found on the Sketchfab website where the 3D model is hosted.
  // It ensures smooth animations by making the rotation frame rate-independent.
  // 'delta' represents the time in seconds since the last frame.
  useFrame((_, delta) => {
    if (isRotating) {
      campingRef.current.rotation.y += 0.25 * delta; // Adjust the rotation speed as needed
    }
  });

  return (
    <mesh {...props} ref={campingRef}>
      // use the primitive element when you want to directly embed a complex 3D
      model or scene
      <primitive object={camping.scene} />
    </mesh>
  );
}
