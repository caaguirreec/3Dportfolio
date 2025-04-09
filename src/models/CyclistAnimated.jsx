import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import tuliaScene from "../assets/3d/cyclist_animated.glb";


export function CyclistAnimated({     
    isRotating,
    setIsRotating,
    setCurrentStage,
    currentFocusPoint,
    position,
    rotation,
    scale,
    onPositionChange,
    onRotationChange,
    onCollision
 }) {
  const ref = useRef();
  const { gl, viewport } = useThree();
  // Load the 3D model and its animations
  const { scene, animations } = useGLTF(tuliaScene);
  // Get animation actions associated with the tulia
  const { actions } = useAnimations(animations, ref);
  const rotationSpeed = useRef(0);
  const lastTouchPosition = useRef({ x: 0, y: 0 });
  const touchStartTime = useRef(0);
  const isMoving = useRef(false);

  // Add collision detection
  const checkCollisions = (newPosition) => {
    // Get all objects in the scene
    const objects = scene.children.filter(child => 
      child.userData.type === 'berry' || 
      child.userData.type === 'mushroom' || 
      child.userData.type === 'food' ||
      child.userData.type === 'campsite'
    );

    // Check for collisions
    objects.forEach(obj => {
      const distance = Math.sqrt(
        Math.pow(newPosition[0] - obj.position.x, 2) +
        Math.pow(newPosition[2] - obj.position.z, 2)
      );

      if (distance < 1) { // Collision radius
        // Call onCollision with the object type and position
        onCollision(obj.userData.type, [obj.position.x, obj.position.y, obj.position.z]);
        
        // Remove the object from the scene
        scene.remove(obj);
      }
    });
  };

  // Handle touch start
  const handleTouchStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const touch = e.touches[0];
    lastTouchPosition.current = {
      x: touch.clientX,
      y: touch.clientY
    };
    touchStartTime.current = Date.now();
    isMoving.current = true;
    setIsRotating(true);
    actions["M_rig_Action_S"].play();
  };

  // Update handleTouchMove to include collision detection
  const handleTouchMove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isMoving.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - lastTouchPosition.current.x;
    const deltaY = touch.clientY - lastTouchPosition.current.y;
    
    const movementSpeed = 0.1;
    const newPosition = [...position];
    const newRotation = rotation[1];

    if (Math.abs(deltaY) > 5) {
      newPosition[0] += Math.sin(newRotation) * (deltaY * movementSpeed);
      newPosition[2] += Math.cos(newRotation) * (deltaY * movementSpeed);
      
      // Check for collisions when moving
      checkCollisions(newPosition);
    }

    if (Math.abs(deltaX) > 5) {
      const rotationDelta = deltaX * 0.01;
      onRotationChange([0, newRotation + rotationDelta, 0]);
    }

    if (newPosition[0] !== position[0] || newPosition[2] !== position[2]) {
      onPositionChange(newPosition);
    }

    lastTouchPosition.current = {
      x: touch.clientX,
      y: touch.clientY
    };
  };

  // Handle touch end
  const handleTouchEnd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    isMoving.current = false;
    setIsRotating(false);
    actions["M_rig_Action_S"].stop();
  };

  // Update handleKeyDown to include collision detection
  const handleKeyDown = (event) => {
    actions["M_rig_Action_S"].play();
    
    const newPosition = [...position];
    const newRotation = rotation[1];
    let moved = false;

    switch (event.key) {
      case 'ArrowUp':
        newPosition[0] += Math.sin(newRotation) * 0.1;
        newPosition[2] += Math.cos(newRotation) * 0.1;
        moved = true;
        break;
      case 'ArrowDown':
        newPosition[0] -= Math.sin(newRotation) * 0.1;
        newPosition[2] -= Math.cos(newRotation) * 0.1;
        moved = true;
        break;
      case 'ArrowLeft':
        onRotationChange([0, newRotation + 0.1, 0]);
        break;
      case 'ArrowRight':
        onRotationChange([0, newRotation - 0.1, 0]);
        break;
    }

    if (moved) {
      // Check for collisions when moving
      checkCollisions(newPosition);
      onPositionChange(newPosition);
    }
  };

  // Handle keyup events
  const handleKeyUp = (event) => {
    actions["M_rig_Action_S"].stop();
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      setIsRotating(false);
    }
  };

  // Use an effect to control the tulia's animation based on 'isRotating'
  // Note: Animation names can be found on the Sketchfab website where the 3D model is hosted.
  useEffect(() => {
    const canvas = gl.domElement;
    
    // Add touch event listeners
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
    
    // Add keyboard event listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      // Clean up touch event listeners
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      
      // Clean up keyboard event listeners
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [actions, isRotating, position, rotation]);

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </mesh>
  );
}
