import { useRef, useEffect, useCallback, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { heightAt } from "./Terrain";

const SPEED = 0.12;
const TURN_SPEED = 0.035;
const CAMERA_OFFSET = new THREE.Vector3(0, 4, -6);
const CAMERA_LOOKAT_OFFSET = new THREE.Vector3(0, 1, 3);

// Procedural bike + rider with improved geometry and pedaling animation
function BikeModel({ wheelRefs, crankRef }) {
  return (
    <group>
      {/* ===== BIKE FRAME ===== */}
      {/* Top tube */}
      <mesh position={[0, 0.52, 0.05]} rotation={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.55, 24]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Down tube */}
      <mesh position={[0, 0.38, 0.15]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.024, 0.02, 0.45, 24]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Seat tube */}
      <mesh position={[0, 0.42, -0.15]} rotation={[-0.12, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.52, 24]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Seat stays (to rear wheel) */}
      <mesh position={[0, 0.38, -0.28]} rotation={[-0.35, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.35, 20]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Chain stays */}
      <mesh position={[0, 0.2, -0.25]} rotation={[-0.15, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.32, 20]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Fork */}
      <mesh position={[0, 0.35, 0.38]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.016, 0.38, 20]} />
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Head tube */}
      <mesh position={[0, 0.55, 0.32]} rotation={[0.25, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.12, 24]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* ===== SEAT ===== */}
      <mesh position={[0, 0.68, -0.17]}>
        <capsuleGeometry args={[0.06, 0.06, 16, 24]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      {/* Seat post */}
      <mesh position={[0, 0.64, -0.15]}>
        <cylinderGeometry args={[0.015, 0.015, 0.08, 20]} />
        <meshStandardMaterial color="#666" metalness={0.7} roughness={0.25} />
      </mesh>

      {/* ===== HANDLEBARS ===== */}
      {/* Stem */}
      <mesh position={[0, 0.62, 0.35]}>
        <cylinderGeometry args={[0.016, 0.016, 0.08, 20]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#666" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Bar */}
      <mesh position={[0, 0.65, 0.38]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.36, 24]} />
        <meshStandardMaterial color="#666" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Bar grips */}
      <mesh position={[-0.16, 0.65, 0.38]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.06, 24]} />
        <meshStandardMaterial color="#c0392b" roughness={0.7} />
      </mesh>
      <mesh position={[0.16, 0.65, 0.38]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.06, 24]} />
        <meshStandardMaterial color="#c0392b" roughness={0.7} />
      </mesh>
      {/* Bar tape wraps (drops) */}
      <mesh position={[-0.17, 0.62, 0.36]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 0.06, 20]} />
        <meshStandardMaterial color="#c0392b" roughness={0.7} />
      </mesh>
      <mesh position={[0.17, 0.62, 0.36]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 0.06, 20]} />
        <meshStandardMaterial color="#c0392b" roughness={0.7} />
      </mesh>

      {/* ===== WHEELS ===== */}
      {/* Front wheel */}
      <group position={[0, 0.18, 0.42]} rotation={[0, Math.PI / 2, 0]}>
        <group ref={(el) => (wheelRefs.current[0] = el)}>
          <mesh>
            <torusGeometry args={[0.18, 0.03, 24, 48]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.18, 0.032, 8, 48]} />
            <meshStandardMaterial color="#2a2a2a" wireframe />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.06, 24]} />
            <meshStandardMaterial color="#bbb" metalness={0.8} roughness={0.2} />
          </mesh>
          {[...Array(16)].map((_, i) => (
            <mesh key={`fs${i}`} rotation={[0, 0, (i * Math.PI) / 8]}>
              <cylinderGeometry args={[0.003, 0.003, 0.34, 6]} />
              <meshStandardMaterial color="#ddd" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
        </group>
      </group>
      {/* Rear wheel */}
      <group position={[0, 0.18, -0.42]} rotation={[0, Math.PI / 2, 0]}>
        <group ref={(el) => (wheelRefs.current[1] = el)}>
          <mesh>
            <torusGeometry args={[0.18, 0.03, 24, 48]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.18, 0.032, 8, 48]} />
            <meshStandardMaterial color="#2a2a2a" wireframe />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.07, 24]} />
            <meshStandardMaterial color="#bbb" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]}>
            <cylinderGeometry args={[0.038, 0.028, 0.02, 24]} />
            <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
          </mesh>
          {[...Array(16)].map((_, i) => (
            <mesh key={`rs${i}`} rotation={[0, 0, (i * Math.PI) / 8]}>
              <cylinderGeometry args={[0.003, 0.003, 0.34, 6]} />
              <meshStandardMaterial color="#ddd" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ===== CRANKS & PEDALS (animated) ===== */}
      <group ref={crankRef} position={[0, 0.22, -0.12]}>
        {/* Crank axle */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.04, 24]} />
          <meshStandardMaterial color="#777" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Left crank arm + pedal */}
        <group>
          <mesh position={[-0.06, 0, 0.06]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.015, 0.1, 0.015]} />
            <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[-0.06, 0, 0.12]}>
            <boxGeometry args={[0.06, 0.015, 0.06]} />
            <meshStandardMaterial color="#444" roughness={0.8} />
          </mesh>
        </group>
        {/* Right crank arm + pedal */}
        <group>
          <mesh position={[0.06, 0, -0.06]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.015, 0.1, 0.015]} />
            <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0.06, 0, -0.12]}>
            <boxGeometry args={[0.06, 0.015, 0.06]} />
            <meshStandardMaterial color="#444" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* ===== BIKEPACKING BAGS ===== */}
      {/* Frame bag (in triangle) */}
      <mesh position={[0, 0.4, 0]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.08, 0.12, 0.3]} />
        <meshStandardMaterial color="#2d5016" roughness={0.85} />
      </mesh>
      {/* Frame bag straps */}
      <mesh position={[0, 0.4, 0.1]}>
        <boxGeometry args={[0.1, 0.015, 0.015]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.4, -0.08]}>
        <boxGeometry args={[0.1, 0.015, 0.015]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      {/* Handlebar roll bag */}
      <mesh position={[0, 0.7, 0.42]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.26, 32]} />
        <meshStandardMaterial color="#c75b2a" roughness={0.8} />
      </mesh>
      {/* Handlebar bag end caps */}
      <mesh position={[-0.13, 0.7, 0.42]} rotation={[0, 0, Math.PI / 2]}>
        <circleGeometry args={[0.07, 32]} />
        <meshStandardMaterial color="#a84e22" roughness={0.8} />
      </mesh>
      <mesh position={[0.13, 0.7, 0.42]} rotation={[0, 0, -Math.PI / 2]}>
        <circleGeometry args={[0.07, 32]} />
        <meshStandardMaterial color="#a84e22" roughness={0.8} />
      </mesh>
      {/* Handlebar bag straps */}
      <mesh position={[0, 0.7, 0.35]}>
        <boxGeometry args={[0.28, 0.012, 0.012]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      {/* Seat bag (large saddle bag) */}
      <mesh position={[0, 0.58, -0.32]}>
        <boxGeometry args={[0.15, 0.15, 0.22]} />
        <meshStandardMaterial color="#c75b2a" roughness={0.8} />
      </mesh>
      {/* Seat bag tapered end */}
      <mesh position={[0, 0.56, -0.46]}>
        <boxGeometry args={[0.11, 0.11, 0.08]} />
        <meshStandardMaterial color="#b04f22" roughness={0.8} />
      </mesh>
      {/* Water bottle on frame */}
      <mesh position={[0.06, 0.42, -0.04]} rotation={[0.1, 0, 0.1]}>
        <cylinderGeometry args={[0.025, 0.022, 0.16, 24]} />
        <meshStandardMaterial color="#3498db" roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Bottle cap */}
      <mesh position={[0.06, 0.505, -0.025]} rotation={[0.1, 0, 0.1]}>
        <cylinderGeometry args={[0.018, 0.025, 0.02, 24]} />
        <meshStandardMaterial color="#2980b9" roughness={0.5} />
      </mesh>
      {/* Bottle cage */}
      <mesh position={[0.06, 0.38, -0.04]}>
        <boxGeometry args={[0.055, 0.015, 0.055]} />
        <meshStandardMaterial color="#999" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* ===== RIDER ===== */}
      {/* Torso - capsule for smooth shape */}
      <mesh position={[0, 0.93, 0.02]} rotation={[0.35, 0, 0]}>
        <capsuleGeometry args={[0.12, 0.1, 16, 32]} />
        <meshStandardMaterial color="#2d5016" roughness={0.7} />
      </mesh>
      {/* Jersey back pocket detail */}
      <mesh position={[0, 0.84, -0.06]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.22, 0.07, 0.02]} />
        <meshStandardMaterial color="#1e3a10" roughness={0.7} />
      </mesh>
      {/* Shoulders */}
      <mesh position={[-0.14, 1.0, 0.08]}>
        <sphereGeometry args={[0.06, 32, 24]} />
        <meshStandardMaterial color="#2d5016" roughness={0.7} />
      </mesh>
      <mesh position={[0.14, 1.0, 0.08]}>
        <sphereGeometry args={[0.06, 32, 24]} />
        <meshStandardMaterial color="#2d5016" roughness={0.7} />
      </mesh>
      {/* Left upper arm */}
      <mesh position={[-0.15, 0.92, 0.14]} rotation={[0.7, 0, 0.12]}>
        <capsuleGeometry args={[0.035, 0.14, 16, 24]} />
        <meshStandardMaterial color="#2d5016" roughness={0.7} />
      </mesh>
      {/* Left forearm */}
      <mesh position={[-0.16, 0.82, 0.28]} rotation={[1.1, 0, 0.1]}>
        <capsuleGeometry args={[0.03, 0.12, 16, 24]} />
        <meshStandardMaterial color="#2d5016" roughness={0.7} />
      </mesh>
      {/* Right upper arm */}
      <mesh position={[0.15, 0.92, 0.14]} rotation={[0.7, 0, -0.12]}>
        <capsuleGeometry args={[0.035, 0.14, 16, 24]} />
        <meshStandardMaterial color="#2d5016" roughness={0.7} />
      </mesh>
      {/* Right forearm */}
      <mesh position={[0.16, 0.82, 0.28]} rotation={[1.1, 0, -0.1]}>
        <capsuleGeometry args={[0.03, 0.12, 16, 24]} />
        <meshStandardMaterial color="#2d5016" roughness={0.7} />
      </mesh>
      {/* Left glove/hand */}
      <mesh position={[-0.16, 0.73, 0.36]}>
        <sphereGeometry args={[0.03, 24, 20]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
      {/* Right glove/hand */}
      <mesh position={[0.16, 0.73, 0.36]}>
        <sphereGeometry args={[0.03, 24, 20]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.1, 0.06]}>
        <cylinderGeometry args={[0.035, 0.04, 0.08, 24]} />
        <meshStandardMaterial color="#deb887" roughness={0.6} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.2, 0.06]}>
        <sphereGeometry args={[0.1, 32, 24]} />
        <meshStandardMaterial color="#deb887" roughness={0.6} />
      </mesh>
      {/* Helmet */}
      <mesh position={[0, 1.27, 0.04]}>
        <sphereGeometry args={[0.115, 32, 24]} />
        <meshStandardMaterial color="#e74c3c" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Helmet vents */}
      {[-0.04, 0, 0.04].map((x, i) => (
        <mesh key={`vent${i}`} position={[x, 1.35, 0.04]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.02, 0.005, 0.06]} />
          <meshStandardMaterial color="#c0392b" roughness={0.5} />
        </mesh>
      ))}
      {/* Helmet visor */}
      <mesh position={[0, 1.23, 0.14]}>
        <boxGeometry args={[0.13, 0.025, 0.05]} />
        <meshStandardMaterial color="#c0392b" roughness={0.4} />
      </mesh>
      {/* Sunglasses frame */}
      <mesh position={[0, 1.19, 0.155]}>
        <boxGeometry args={[0.16, 0.032, 0.015]} />
        <meshStandardMaterial color="#111" roughness={0.3} metalness={0.3} />
      </mesh>
      {/* Sunglasses lenses */}
      <mesh position={[-0.04, 1.19, 0.16]}>
        <boxGeometry args={[0.05, 0.025, 0.008]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.1} metalness={0.5} />
      </mesh>
      <mesh position={[0.04, 1.19, 0.16]}>
        <boxGeometry args={[0.05, 0.025, 0.008]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.1} metalness={0.5} />
      </mesh>
      {/* Backpack */}
      <mesh position={[0, 0.94, -0.12]} rotation={[0.2, 0, 0]}>
        <capsuleGeometry args={[0.11, 0.06, 16, 24]} />
        <meshStandardMaterial color="#f39c12" roughness={0.8} />
      </mesh>
      {/* Backpack top flap */}
      <mesh position={[0, 1.06, -0.1]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.22, 0.035, 0.11]} />
        <meshStandardMaterial color="#e67e22" roughness={0.8} />
      </mesh>
      {/* Backpack straps */}
      <mesh position={[-0.07, 0.96, -0.02]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.035, 0.2, 0.025]} />
        <meshStandardMaterial color="#d35400" roughness={0.8} />
      </mesh>
      <mesh position={[0.07, 0.96, -0.02]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.035, 0.2, 0.025]} />
        <meshStandardMaterial color="#d35400" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Animated rider legs — pedaling motion driven by crankAngle
function RiderLegs({ crankAngle }) {
  const CRANK_RADIUS = 0.12;
  const HIP_Y = 0.72;
  const HIP_Z = -0.06;
  const THIGH_LEN = 0.24;
  const SHIN_LEN = 0.22;

  // Compute IK for one leg given pedal position
  function legIK(pedalY, pedalZ) {
    const dy = HIP_Y - pedalY;
    const dz = pedalZ - HIP_Z;
    const dist = Math.sqrt(dy * dy + dz * dz);
    const maxReach = THIGH_LEN + SHIN_LEN - 0.01;
    const clampedDist = Math.min(dist, maxReach);
    const cosKnee = (THIGH_LEN * THIGH_LEN + SHIN_LEN * SHIN_LEN - clampedDist * clampedDist) / (2 * THIGH_LEN * SHIN_LEN);
    const kneeAngle = Math.acos(Math.max(-1, Math.min(1, cosKnee)));
    const hipToPedal = Math.atan2(dz, dy);
    const cosOffset = (THIGH_LEN * THIGH_LEN + clampedDist * clampedDist - SHIN_LEN * SHIN_LEN) / (2 * THIGH_LEN * clampedDist);
    const offsetAngle = Math.acos(Math.max(-1, Math.min(1, cosOffset)));
    const thighAngle = hipToPedal + offsetAngle;
    const shinAngle = Math.PI - kneeAngle;
    return { thighAngle, shinAngle };
  }

  const pedalCenterY = 0.22;
  const pedalCenterZ = -0.12;
  const leftPedalY = pedalCenterY + Math.sin(crankAngle) * CRANK_RADIUS;
  const leftPedalZ = pedalCenterZ + Math.cos(crankAngle) * CRANK_RADIUS;
  const rightPedalY = pedalCenterY + Math.sin(crankAngle + Math.PI) * CRANK_RADIUS;
  const rightPedalZ = pedalCenterZ + Math.cos(crankAngle + Math.PI) * CRANK_RADIUS;

  const leftIK = legIK(leftPedalY, leftPedalZ);
  const rightIK = legIK(rightPedalY, rightPedalZ);

  return (
    <group>
      {/* Left leg */}
      <group position={[-0.08, HIP_Y, HIP_Z]}>
        <group rotation={[leftIK.thighAngle, 0, 0]}>
          {/* Thigh */}
          <mesh position={[0, -THIGH_LEN / 2, 0]}>
            <capsuleGeometry args={[0.045, THIGH_LEN - 0.06, 16, 24]} />
            <meshStandardMaterial color="#1e3a5f" roughness={0.7} />
          </mesh>
          {/* Knee joint + shin */}
          <group position={[0, -THIGH_LEN, 0]} rotation={[leftIK.shinAngle, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.04, 24, 20]} />
              <meshStandardMaterial color="#1e3a5f" roughness={0.7} />
            </mesh>
            <mesh position={[0, -SHIN_LEN / 2, 0]}>
              <capsuleGeometry args={[0.038, SHIN_LEN - 0.06, 16, 24]} />
              <meshStandardMaterial color="#1e3a5f" roughness={0.7} />
            </mesh>
            {/* Shoe */}
            <mesh position={[0, -SHIN_LEN + 0.01, 0.03]} scale={[1.1, 0.5, 1.4]}>
              <sphereGeometry args={[0.04, 24, 20]} />
              <meshStandardMaterial color="#222" roughness={0.8} />
            </mesh>
          </group>
        </group>
      </group>
      {/* Right leg */}
      <group position={[0.08, HIP_Y, HIP_Z]}>
        <group rotation={[rightIK.thighAngle, 0, 0]}>
          <mesh position={[0, -THIGH_LEN / 2, 0]}>
            <capsuleGeometry args={[0.045, THIGH_LEN - 0.06, 16, 24]} />
            <meshStandardMaterial color="#1e3a5f" roughness={0.7} />
          </mesh>
          <group position={[0, -THIGH_LEN, 0]} rotation={[rightIK.shinAngle, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.04, 24, 20]} />
              <meshStandardMaterial color="#1e3a5f" roughness={0.7} />
            </mesh>
            <mesh position={[0, -SHIN_LEN / 2, 0]}>
              <capsuleGeometry args={[0.038, SHIN_LEN - 0.06, 16, 24]} />
              <meshStandardMaterial color="#1e3a5f" roughness={0.7} />
            </mesh>
            <mesh position={[0, -SHIN_LEN + 0.01, 0.03]} scale={[1.1, 0.5, 1.4]}>
              <sphereGeometry args={[0.04, 24, 20]} />
              <meshStandardMaterial color="#222" roughness={0.8} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

export default function BikeController({ bikePositionRef, onStageChange }) {
  const groupRef = useRef();
  const wheelRefs = useRef([]);
  const crankRef = useRef();
  const crankAngleRef = useRef(0);
  const [crankAngle, setCrankAngle] = useState(0);
  const keysRef = useRef({});
  const velocityRef = useRef(0);
  const headingRef = useRef(0);
  const { camera } = useThree();

  // Touch controls state
  const touchRef = useRef({ active: false, startX: 0, startY: 0, lastX: 0, lastY: 0, dx: 0, dy: 0 });

  const handleKeyDown = useCallback((e) => {
    keysRef.current[e.code] = true;
  }, []);

  const handleKeyUp = useCallback((e) => {
    keysRef.current[e.code] = false;
  }, []);

  const handleTouchStart = useCallback((e) => {
    const t = e.touches[0];
    touchRef.current = { active: true, startX: t.clientX, startY: t.clientY, lastX: t.clientX, lastY: t.clientY, dx: 0, dy: 0 };
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!touchRef.current.active) return;
    const t = e.touches[0];
    // Use relative delta from start for steering, but re-center after large drags
    // so the user can keep swiping without hitting screen edges
    const sensitivity = Math.min(window.innerWidth, window.innerHeight) * 0.07;
    let dx = (t.clientX - touchRef.current.startX) / sensitivity;
    let dy = (t.clientY - touchRef.current.startY) / sensitivity;
    // Re-anchor start when drag exceeds 60% of max to allow continuous swiping
    if (Math.abs(t.clientX - touchRef.current.startX) > sensitivity * 0.6) {
      touchRef.current.startX = t.clientX - Math.sign(dx) * sensitivity * 0.6;
      dx = Math.sign(dx) * 0.6;
    }
    if (Math.abs(t.clientY - touchRef.current.startY) > sensitivity * 0.6) {
      touchRef.current.startY = t.clientY - Math.sign(dy) * sensitivity * 0.6;
      dy = Math.sign(dy) * 0.6;
    }
    touchRef.current.dx = dx;
    touchRef.current.dy = dy;
    touchRef.current.lastX = t.clientX;
    touchRef.current.lastY = t.clientY;
  }, []);

  const handleTouchEnd = useCallback(() => {
    touchRef.current = { active: false, startX: 0, startY: 0, lastX: 0, lastY: 0, dx: 0, dy: 0 };
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

    // Animate cranks — pedaling rotation
    if (Math.abs(velocityRef.current) > 0.005) {
      crankAngleRef.current += velocityRef.current * 12;
    }
    if (crankRef.current) {
      crankRef.current.rotation.x = crankAngleRef.current;
    }
    setCrankAngle(crankAngleRef.current);

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
      <BikeModel wheelRefs={wheelRefs} crankRef={crankRef} />
      <RiderLegs crankAngle={crankAngle} />
    </group>
  );
}
