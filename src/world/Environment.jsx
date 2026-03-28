import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heightAt } from "./Terrain";

// Seeded RNG
function makeRng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ============================================================
//  PINE TREES — tall conifers with multiple canopy layers
// ============================================================
function PineTrees() {
  const trunkRef = useRef();
  const layer1Ref = useRef(); // bottom canopy
  const layer2Ref = useRef(); // mid canopy
  const layer3Ref = useRef(); // top canopy
  const count = 100;

  const positions = useMemo(() => {
    const rand = makeRng(42);
    const pos = [];
    for (let i = 0; i < count; i++) {
      const x = (rand() - 0.5) * 110;
      const z = (rand() - 0.5) * 110;
      const y = heightAt(x, z);
      if (y > 0.5 && y < 10) {
        const scale = 0.5 + rand() * 0.7;
        pos.push({ x, y, z, scale, ry: rand() * Math.PI * 2 });
      }
    }
    return pos;
  }, []);

  const trunkGeo = useMemo(() => new THREE.CylinderGeometry(0.08, 0.14, 2.0, 5), []);
  const cone1 = useMemo(() => new THREE.ConeGeometry(1.1, 1.6, 7), []);
  const cone2 = useMemo(() => new THREE.ConeGeometry(0.85, 1.3, 7), []);
  const cone3 = useMemo(() => new THREE.ConeGeometry(0.6, 1.0, 6), []);

  useMemo(() => {
    if (!trunkRef.current) return;
    const d = new THREE.Object3D();
    positions.forEach((p, i) => {
      const s = p.scale;
      // Trunk
      d.position.set(p.x, p.y + 1.0 * s, p.z);
      d.scale.set(s, s, s);
      d.rotation.set(0, p.ry, 0);
      d.updateMatrix();
      trunkRef.current.setMatrixAt(i, d.matrix);
      // Bottom canopy
      d.position.set(p.x, p.y + 1.5 * s, p.z);
      d.updateMatrix();
      layer1Ref.current.setMatrixAt(i, d.matrix);
      // Mid canopy
      d.position.set(p.x, p.y + 2.3 * s, p.z);
      d.updateMatrix();
      layer2Ref.current.setMatrixAt(i, d.matrix);
      // Top canopy
      d.position.set(p.x, p.y + 3.0 * s, p.z);
      d.updateMatrix();
      layer3Ref.current.setMatrixAt(i, d.matrix);
    });
    [trunkRef, layer1Ref, layer2Ref, layer3Ref].forEach((r) => {
      r.current.instanceMatrix.needsUpdate = true;
    });
  }, [positions]);

  const n = positions.length;
  return (
    <>
      <instancedMesh ref={trunkRef} args={[trunkGeo, null, n]} castShadow>
        <meshLambertMaterial color="#5C3A1E" />
      </instancedMesh>
      <instancedMesh ref={layer1Ref} args={[cone1, null, n]} castShadow>
        <meshLambertMaterial color="#1e5c1e" flatShading />
      </instancedMesh>
      <instancedMesh ref={layer2Ref} args={[cone2, null, n]} castShadow>
        <meshLambertMaterial color="#267326" flatShading />
      </instancedMesh>
      <instancedMesh ref={layer3Ref} args={[cone3, null, n]} castShadow>
        <meshLambertMaterial color="#2d8a2d" flatShading />
      </instancedMesh>
    </>
  );
}

// ============================================================
//  DECIDUOUS TREES — round canopy, thicker trunks
// ============================================================
function DeciduousTrees() {
  const trunkRef = useRef();
  const canopyRef = useRef();
  const count = 40;

  const positions = useMemo(() => {
    const rand = makeRng(88);
    const pos = [];
    for (let i = 0; i < count; i++) {
      const x = (rand() - 0.5) * 105;
      const z = (rand() - 0.5) * 105;
      const y = heightAt(x, z);
      if (y > -0.5 && y < 7) {
        const scale = 0.6 + rand() * 0.6;
        pos.push({ x, y, z, scale, ry: rand() * Math.PI * 2 });
      }
    }
    return pos;
  }, []);

  const trunkGeo = useMemo(() => new THREE.CylinderGeometry(0.1, 0.16, 1.8, 6), []);
  const canopyGeo = useMemo(() => new THREE.IcosahedronGeometry(1.3, 1), []);

  useMemo(() => {
    if (!trunkRef.current) return;
    const d = new THREE.Object3D();
    positions.forEach((p, i) => {
      d.position.set(p.x, p.y + 0.9 * p.scale, p.z);
      d.scale.set(p.scale, p.scale, p.scale);
      d.rotation.set(0, p.ry, 0);
      d.updateMatrix();
      trunkRef.current.setMatrixAt(i, d.matrix);
      d.position.set(p.x, p.y + 2.4 * p.scale, p.z);
      d.scale.set(p.scale * 0.9, p.scale * 0.8, p.scale * 0.9);
      d.updateMatrix();
      canopyRef.current.setMatrixAt(i, d.matrix);
    });
    trunkRef.current.instanceMatrix.needsUpdate = true;
    canopyRef.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  const n = positions.length;
  return (
    <>
      <instancedMesh ref={trunkRef} args={[trunkGeo, null, n]} castShadow>
        <meshLambertMaterial color="#7B5B3A" />
      </instancedMesh>
      <instancedMesh ref={canopyRef} args={[canopyGeo, null, n]} castShadow>
        <meshLambertMaterial color="#3a8a2a" flatShading />
      </instancedMesh>
    </>
  );
}

// ============================================================
//  BUSHES — small ground cover
// ============================================================
function Bushes() {
  const ref = useRef();
  const count = 60;

  const positions = useMemo(() => {
    const rand = makeRng(201);
    const pos = [];
    for (let i = 0; i < count; i++) {
      const x = (rand() - 0.5) * 100;
      const z = (rand() - 0.5) * 100;
      const y = heightAt(x, z);
      if (y > 0 && y < 6) {
        pos.push({ x, y, z, scale: 0.3 + rand() * 0.5 });
      }
    }
    return pos;
  }, []);

  const geo = useMemo(() => new THREE.IcosahedronGeometry(0.4, 1), []);

  useMemo(() => {
    if (!ref.current) return;
    const d = new THREE.Object3D();
    positions.forEach((p, i) => {
      d.position.set(p.x, p.y + 0.15 * p.scale, p.z);
      d.scale.set(p.scale, p.scale * 0.7, p.scale);
      d.updateMatrix();
      ref.current.setMatrixAt(i, d.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  return (
    <instancedMesh ref={ref} args={[geo, null, positions.length]}>
      <meshLambertMaterial color="#2a7a22" flatShading />
    </instancedMesh>
  );
}

// ============================================================
//  ROCKS — varied sizes and colors
// ============================================================
function Rocks() {
  const ref1 = useRef();
  const ref2 = useRef();

  const { bigRocks, smallRocks } = useMemo(() => {
    const rand = makeRng(123);
    const big = [];
    const small = [];
    for (let i = 0; i < 25; i++) {
      const x = (rand() - 0.5) * 105;
      const z = (rand() - 0.5) * 105;
      const y = heightAt(x, z);
      if (y > 0.5) {
        big.push({ x, y: y - 0.15, z, sx: 0.4 + rand() * 0.8, sy: 0.3 + rand() * 0.5, sz: 0.4 + rand() * 0.8, ry: rand() * Math.PI * 2 });
      }
    }
    for (let i = 0; i < 50; i++) {
      const x = (rand() - 0.5) * 110;
      const z = (rand() - 0.5) * 110;
      const y = heightAt(x, z);
      if (y > -0.5) {
        small.push({ x, y: y - 0.05, z, s: 0.1 + rand() * 0.25, ry: rand() * Math.PI * 2 });
      }
    }
    return { bigRocks: big, smallRocks: small };
  }, []);

  const bigGeo = useMemo(() => new THREE.DodecahedronGeometry(0.5, 0), []);
  const smallGeo = useMemo(() => new THREE.OctahedronGeometry(0.3, 0), []);

  useMemo(() => {
    if (!ref1.current || !ref2.current) return;
    const d = new THREE.Object3D();
    bigRocks.forEach((p, i) => {
      d.position.set(p.x, p.y, p.z);
      d.scale.set(p.sx, p.sy, p.sz);
      d.rotation.set(0, p.ry, 0);
      d.updateMatrix();
      ref1.current.setMatrixAt(i, d.matrix);
    });
    smallRocks.forEach((p, i) => {
      d.position.set(p.x, p.y, p.z);
      d.scale.setScalar(p.s);
      d.rotation.set(0, p.ry, 0);
      d.updateMatrix();
      ref2.current.setMatrixAt(i, d.matrix);
    });
    ref1.current.instanceMatrix.needsUpdate = true;
    ref2.current.instanceMatrix.needsUpdate = true;
  }, [bigRocks, smallRocks]);

  return (
    <>
      <instancedMesh ref={ref1} args={[bigGeo, null, bigRocks.length]} castShadow>
        <meshLambertMaterial color="#6e6e6e" flatShading />
      </instancedMesh>
      <instancedMesh ref={ref2} args={[smallGeo, null, smallRocks.length]}>
        <meshLambertMaterial color="#8a8a82" flatShading />
      </instancedMesh>
    </>
  );
}

// ============================================================
//  GRASS PATCHES — instanced thin blades
// ============================================================
function GrassPatches() {
  const ref = useRef();
  const count = 300;

  const positions = useMemo(() => {
    const rand = makeRng(777);
    const pos = [];
    for (let i = 0; i < count; i++) {
      const x = (rand() - 0.5) * 100;
      const z = (rand() - 0.5) * 100;
      const y = heightAt(x, z);
      if (y > 0 && y < 6) {
        pos.push({ x, y, z, ry: rand() * Math.PI, h: 0.15 + rand() * 0.25 });
      }
    }
    return pos;
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.08, 0.4);
    g.translate(0, 0.2, 0);
    return g;
  }, []);

  useMemo(() => {
    if (!ref.current) return;
    const d = new THREE.Object3D();
    positions.forEach((p, i) => {
      d.position.set(p.x, p.y, p.z);
      d.scale.set(1, p.h / 0.2, 1);
      d.rotation.set(0, p.ry, 0);
      d.updateMatrix();
      ref.current.setMatrixAt(i, d.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  return (
    <instancedMesh ref={ref} args={[geo, null, positions.length]}>
      <meshLambertMaterial color="#4a8a35" side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

// ============================================================
//  WILDFLOWERS — small colored dots scattered on grass
// ============================================================
function Wildflowers() {
  const ref = useRef();
  const count = 120;
  const colors = ["#e74c3c", "#f1c40f", "#9b59b6", "#e67e22", "#fff"];

  const { positions, colorArray } = useMemo(() => {
    const rand = makeRng(555);
    const pos = [];
    const cols = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (rand() - 0.5) * 90;
      const z = (rand() - 0.5) * 90;
      const y = heightAt(x, z);
      if (y > 0.5 && y < 5) {
        pos.push({ x, y: y + 0.08, z });
        const c = new THREE.Color(colors[Math.floor(rand() * colors.length)]);
        cols[i * 3] = c.r;
        cols[i * 3 + 1] = c.g;
        cols[i * 3 + 2] = c.b;
      }
    }
    return { positions: pos, colorArray: cols };
  }, []);

  const geo = useMemo(() => new THREE.SphereGeometry(0.04, 4, 3), []);

  useMemo(() => {
    if (!ref.current) return;
    const d = new THREE.Object3D();
    positions.forEach((p, i) => {
      d.position.set(p.x, p.y, p.z);
      d.updateMatrix();
      ref.current.setMatrixAt(i, d.matrix);
      ref.current.setColorAt(i, new THREE.Color(colorArray[i * 3], colorArray[i * 3 + 1], colorArray[i * 3 + 2]));
    });
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.instanceColor.needsUpdate = true;
  }, [positions]);

  return (
    <instancedMesh ref={ref} args={[geo, null, positions.length]}>
      <meshBasicMaterial />
    </instancedMesh>
  );
}

// ============================================================
//  WATER — blue lake positioned at the lake stop depression
// ============================================================
function Water() {
  const shimmerRef = useRef();
  const rippleRef = useRef();

  // Lake center at (25, -15). The heightAt depression bottoms at ~-3.5 there.
  // Water surface sits at y = -0.8 so it fills the depression visibly.
  const lakeX = 25;
  const lakeZ = -15;
  const waterY = -0.8;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (shimmerRef.current) {
      shimmerRef.current.material.opacity = 0.12 + Math.sin(t * 1.2) * 0.05;
    }
    if (rippleRef.current) {
      rippleRef.current.scale.x = 1 + Math.sin(t * 0.5) * 0.015;
      rippleRef.current.scale.z = 1 + Math.cos(t * 0.4) * 0.015;
    }
  });

  return (
    <group>
      {/* Deep water — main lake body */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[lakeX, waterY - 0.05, lakeZ]}>
        <circleGeometry args={[14, 48]} />
        <meshPhongMaterial color="#1a5276" transparent opacity={0.92} shininess={80} />
      </mesh>

      {/* Mid-depth ring — lighter blue */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[lakeX, waterY, lakeZ]}>
        <circleGeometry args={[14, 48]} />
        <meshPhongMaterial color="#2980b9" transparent opacity={0.7} shininess={60} />
      </mesh>

      {/* Shallow shore — turquoise ring */}
      <mesh ref={rippleRef} rotation={[-Math.PI / 2, 0, 0]} position={[lakeX, waterY + 0.02, lakeZ]}>
        <ringGeometry args={[11, 15, 48]} />
        <meshLambertMaterial color="#5dade2" transparent opacity={0.5} />
      </mesh>

      {/* Sandy shoreline ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[lakeX, waterY + 0.03, lakeZ]}>
        <ringGeometry args={[14.5, 16.5, 48]} />
        <meshLambertMaterial color="#d4c17a" transparent opacity={0.45} />
      </mesh>

      {/* Surface shimmer / reflection */}
      <mesh ref={shimmerRef} rotation={[-Math.PI / 2, 0, 0]} position={[lakeX, waterY + 0.06, lakeZ]}>
        <circleGeometry args={[13, 40]} />
        <meshBasicMaterial color="#aed6f1" transparent opacity={0.12} />
      </mesh>

      {/* A few small rocks on the shore */}
      {[
        [lakeX - 13, lakeZ + 5, 0.4],
        [lakeX + 10, lakeZ - 10, 0.35],
        [lakeX - 8, lakeZ - 13, 0.3],
        [lakeX + 14, lakeZ + 2, 0.25],
        [lakeX - 5, lakeZ + 14, 0.32],
      ].map(([rx, rz, rs], i) => (
        <mesh key={`shore-rock${i}`} position={[rx, heightAt(rx, rz) + rs * 0.3, rz]}>
          <dodecahedronGeometry args={[rs, 0]} />
          <meshLambertMaterial color={i % 2 === 0 ? "#7f8c8d" : "#95a5a6"} flatShading />
        </mesh>
      ))}

      {/* Reeds / cattails around shore edges */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 14.5 + Math.sin(i * 3.7) * 1.5;
        const rx = lakeX + Math.cos(angle) * r;
        const rz = lakeZ + Math.sin(angle) * r;
        const ry = heightAt(rx, rz);
        return (
          <group key={`reed${i}`} position={[rx, ry, rz]}>
            <mesh position={[0, 0.7, 0]}>
              <cylinderGeometry args={[0.015, 0.02, 1.4, 4]} />
              <meshLambertMaterial color="#5a7a3a" />
            </mesh>
            <mesh position={[0, 1.5, 0]}>
              <cylinderGeometry args={[0.04, 0.02, 0.25, 5]} />
              <meshLambertMaterial color="#6b4226" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ============================================================
//  FLOATING CLOUDS
// ============================================================
function Clouds() {
  const groupRef = useRef();

  const clouds = useMemo(() => {
    const rand = makeRng(333);
    return Array.from({ length: 8 }, () => ({
      x: (rand() - 0.5) * 120,
      y: 22 + rand() * 10,
      z: (rand() - 0.5) * 120,
      sx: 3 + rand() * 5,
      sy: 1 + rand() * 1.5,
      sz: 2 + rand() * 3,
      speed: 0.3 + rand() * 0.5,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((cloud, i) => {
      cloud.position.x = clouds[i].x + Math.sin(clock.elapsedTime * 0.05 * clouds[i].speed) * 8;
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, c.z]} scale={[c.sx, c.sy, c.sz]}>
          <sphereGeometry args={[1, 7, 5]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================
//  CAMPFIRE — detailed with ring of stones, embers, smoke particles
// ============================================================
function Campfire({ position }) {
  const flame1 = useRef();
  const flame2 = useRef();
  const flame3 = useRef();
  const embersRef = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (flame1.current) {
      flame1.current.scale.y = 0.8 + Math.sin(t * 6) * 0.35;
      flame1.current.scale.x = 0.9 + Math.sin(t * 7) * 0.1;
      flame1.current.position.y = position[1] + 0.55 + Math.sin(t * 5) * 0.08;
    }
    if (flame2.current) {
      flame2.current.scale.y = 0.7 + Math.cos(t * 7) * 0.25;
      flame2.current.position.y = position[1] + 0.5 + Math.cos(t * 6) * 0.06;
    }
    if (flame3.current) {
      flame3.current.scale.y = 0.5 + Math.sin(t * 8 + 1) * 0.2;
      flame3.current.position.y = position[1] + 0.45 + Math.sin(t * 7) * 0.05;
    }
    // Embers floating up
    embersRef.current.forEach((e, i) => {
      if (e) {
        const phase = i * 1.5;
        const cycle = ((t * 0.8 + phase) % 3) / 3;
        e.position.y = position[1] + 0.6 + cycle * 2.5;
        e.position.x = position[0] + Math.sin(t * 2 + phase) * 0.3 * cycle;
        e.position.z = position[2] + Math.cos(t * 1.5 + phase) * 0.2 * cycle;
        e.scale.setScalar(0.02 * (1 - cycle));
      }
    });
  });

  const px = position[0];
  const py = position[1];
  const pz = position[2];

  return (
    <group>
      {/* Stone ring */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={`stone${i}`} position={[px + Math.cos(angle) * 0.45, py + 0.06, pz + Math.sin(angle) * 0.45]}>
            <dodecahedronGeometry args={[0.09, 0]} />
            <meshLambertMaterial color={i % 2 === 0 ? "#666" : "#777"} flatShading />
          </mesh>
        );
      })}
      {/* Logs — crossed */}
      <mesh position={[px - 0.15, py + 0.1, pz]} rotation={[0, 0.4, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.07, 0.7, 6]} />
        <meshLambertMaterial color="#4a2a0a" />
      </mesh>
      <mesh position={[px + 0.15, py + 0.1, pz]} rotation={[0, -0.4, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.07, 0.7, 6]} />
        <meshLambertMaterial color="#3d220a" />
      </mesh>
      <mesh position={[px, py + 0.15, pz + 0.1]} rotation={[Math.PI / 2, 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.5, 6]} />
        <meshLambertMaterial color="#5a3515" />
      </mesh>
      {/* Charcoal base */}
      <mesh position={[px, py + 0.03, pz]}>
        <cylinderGeometry args={[0.3, 0.35, 0.06, 8]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
      {/* Flames */}
      <mesh ref={flame1} position={[px, py + 0.55, pz]}>
        <coneGeometry args={[0.18, 0.55, 5]} />
        <meshBasicMaterial color="#ff5500" transparent opacity={0.9} />
      </mesh>
      <mesh ref={flame2} position={[px + 0.08, py + 0.5, pz + 0.05]}>
        <coneGeometry args={[0.11, 0.4, 5]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0.85} />
      </mesh>
      <mesh ref={flame3} position={[px - 0.06, py + 0.45, pz - 0.04]}>
        <coneGeometry args={[0.08, 0.3, 4]} />
        <meshBasicMaterial color="#ffcc00" transparent opacity={0.8} />
      </mesh>
      {/* Embers */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={`ember${i}`} ref={(el) => (embersRef.current[i] = el)} position={[px, py + 0.6, pz]}>
          <sphereGeometry args={[0.02, 3, 3]} />
          <meshBasicMaterial color="#ff4400" />
        </mesh>
      ))}
      {/* Warm glow */}
      <pointLight position={[px, py + 0.8, pz]} color="#ff6600" intensity={4} distance={10} />
      <pointLight position={[px, py + 0.3, pz]} color="#ff3300" intensity={2} distance={4} />
    </group>
  );
}

// ============================================================
//  TENT — detailed with guy ropes, door, ground sheet
// ============================================================
function Tent({ position }) {
  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1, 0);
    shape.lineTo(0, 1.3);
    shape.lineTo(1, 0);
    shape.lineTo(-1, 0);
    return new THREE.ExtrudeGeometry(shape, { depth: 1.6, bevelEnabled: false });
  }, []);

  return (
    <group position={position} rotation={[0, 0.5, 0]}>
      {/* Ground sheet */}
      <mesh position={[0, 0.01, 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 2]} />
        <meshLambertMaterial color="#555" />
      </mesh>
      {/* Main tent */}
      <mesh geometry={geo} castShadow>
        <meshLambertMaterial color="#c75b2a" flatShading />
      </mesh>
      {/* Door flap */}
      <mesh position={[0, 0.45, -0.02]} rotation={[0.1, 0, 0]}>
        <planeGeometry args={[0.6, 0.9]} />
        <meshLambertMaterial color="#a84820" side={THREE.DoubleSide} />
      </mesh>
      {/* Ridge pole visible at top */}
      <mesh position={[0, 1.25, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.7, 4]} />
        <meshLambertMaterial color="#888" />
      </mesh>
      {/* Guy ropes */}
      {[[-1.3, 0.02, -0.2], [1.3, 0.02, -0.2], [-1.3, 0.02, 1.8], [1.3, 0.02, 1.8]].map((gp, i) => (
        <mesh key={i} position={gp}>
          <cylinderGeometry args={[0.008, 0.008, 0.06, 3]} />
          <meshLambertMaterial color="#aaa" />
        </mesh>
      ))}
      {/* Sleeping bag visible at door */}
      <mesh position={[0.15, 0.1, 0.5]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.12, 0.1, 0.5, 6]} rotation={[Math.PI / 2, 0, 0]} />
        <meshLambertMaterial color="#3498db" />
      </mesh>
    </group>
  );
}

// ============================================================
//  CLIMBING WALL — natural rock face with cracks and varied holds
// ============================================================
function ClimbingWall({ position }) {
  // Hold types: jugs (large, rounded), crimps (flat), slopers (wide dome), pinches (thin)
  const holds = [
    // Route 1 — left (beginner, green)
    { pos: [-1.8, -4.2, 1.12], color: "#27ae60", s: 0.22, type: "jug" },
    { pos: [-1.5, -3.0, 1.12], color: "#27ae60", s: 0.2, type: "jug" },
    { pos: [-2.0, -1.8, 1.12], color: "#27ae60", s: 0.24, type: "jug" },
    { pos: [-1.3, -0.5, 1.12], color: "#27ae60", s: 0.2, type: "jug" },
    { pos: [-1.7, 0.8, 1.12], color: "#27ae60", s: 0.22, type: "jug" },
    { pos: [-1.2, 2.0, 1.12], color: "#27ae60", s: 0.2, type: "jug" },
    { pos: [-1.6, 3.2, 1.12], color: "#27ae60", s: 0.22, type: "jug" },
    { pos: [-1.3, 4.2, 1.12], color: "#27ae60", s: 0.2, type: "jug" },
    // Route 2 — center (intermediate, blue)
    { pos: [0.0, -4.0, 1.12], color: "#2980b9", s: 0.18, type: "crimp" },
    { pos: [0.3, -2.8, 1.12], color: "#2980b9", s: 0.16, type: "crimp" },
    { pos: [-0.2, -1.5, 1.12], color: "#2980b9", s: 0.2, type: "sloper" },
    { pos: [0.5, -0.2, 1.12], color: "#2980b9", s: 0.17, type: "crimp" },
    { pos: [-0.1, 1.2, 1.12], color: "#2980b9", s: 0.19, type: "sloper" },
    { pos: [0.4, 2.5, 1.12], color: "#2980b9", s: 0.16, type: "crimp" },
    { pos: [0.0, 3.8, 1.12], color: "#2980b9", s: 0.18, type: "crimp" },
    // Route 3 — right (advanced, red)
    { pos: [1.5, -4.3, 1.12], color: "#c0392b", s: 0.15, type: "crimp" },
    { pos: [1.8, -3.0, 1.12], color: "#c0392b", s: 0.13, type: "pinch" },
    { pos: [1.2, -1.6, 1.12], color: "#c0392b", s: 0.17, type: "sloper" },
    { pos: [2.0, -0.3, 1.12], color: "#c0392b", s: 0.12, type: "pinch" },
    { pos: [1.4, 1.0, 1.12], color: "#c0392b", s: 0.14, type: "crimp" },
    { pos: [1.9, 2.3, 1.12], color: "#c0392b", s: 0.13, type: "pinch" },
    { pos: [1.5, 3.5, 1.12], color: "#c0392b", s: 0.15, type: "crimp" },
    { pos: [1.7, 4.5, 1.12], color: "#c0392b", s: 0.12, type: "pinch" },
    // Extra scattered holds (yellow, purple, orange)
    { pos: [-0.6, -3.5, 1.12], color: "#f1c40f", s: 0.16, type: "jug" },
    { pos: [0.8, 0.5, 1.12], color: "#8e44ad", s: 0.18, type: "sloper" },
    { pos: [-0.9, 1.8, 1.12], color: "#e67e22", s: 0.15, type: "jug" },
    { pos: [0.6, 3.0, 1.12], color: "#f1c40f", s: 0.14, type: "crimp" },
  ];

  return (
    <group position={position}>
      {/* Rock face — main wall slab with slight lean-back */}
      <group rotation={[0.06, 0, 0]}>
        {/* Core wall */}
        <mesh castShadow>
          <boxGeometry args={[7, 11, 2.2]} />
          <meshLambertMaterial color="#5a5652" flatShading />
        </mesh>

        {/* Rock face surface layer — slightly lighter for depth */}
        <mesh position={[0, 0, 1.02]}>
          <boxGeometry args={[6.8, 10.8, 0.2]} />
          <meshLambertMaterial color="#6b6560" flatShading />
        </mesh>

        {/* Natural rock texture — large boulder-like bumps */}
        {[
          [-2.0, 3.5, 1.1, 0.65], [2.3, -2.0, 1.1, 0.55], [-1.0, -3.5, 1.08, 0.5],
          [1.5, 4.0, 1.1, 0.6], [-2.5, -0.5, 1.1, 0.7], [0.8, -4.5, 1.08, 0.45],
          [-0.3, 1.0, 1.1, 0.4], [2.5, 1.5, 1.08, 0.5], [-1.8, -2.2, 1.1, 0.55],
          [0.5, 4.8, 1.08, 0.35], [-2.8, 2.5, 1.1, 0.45], [1.0, -1.0, 1.1, 0.38],
        ].map(([bx, by, bz, bs], i) => (
          <mesh key={`bump${i}`} position={[bx, by, bz]}>
            <dodecahedronGeometry args={[bs, 0]} />
            <meshLambertMaterial
              color={i % 3 === 0 ? "#5e5a55" : i % 3 === 1 ? "#706b65" : "#7a756f"}
              flatShading
            />
          </mesh>
        ))}

        {/* Crack lines — vertical and diagonal */}
        <mesh position={[0.6, 0, 1.03]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.04, 9, 0.06]} />
          <meshLambertMaterial color="#3a3836" />
        </mesh>
        <mesh position={[-1.5, -1.5, 1.03]} rotation={[0, 0, -0.25]}>
          <boxGeometry args={[0.03, 5, 0.05]} />
          <meshLambertMaterial color="#3a3836" />
        </mesh>
        <mesh position={[2.0, 2.0, 1.03]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.035, 4, 0.05]} />
          <meshLambertMaterial color="#3a3836" />
        </mesh>

        {/* Climbing holds with varied shapes */}
        {holds.map((h, i) => {
          if (h.type === "jug") {
            return (
              <mesh key={`hold${i}`} position={h.pos} castShadow>
                <sphereGeometry args={[h.s, 8, 6]} />
                <meshPhongMaterial color={h.color} shininess={40} flatShading />
              </mesh>
            );
          }
          if (h.type === "crimp") {
            return (
              <mesh key={`hold${i}`} position={h.pos} castShadow rotation={[0, 0, Math.sin(i) * 0.3]}>
                <boxGeometry args={[h.s * 2.5, h.s * 0.8, h.s * 1.2]} />
                <meshPhongMaterial color={h.color} shininess={40} flatShading />
              </mesh>
            );
          }
          if (h.type === "sloper") {
            return (
              <mesh key={`hold${i}`} position={h.pos} castShadow>
                <sphereGeometry args={[h.s * 1.3, 8, 5]} />
                <meshPhongMaterial color={h.color} shininess={30} flatShading />
              </mesh>
            );
          }
          // pinch
          return (
            <mesh key={`hold${i}`} position={h.pos} castShadow rotation={[0, 0, Math.cos(i) * 0.4]}>
              <boxGeometry args={[h.s * 0.8, h.s * 2, h.s * 1.2]} />
              <meshPhongMaterial color={h.color} shininess={40} flatShading />
            </mesh>
          );
        })}

        {/* Chalk marks near holds */}
        {[
          [-1.6, -0.3, 1.04], [0.2, -1.3, 1.04], [1.6, 1.2, 1.04],
          [-0.5, 2.2, 1.04], [0.9, -3.2, 1.04], [-1.8, 3.0, 1.04],
        ].map((p, i) => (
          <mesh key={`chalk${i}`} position={p} rotation={[0, 0, Math.sin(i * 2) * 0.5]}>
            <planeGeometry args={[0.35 + (i % 3) * 0.1, 0.25 + (i % 2) * 0.08]} />
            <meshBasicMaterial color="#f0ece8" transparent opacity={0.25 + (i % 3) * 0.05} />
          </mesh>
        ))}

        {/* Route number tags at bottom */}
        {[
          { x: -1.6, color: "#27ae60", label: "5a" },
          { x: 0.0, color: "#2980b9", label: "6b" },
          { x: 1.6, color: "#c0392b", label: "7c" },
        ].map((rt, i) => (
          <group key={`tag${i}`} position={[rt.x, -5.1, 1.05]}>
            <mesh>
              <planeGeometry args={[0.6, 0.35]} />
              <meshBasicMaterial color={rt.color} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Base — concrete/rubber pad */}
      <mesh position={[0, -5.6, 0.3]}>
        <boxGeometry args={[8, 0.4, 3.5]} />
        <meshLambertMaterial color="#2c3e50" />
      </mesh>

      {/* Safety mat below */}
      <mesh position={[0, -5.3, 1.5]}>
        <boxGeometry args={[7, 0.25, 2.5]} />
        <meshLambertMaterial color="#1a5276" />
      </mesh>

      {/* Chalk bag hanging on a hook at side */}
      <group position={[3.8, -2, 1.2]}>
        {/* Hook */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 4]} />
          <meshLambertMaterial color="#7f8c8d" />
        </mesh>
        {/* Bag */}
        <mesh>
          <cylinderGeometry args={[0.15, 0.12, 0.35, 8]} />
          <meshLambertMaterial color="#ecf0f1" />
        </mesh>
      </group>

      {/* A carabiner and quickdraw at the top */}
      <group position={[0, 4.8, 1.3]}>
        <mesh>
          <torusGeometry args={[0.08, 0.02, 6, 12]} />
          <meshPhongMaterial color="#bdc3c7" shininess={80} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.04, 0.3, 0.02]} />
          <meshLambertMaterial color="#2980b9" />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <torusGeometry args={[0.06, 0.015, 6, 12]} />
          <meshPhongMaterial color="#bdc3c7" shininess={80} />
        </mesh>
      </group>

      {/* Rope coiled at the base */}
      <group position={[3, -5.2, 2]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.35, 0.05, 6, 24]} />
          <meshLambertMaterial color="#e67e22" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0.3]} position={[0, 0.06, 0]}>
          <torusGeometry args={[0.3, 0.05, 6, 24]} />
          <meshLambertMaterial color="#e67e22" />
        </mesh>
      </group>
    </group>
  );
}

// ============================================================
//  PRAYER FLAGS — more flags, rope sag
// ============================================================
function PrayerFlags({ position }) {
  const flagsRef = useRef([]);

  useFrame(({ clock }) => {
    flagsRef.current.forEach((flag, i) => {
      if (flag) {
        flag.rotation.z = Math.sin(clock.elapsedTime * 2.5 + i * 0.8) * 0.18;
        flag.rotation.x = Math.sin(clock.elapsedTime * 1.5 + i * 1.2) * 0.05;
      }
    });
  });

  const colors = ["#e74c3c", "#f39c12", "#f5f5f5", "#2ecc71", "#3498db", "#9b59b6", "#e74c3c", "#f39c12"];

  return (
    <group position={position}>
      {/* Poles */}
      <mesh position={[-3, 1.8, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 3.6, 5]} />
        <meshLambertMaterial color="#7B5B3A" />
      </mesh>
      <mesh position={[3, 1.8, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 3.6, 5]} />
        <meshLambertMaterial color="#7B5B3A" />
      </mesh>
      {/* Rope */}
      <mesh position={[0, 3.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 6, 4]} />
        <meshLambertMaterial color="#8B7355" />
      </mesh>
      {/* Flags */}
      {colors.map((color, i) => (
        <mesh
          key={i}
          ref={(el) => (flagsRef.current[i] = el)}
          position={[-2.6 + i * 0.75, 2.9, 0]}
        >
          <planeGeometry args={[0.55, 0.7]} />
          <meshLambertMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.85} />
        </mesh>
      ))}
      {/* Summit cairn (stacked stones) */}
      <mesh position={[0, 0.15, 1]}>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshLambertMaterial color="#777" flatShading />
      </mesh>
      <mesh position={[0, 0.45, 1]}>
        <dodecahedronGeometry args={[0.22, 0]} />
        <meshLambertMaterial color="#888" flatShading />
      </mesh>
      <mesh position={[0, 0.68, 1]}>
        <dodecahedronGeometry args={[0.15, 0]} />
        <meshLambertMaterial color="#999" flatShading />
      </mesh>
    </group>
  );
}

// ============================================================
//  HUSKY — keep existing detailed model (unchanged from linter)
// ============================================================
function Husky({ bikePosition }) {
  const groupRef = useRef();
  const targetPos = useRef(new THREE.Vector3());
  const legRefs = useRef([]);
  const tailRef = useRef();
  const tongueRef = useRef();
  const earRefs = useRef([]);

  useFrame(({ clock }) => {
    if (!groupRef.current || !bikePosition.current) return;
    const bPos = bikePosition.current;
    targetPos.current.set(bPos.x - 1.5, bPos.y, bPos.z + 1.5);
    groupRef.current.position.lerp(targetPos.current, 0.03);
    const dx = targetPos.current.x - groupRef.current.position.x;
    const dz = targetPos.current.z - groupRef.current.position.z;
    if (Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01) {
      groupRef.current.rotation.y = Math.atan2(dx, dz);
    }
    const dist = groupRef.current.position.distanceTo(targetPos.current);
    const isRunning = dist > 0.5;
    const speed = isRunning ? 10 : 0;
    const t = clock.elapsedTime;
    legRefs.current.forEach((leg, i) => {
      if (leg) {
        if (isRunning) {
          const phase = i < 2 ? 0 : Math.PI;
          const side = i % 2 === 0 ? 0 : Math.PI * 0.3;
          leg.rotation.x = Math.sin(t * speed + phase + side) * 0.5;
        } else {
          leg.rotation.x += (0 - leg.rotation.x) * 0.1;
        }
      }
    });
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * (isRunning ? 8 : 4)) * 0.35;
    }
    if (tongueRef.current) {
      tongueRef.current.scale.y = 0.8 + Math.sin(t * 4) * 0.2;
      tongueRef.current.position.y = 0.56 - Math.sin(t * 4) * 0.01;
    }
    earRefs.current.forEach((ear, i) => {
      if (ear) {
        const perk = isRunning ? 0 : Math.sin(t * 1.5 + i * 2) * 0.1;
        ear.rotation.z = (i === 0 ? 0.1 : -0.1) + perk;
      }
    });
    const gy = heightAt(groupRef.current.position.x, groupRef.current.position.z);
    groupRef.current.position.y = gy;
  });

  return (
    <group ref={groupRef} position={[0, 0, 2]}>
      {/* Body — main torso */}
      <mesh position={[0, 0.55, 0.02]} scale={[0.8, 0.75, 1.4]}>
        <sphereGeometry args={[0.26, 32, 24]} />
        <meshStandardMaterial color="#6b6b6b" roughness={0.85} />
      </mesh>
      {/* Belly (white underside) */}
      <mesh position={[0, 0.44, 0.02]} scale={[0.7, 0.45, 1.3]}>
        <sphereGeometry args={[0.24, 32, 24]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
      </mesh>
      {/* Chest (white front) */}
      <mesh position={[0, 0.52, 0.32]} scale={[0.85, 0.9, 0.7]}>
        <sphereGeometry args={[0.17, 32, 24]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
      </mesh>
      {/* Shoulder muscles */}
      <mesh position={[-0.1, 0.62, 0.18]} scale={[0.7, 0.8, 0.9]}>
        <sphereGeometry args={[0.1, 28, 20]} />
        <meshStandardMaterial color="#5e5e5e" roughness={0.85} />
      </mesh>
      <mesh position={[0.1, 0.62, 0.18]} scale={[0.7, 0.8, 0.9]}>
        <sphereGeometry args={[0.1, 28, 20]} />
        <meshStandardMaterial color="#5e5e5e" roughness={0.85} />
      </mesh>
      {/* Haunches */}
      <mesh position={[0, 0.58, -0.28]} scale={[0.85, 0.8, 0.9]}>
        <sphereGeometry args={[0.18, 32, 24]} />
        <meshStandardMaterial color="#6b6b6b" roughness={0.85} />
      </mesh>
      {/* Back ridge (darker fur) */}
      <mesh position={[0, 0.68, -0.05]} scale={[0.6, 0.3, 1.2]}>
        <sphereGeometry args={[0.22, 28, 20]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.72, 0.48]} scale={[1, 0.9, 0.95]}>
        <sphereGeometry args={[0.16, 32, 24]} />
        <meshStandardMaterial color="#5e5e5e" roughness={0.85} />
      </mesh>
      {/* Cheek fur tufts */}
      <mesh position={[-0.08, 0.68, 0.52]} scale={[0.7, 0.6, 0.5]}>
        <sphereGeometry args={[0.08, 24, 20]} />
        <meshStandardMaterial color="#777" roughness={0.9} />
      </mesh>
      <mesh position={[0.08, 0.68, 0.52]} scale={[0.7, 0.6, 0.5]}>
        <sphereGeometry args={[0.08, 24, 20]} />
        <meshStandardMaterial color="#777" roughness={0.9} />
      </mesh>
      {/* White face mask */}
      <mesh position={[0, 0.68, 0.63]}>
        <sphereGeometry args={[0.09, 28, 24]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
      </mesh>
      {/* Forehead mark */}
      <mesh position={[0, 0.79, 0.58]} scale={[0.5, 0.6, 0.3]}>
        <sphereGeometry args={[0.06, 24, 20]} />
        <meshStandardMaterial color="#eee" roughness={0.9} />
      </mesh>
      {/* Muzzle / snout */}
      <mesh position={[0, 0.65, 0.68]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.8]}>
        <cylinderGeometry args={[0.055, 0.075, 0.16, 32]} />
        <meshStandardMaterial color="#e8e0d8" roughness={0.8} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.67, 0.77]}>
        <sphereGeometry args={[0.033, 24, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Mouth line */}
      <mesh position={[0, 0.61, 0.72]}>
        <boxGeometry args={[0.05, 0.006, 0.04]} />
        <meshStandardMaterial color="#333" roughness={0.7} />
      </mesh>
      {/* Tongue */}
      <mesh ref={tongueRef} position={[0.02, 0.58, 0.72]} scale={[1, 1, 1.2]}>
        <sphereGeometry args={[0.028, 20, 16]} />
        <meshStandardMaterial color="#e57373" roughness={0.6} />
      </mesh>

      {/* Eyes — outer socket */}
      <mesh position={[-0.07, 0.74, 0.61]}>
        <sphereGeometry args={[0.034, 24, 20]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
      </mesh>
      <mesh position={[0.07, 0.74, 0.61]}>
        <sphereGeometry args={[0.034, 24, 20]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
      </mesh>
      {/* Sclera (white) */}
      <mesh position={[-0.07, 0.74, 0.64]}>
        <sphereGeometry args={[0.024, 24, 20]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
      <mesh position={[0.07, 0.74, 0.64]}>
        <sphereGeometry args={[0.024, 24, 20]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
      {/* Iris (blue) */}
      <mesh position={[-0.07, 0.74, 0.655]}>
        <sphereGeometry args={[0.017, 24, 20]} />
        <meshStandardMaterial color="#4fc3f7" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0.07, 0.74, 0.655]}>
        <sphereGeometry args={[0.017, 24, 20]} />
        <meshStandardMaterial color="#4fc3f7" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Pupil */}
      <mesh position={[-0.07, 0.74, 0.665]}>
        <sphereGeometry args={[0.009, 16, 12]} />
        <meshBasicMaterial color="#111" />
      </mesh>
      <mesh position={[0.07, 0.74, 0.665]}>
        <sphereGeometry args={[0.009, 16, 12]} />
        <meshBasicMaterial color="#111" />
      </mesh>
      {/* Eye highlight */}
      <mesh position={[-0.065, 0.745, 0.668]}>
        <sphereGeometry args={[0.004, 12, 10]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
      <mesh position={[0.075, 0.745, 0.668]}>
        <sphereGeometry args={[0.004, 12, 10]} />
        <meshBasicMaterial color="#fff" />
      </mesh>

      {/* Ears */}
      <mesh ref={(el) => (earRefs.current[0] = el)} position={[-0.1, 0.9, 0.46]} rotation={[0.15, 0, 0.1]}>
        <coneGeometry args={[0.055, 0.15, 24]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.85} />
      </mesh>
      <mesh position={[-0.1, 0.89, 0.47]} rotation={[0.15, 0, 0.1]}>
        <coneGeometry args={[0.028, 0.09, 20]} />
        <meshStandardMaterial color="#e8a0a0" roughness={0.7} />
      </mesh>
      <mesh ref={(el) => (earRefs.current[1] = el)} position={[0.1, 0.9, 0.46]} rotation={[0.15, 0, -0.1]}>
        <coneGeometry args={[0.055, 0.15, 24]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.85} />
      </mesh>
      <mesh position={[0.1, 0.89, 0.47]} rotation={[0.15, 0, -0.1]}>
        <coneGeometry args={[0.028, 0.09, 20]} />
        <meshStandardMaterial color="#e8a0a0" roughness={0.7} />
      </mesh>

      {/* Collar */}
      <mesh position={[0, 0.62, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.016, 20, 40]} />
        <meshStandardMaterial color="#e74c3c" roughness={0.5} />
      </mesh>
      {/* Tag */}
      <mesh position={[0, 0.52, 0.42]}>
        <sphereGeometry args={[0.018, 16, 12]} />
        <meshStandardMaterial color="#ffd700" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Legs */}
      {[[0, -0.12, 0.2], [1, 0.12, 0.2], [2, -0.12, -0.2], [3, 0.12, -0.2]].map(([idx, lx, lz]) => (
        <group key={idx} ref={(el) => (legRefs.current[idx] = el)} position={[lx, 0.38, lz]}>
          {/* Shoulder/hip joint */}
          <mesh position={[0, 0.06, 0]}>
            <sphereGeometry args={[idx < 2 ? 0.058 : 0.063, 24, 20]} />
            <meshStandardMaterial color={idx < 2 ? "#6b6b6b" : "#636363"} roughness={0.85} />
          </mesh>
          {/* Upper leg */}
          <mesh position={[0, -0.02, 0]}>
            <capsuleGeometry args={[0.04, 0.12, 16, 24]} />
            <meshStandardMaterial color={idx < 2 ? "#6b6b6b" : "#636363"} roughness={0.85} />
          </mesh>
          {/* Knee/elbow */}
          <mesh position={[0, -0.12, 0]}>
            <sphereGeometry args={[0.038, 20, 16]} />
            <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
          </mesh>
          {/* Lower leg */}
          <mesh position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.032, 0.1, 16, 24]} />
            <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
          </mesh>
          {/* Paw */}
          <mesh position={[0, -0.32, 0.02]} scale={[1.1, 0.5, 1.3]}>
            <sphereGeometry args={[0.038, 20, 16]} />
            <meshStandardMaterial color="#eee" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Tail */}
      <group ref={tailRef} position={[0, 0.7, -0.4]}>
        <mesh position={[0, 0.04, -0.04]} rotation={[0.6, 0, 0]}>
          <capsuleGeometry args={[0.038, 0.1, 16, 24]} />
          <meshStandardMaterial color="#6b6b6b" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.14, -0.07]}>
          <sphereGeometry args={[0.055, 24, 20]} />
          <meshStandardMaterial color="#888" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.2, -0.03]}>
          <sphereGeometry args={[0.05, 24, 20]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
        </mesh>
        <mesh position={[-0.03, 0.16, -0.05]}>
          <sphereGeometry args={[0.035, 20, 16]} />
          <meshStandardMaterial color="#999" roughness={0.9} />
        </mesh>
        <mesh position={[0.03, 0.17, -0.06]}>
          <sphereGeometry args={[0.03, 20, 16]} />
          <meshStandardMaterial color="#aaa" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

// ============================================================
//  Unified Trees export combining both types
// ============================================================
function Trees() {
  return (
    <>
      <PineTrees />
      <DeciduousTrees />
    </>
  );
}

export { Trees, Rocks, Bushes, GrassPatches, Wildflowers, Water, Clouds, Campfire, Tent, ClimbingWall, PrayerFlags, Husky };
