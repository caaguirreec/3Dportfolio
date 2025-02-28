import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import tuliaScene from "../assets/3d/wolf.glb";

// 3D Model from: https://sketchfab.com/3d-models/stylized-ww1-tulia-c4edeb0e410f46e8a4db320879f0a1db
export function Tulia({     
    isRotating,
    setIsRotating,
    setCurrentStage,
    currentFocusPoint,
    ...props
 }) {
  const ref = useRef();
  const { gl, viewport } = useThree();
  // Load the 3D model and its animations
  const { scene, animations } = useGLTF(tuliaScene);
  // Get animation actions associated with the tulia
  const { actions } = useAnimations(animations, ref);
  // Handle pointer (mouse or touch) down event
  const handlePointerDown = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(true);

    // Calculate the clientX based on whether it's a touch event or a mouse event
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;

    // Store the current clientX position for reference
    lastX.current = clientX;
  };
      // Handle pointer (mouse or touch) up event
      const handlePointerUp = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setIsRotating(false);
      };
    
      // Handle pointer (mouse or touch) move event
      const handlePointerMove = (event) => {
        event.stopPropagation();
        event.preventDefault();
        if (isRotating) {
          // If rotation is enabled, calculate the change in clientX position
          const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    
          // calculate the change in the horizontal position of the mouse cursor or touch input,
          // relative to the viewport's width
          const delta = (clientX - lastX.current) / viewport.width;
    
          // Update the island's rotation based on the mouse/touch movement
          ref.current.rotation.y += delta * 0.01 * Math.PI;
          // Update the reference for the last clientX position
          lastX.current = clientX;
    
          // Update the rotation speed
          rotationSpeed.current = delta * 0.01 * Math.PI;
        }
      };
 // Handle keydown events
 const handleKeyDown = (event) => {
    if (event.key === "ArrowUp") {
      if (!isRotating) setIsRotating(true);

      ref.current.rotation.z += 0.01;//0.005 * Math.PI;
      ref.current.rotation.x -= 0.01;//0.005 * Math.PI;
      rotationSpeed.current = 0.007;
    }
    if (event.key === "ArrowDown") {
      if (!isRotating) setIsRotating(true);

      ref.current.rotation.z -= 0.01;//0.005 * Math.PI;
      ref.current.rotation.x -= 0.01;//0.005 * Math.PI;
      rotationSpeed.current = 0.007;
    }
    if (event.key === "ArrowLeft") {
      if (!isRotating) setIsRotating(true);

      ref.current.rotation.y += 0.005 * Math.PI;
      rotationSpeed.current = 0.007;
    } else if (event.key === "ArrowRight") {
      if (!isRotating) setIsRotating(true);

      ref.current.rotation.y -= 0.005 * Math.PI;
      rotationSpeed.current = -0.007;
    }
  };

  // Handle keyup events
  const handleKeyUp = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      setIsRotating(false);
    }
  };

  // Touch events for mobile devices
  const handleTouchStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);
  
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    lastX.current = clientX;
  }
  
  const handleTouchEnd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(false);
  }
  
  const handleTouchMove = (e) => {
    e.stopPropagation();
    e.preventDefault();
  
    if (isRotating) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const delta = (clientX - lastX.current) / viewport.width;
  
      ref.current.rotation.y += delta * 0.01 * Math.PI;
      lastX.current = clientX;
      rotationSpeed.current = delta * 0.01 * Math.PI;
    }
  }
  // Use an effect to control the tulia's animation based on 'isRotating'
  // Note: Animation names can be found on the Sketchfab website where the 3D model is hosted.
  useEffect(() => {
    actions["Take 001"].play();
    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("touchmove", handleTouchMove);
    // if (isRotating) {
    //   actions["Take 001"].play();
    // } else {
    //   actions["Take 001"].stop();
    // }
  }, [actions, isRotating]);

  return (
    <mesh {...props} ref={ref}>
      <primitive object={scene} />
    </mesh>
  );
}
