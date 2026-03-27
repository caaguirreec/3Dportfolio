import { useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { heightAt } from "./Terrain";

const SPEED = 0.12;
const TURN_SPEED = 0.035;
const CAMERA_OFFSET = new THREE.Vector3(0, 4, -6);
const CAMERA_LOOKAT_OFFSET = new THREE.Vector3(0, 1, 3);

// Procedural low-poly bike + rider with bikepacking detail
function BikeModel({ wheelRefs }) {
  return (
    <group>
      {/* ===== BIKE FRAME ===== */}
      {/* Top tube */}
      <mesh position={[0, 0.52, 0.05]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[0.05, 0.05, 0.55]} />
        <meshLambertMaterial color="#1a1a2e" />
      </mesh>
      {/* Down tube */}
      <mesh position={[0, 0.38, 0.15]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[0.05, 0.05, 0.45]} />
        <meshLambertMaterial color="#1a1a2e" />
      </mesh>
      {/* Seat tube */}
      <mesh position={[0, 0.42, -0.15]} rotation={[-0.12, 0, 0]}>
        <boxGeometry args={[0.05, 0.52, 0.05]} />
        <meshLambertMaterial color="#1a1a2e" />
      </mesh>
      {/* Seat stays (to rear wheel) */}
      <mesh position={[0, 0.38, -0.28]} rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[0.04, 0.04, 0.35]} />
        <meshLambertMaterial color="#1a1a2e" />
      </mesh>
      {/* Chain stays */}
      <mesh position={[0, 0.2, -0.25]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[0.04, 0.04, 0.32]} />
        <meshLambertMaterial color="#1a1a2e" />
      </mesh>
      {/* Fork */}
      <mesh position={[0, 0.35, 0.38]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.04, 0.38, 0.04]} />
        <meshLambertMaterial color="#333" />
      </mesh>
      {/* Head tube */}
      <mesh position={[0, 0.55, 0.32]} rotation={[0.25, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.12, 6]} />
        <meshLambertMaterial color="#1a1a2e" />
      </mesh>

      {/* ===== SEAT ===== */}
      <mesh position={[0, 0.68, -0.17]}>
        <boxGeometry args={[0.14, 0.03, 0.2]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
      {/* Seat post */}
      <mesh position={[0, 0.64, -0.15]}>
        <cylinderGeometry args={[0.02, 0.02, 0.08, 5]} />
        <meshLambertMaterial color="#555" />
      </mesh>

      {/* ===== HANDLEBARS ===== */}
      {/* Stem */}
      <mesh position={[0, 0.62, 0.35]}>
        <boxGeometry args={[0.04, 0.04, 0.08]} />
        <meshLambertMaterial color="#555" />
      </mesh>
      {/* Bar */}
      <mesh position={[0, 0.65, 0.38]}>
        <boxGeometry args={[0.36, 0.03, 0.03]} />
        <meshLambertMaterial color="#555" />
      </mesh>
      {/* Bar grips */}
      <mesh position={[-0.16, 0.65, 0.38]}>
        <cylinderGeometry args={[0.025, 0.025, 0.06, 6]} rotation={[0, 0, Math.PI / 2]} />
        <meshLambertMaterial color="#e74c3c" />
      </mesh>
      <mesh position={[0.16, 0.65, 0.38]}>
        <cylinderGeometry args={[0.025, 0.025, 0.06, 6]} rotation={[0, 0, Math.PI / 2]} />
        <meshLambertMaterial color="#e74c3c" />
      </mesh>
      {/* Bar tape wraps (drops) */}
      <mesh position={[-0.17, 0.62, 0.36]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.03, 0.06, 0.03]} />
        <meshLambertMaterial color="#e74c3c" />
      </mesh>
      <mesh position={[0.17, 0.62, 0.36]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.03, 0.06, 0.03]} />
        <meshLambertMaterial color="#e74c3c" />
      </mesh>

      {/* ===== WHEELS ===== */}
      {/* Front wheel — outer group: position + 90° Y correction; inner group: spin ref */}
      <group position={[0, 0.18, 0.42]} rotation={[0, Math.PI / 2, 0]}>
        <group ref={(el) => (wheelRefs.current[0] = el)}>
          {/* Tire */}
          <mesh>
            <torusGeometry args={[0.18, 0.035, 8, 20]} />
            <meshLambertMaterial color="#1a1a1a" />
          </mesh>
          {/* Tire tread detail */}
          <mesh>
            <torusGeometry args={[0.18, 0.038, 4, 20]} />
            <meshLambertMaterial color="#2a2a2a" wireframe />
          </mesh>
          {/* Hub */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.06, 8]} />
            <meshLambertMaterial color="#aaa" />
          </mesh>
          {/* Spokes */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <mesh key={`fs${i}`} rotation={[0, 0, (i * Math.PI) / 4]}>
              <boxGeometry args={[0.008, 0.34, 0.008]} />
              <meshLambertMaterial color="#ccc" />
            </mesh>
          ))}
        </group>
      </group>
      {/* Rear wheel */}
      <group position={[0, 0.18, -0.42]} rotation={[0, Math.PI / 2, 0]}>
        <group ref={(el) => (wheelRefs.current[1] = el)}>
          {/* Tire */}
          <mesh>
            <torusGeometry args={[0.18, 0.035, 8, 20]} />
            <meshLambertMaterial color="#1a1a1a" />
          </mesh>
          {/* Tire tread detail */}
          <mesh>
            <torusGeometry args={[0.18, 0.038, 4, 20]} />
            <meshLambertMaterial color="#2a2a2a" wireframe />
          </mesh>
          {/* Hub — slightly larger rear hub */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.07, 8]} />
            <meshLambertMaterial color="#aaa" />
          </mesh>
          {/* Cassette detail */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]}>
            <cylinderGeometry args={[0.04, 0.03, 0.02, 8]} />
            <meshLambertMaterial color="#777" />
          </mesh>
          {/* Spokes */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <mesh key={`rs${i}`} rotation={[0, 0, (i * Math.PI) / 4]}>
              <boxGeometry args={[0.008, 0.34, 0.008]} />
              <meshLambertMaterial color="#ccc" />
            </mesh>
          ))}
        </group>
      </group>

      {/* ===== PEDALS & CRANKS ===== */}
      <mesh position={[0, 0.22, -0.12]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.04, 8]} />
        <meshLambertMaterial color="#666" />
      </mesh>
      {/* Pedals */}
      <mesh position={[-0.1, 0.22, -0.12]}>
        <boxGeometry args={[0.06, 0.02, 0.08]} />
        <meshLambertMaterial color="#444" />
      </mesh>
      <mesh position={[0.1, 0.22, -0.12]}>
        <boxGeometry args={[0.06, 0.02, 0.08]} />
        <meshLambertMaterial color="#444" />
      </mesh>

      {/* ===== BIKEPACKING BAGS ===== */}
      {/* Frame bag (in triangle) */}
      <mesh position={[0, 0.4, 0]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.08, 0.12, 0.3]} />
        <meshLambertMaterial color="#2d5016" />
      </mesh>
      {/* Frame bag straps */}
      <mesh position={[0, 0.4, 0.1]}>
        <boxGeometry args={[0.1, 0.02, 0.02]} />
        <meshLambertMaterial color="#111" />
      </mesh>
      <mesh position={[0, 0.4, -0.08]}>
        <boxGeometry args={[0.1, 0.02, 0.02]} />
        <meshLambertMaterial color="#111" />
      </mesh>
      {/* Handlebar roll bag */}
      <mesh position={[0, 0.7, 0.42]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.28, 8]} />
        <meshLambertMaterial color="#c75b2a" />
      </mesh>
      {/* Handlebar bag straps */}
      <mesh position={[0, 0.7, 0.35]}>
        <boxGeometry args={[0.3, 0.015, 0.015]} />
        <meshLambertMaterial color="#111" />
      </mesh>
      {/* Seat bag (large saddle bag) */}
      <mesh position={[0, 0.58, -0.32]}>
        <boxGeometry args={[0.16, 0.16, 0.22]} />
        <meshLambertMaterial color="#c75b2a" />
      </mesh>
      {/* Seat bag tapered end */}
      <mesh position={[0, 0.56, -0.46]}>
        <boxGeometry args={[0.12, 0.12, 0.08]} />
        <meshLambertMaterial color="#b04f22" />
      </mesh>
      {/* Water bottle on frame */}
      <mesh position={[0.06, 0.42, -0.04]} rotation={[0.1, 0, 0.1]}>
        <cylinderGeometry args={[0.025, 0.025, 0.16, 6]} />
        <meshLambertMaterial color="#3498db" />
      </mesh>
      {/* Bottle cage */}
      <mesh position={[0.06, 0.38, -0.04]}>
        <boxGeometry args={[0.06, 0.02, 0.06]} />
        <meshLambertMaterial color="#888" />
      </mesh>

      {/* ===== RIDER ===== */}
      {/* Torso - slight lean forward */}
      <mesh position={[0, 0.92, 0.02]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.26, 0.32, 0.16]} />
        <meshLambertMaterial color="#2563eb" />
      </mesh>
      {/* Jersey back pocket detail */}
      <mesh position={[0, 0.84, -0.06]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.24, 0.08, 0.02]} />
        <meshLambertMaterial color="#1d4ed8" />
      </mesh>
      {/* Shoulders */}
      <mesh position={[-0.15, 1.0, 0.08]}>
        <sphereGeometry args={[0.06, 5, 5]} />
        <meshLambertMaterial color="#2563eb" />
      </mesh>
      <mesh position={[0.15, 1.0, 0.08]}>
        <sphereGeometry args={[0.06, 5, 5]} />
        <meshLambertMaterial color="#2563eb" />
      </mesh>
      {/* Left arm - reaching to handlebar */}
      <mesh position={[-0.16, 0.88, 0.2]} rotation={[0.9, 0, 0.15]}>
        <boxGeometry args={[0.08, 0.25, 0.08]} />
        <meshLambertMaterial color="#2563eb" />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.16, 0.88, 0.2]} rotation={[0.9, 0, -0.15]}>
        <boxGeometry args={[0.08, 0.25, 0.08]} />
        <meshLambertMaterial color="#2563eb" />
      </mesh>
      {/* Left glove/hand */}
      <mesh position={[-0.16, 0.73, 0.36]}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshLambertMaterial color="#333" />
      </mesh>
      {/* Right glove/hand */}
      <mesh position={[0.16, 0.73, 0.36]}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshLambertMaterial color="#333" />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.1, 0.06]}>
        <cylinderGeometry args={[0.04, 0.04, 0.08, 5]} />
        <meshLambertMaterial color="#deb887" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.2, 0.06]}>
        <sphereGeometry args={[0.11, 8, 6]} />
        <meshLambertMaterial color="#deb887" />
      </mesh>
      {/* Helmet */}
      <mesh position={[0, 1.27, 0.04]}>
        <sphereGeometry args={[0.125, 8, 5]} />
        <meshLambertMaterial color="#e74c3c" />
      </mesh>
      {/* Helmet visor */}
      <mesh position={[0, 1.23, 0.14]}>
        <boxGeometry args={[0.14, 0.03, 0.06]} />
        <meshLambertMaterial color="#c0392b" />
      </mesh>
      {/* Sunglasses */}
      <mesh position={[0, 1.19, 0.16]}>
        <boxGeometry args={[0.18, 0.04, 0.02]} />
        <meshLambertMaterial color="#111" />
      </mesh>
      {/* Backpack */}
      <mesh position={[0, 0.94, -0.12]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.24, 0.28, 0.14]} />
        <meshLambertMaterial color="#f39c12" />
      </mesh>
      {/* Backpack top flap */}
      <mesh position={[0, 1.06, -0.1]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.24, 0.04, 0.12]} />
        <meshLambertMaterial color="#e67e22" />
      </mesh>
      {/* Backpack straps */}
      <mesh position={[-0.08, 0.96, -0.02]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.04, 0.22, 0.03]} />
        <meshLambertMaterial color="#d35400" />
      </mesh>
      <mesh position={[0.08, 0.96, -0.02]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.04, 0.22, 0.03]} />
        <meshLambertMaterial color="#d35400" />
      </mesh>
      {/* Left thigh */}
      <mesh position={[-0.09, 0.62, -0.02]} rotation={[0.6, 0, 0]}>
        <boxGeometry args={[0.1, 0.26, 0.1]} />
        <meshLambertMaterial color="#1e3a5f" />
      </mesh>
      {/* Right thigh */}
      <mesh position={[0.09, 0.62, -0.02]} rotation={[0.6, 0, 0]}>
        <boxGeometry args={[0.1, 0.26, 0.1]} />
        <meshLambertMaterial color="#1e3a5f" />
      </mesh>
      {/* Left shin */}
      <mesh position={[-0.09, 0.42, 0.08]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[0.09, 0.22, 0.09]} />
        <meshLambertMaterial color="#1e3a5f" />
      </mesh>
      {/* Right shin */}
      <mesh position={[0.09, 0.42, 0.08]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[0.09, 0.22, 0.09]} />
        <meshLambertMaterial color="#1e3a5f" />
      </mesh>
      {/* Left shoe */}
      <mesh position={[-0.09, 0.26, 0.06]}>
        <boxGeometry args={[0.09, 0.06, 0.14]} />
        <meshLambertMaterial color="#222" />
      </mesh>
      {/* Right shoe */}
      <mesh position={[0.09, 0.26, 0.06]}>
        <boxGeometry args={[0.09, 0.06, 0.14]} />
        <meshLambertMaterial color="#222" />
      </mesh>
    </group>
  );
}

export default function BikeController({ bikePositionRef, onStageChange }) {
  const groupRef = useRef();
  const wheelRefs = useRef([]);
  const keysRef = useRef({});
  const velocityRef = useRef(0);
  const headingRef = useRef(0);
  const { camera } = useThree();

  // Touch controls state
  const touchRef = useRef({ active: false, startX: 0, startY: 0, dx: 0, dy: 0 });

  const handleKeyDown = useCallback((e) => {
    keysRef.current[e.code] = true;
  }, []);

  const handleKeyUp = useCallback((e) => {
    keysRef.current[e.code] = false;
  }, []);

  const handleTouchStart = useCallback((e) => {
    const t = e.touches[0];
    touchRef.current = { active: true, startX: t.clientX, startY: t.clientY, dx: 0, dy: 0 };
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!touchRef.current.active) return;
    const t = e.touches[0];
    touchRef.current.dx = (t.clientX - touchRef.current.startX) / 60;
    touchRef.current.dy = (t.clientY - touchRef.current.startY) / 60;
  }, []);

  const handleTouchEnd = useCallback(() => {
    touchRef.current = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.05); // clamp for tab-out
    const keys = keysRef.current;
    const touch = touchRef.current;

    // Input
    let accel = 0;
    let steer = 0;

    if (keys["KeyW"] || keys["ArrowUp"]) accel = 1;
    if (keys["KeyS"] || keys["ArrowDown"]) accel = -0.5;
    if (keys["KeyA"] || keys["ArrowLeft"]) steer = 1;
    if (keys["KeyD"] || keys["ArrowRight"]) steer = -1;

    // Touch input
    if (touch.active) {
      accel = -touch.dy; // drag up = forward
      steer = -touch.dx;
      accel = Math.max(-0.5, Math.min(1, accel));
      steer = Math.max(-1, Math.min(1, steer));
    }

    // Physics
    velocityRef.current += accel * SPEED * dt * 60;
    velocityRef.current *= 0.95; // friction
    velocityRef.current = Math.max(-SPEED * 0.5, Math.min(SPEED * 1.5, velocityRef.current));

    if (Math.abs(velocityRef.current) > 0.005) {
      headingRef.current += steer * TURN_SPEED * dt * 60 * Math.sign(velocityRef.current);
    }

    // Move
    const heading = headingRef.current;
    const moveX = Math.sin(heading) * velocityRef.current;
    const moveZ = Math.cos(heading) * velocityRef.current;

    const newX = groupRef.current.position.x + moveX;
    const newZ = groupRef.current.position.z + moveZ;

    // Keep within bounds (compact world)
    const clampedX = Math.max(-55, Math.min(55, newX));
    const clampedZ = Math.max(-55, Math.min(55, newZ));

    const groundY = heightAt(clampedX, clampedZ);
    groupRef.current.position.set(clampedX, groundY, clampedZ);
    groupRef.current.rotation.y = heading;

    // Tilt bike based on terrain slope
    const slopeX = (heightAt(clampedX + 0.5, clampedZ) - heightAt(clampedX - 0.5, clampedZ)) / 1;
    const slopeZ = (heightAt(clampedX, clampedZ + 0.5) - heightAt(clampedX, clampedZ - 0.5)) / 1;
    groupRef.current.rotation.x = -slopeZ * Math.cos(heading) * 0.3;
    groupRef.current.rotation.z = slopeX * Math.cos(heading) * 0.3;

    // Animate wheels — spin around Z axis (forward rolling after 90° Y correction)
    wheelRefs.current.forEach((wheel) => {
      if (wheel) wheel.rotation.z -= velocityRef.current * 5;
    });

    // Update bike position ref for husky
    if (bikePositionRef) {
      bikePositionRef.current = groupRef.current.position;
    }

    // Camera follow
    const idealOffset = CAMERA_OFFSET.clone()
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), heading)
      .add(groupRef.current.position);
    idealOffset.y = Math.max(groundY + 3, idealOffset.y);

    const idealLookAt = CAMERA_LOOKAT_OFFSET.clone()
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), heading)
      .add(groupRef.current.position);

    camera.position.lerp(idealOffset, 0.06);
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    camera.lookAt(
      camera.position.x + (idealLookAt.x - camera.position.x) * 0.08,
      camera.position.y + (idealLookAt.y - camera.position.y) * 0.08,
      camera.position.z + (idealLookAt.z - camera.position.z) * 0.08
    );

    // Detect trail stops
    if (onStageChange) {
      onStageChange(clampedX, clampedZ);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <BikeModel wheelRefs={wheelRefs} />
    </group>
  );
}
