import { useMemo, useRef } from "react";
import * as THREE from "three";

// Seeded pseudo-random for consistent noise
function noise2D(x, z) {
  const n = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

// Multi-octave terrain height with more natural features
function heightAt(x, z) {
  // Large rolling hills
  const h1 = Math.sin(x * 0.025) * 4.5 + Math.cos(z * 0.03) * 3.5;
  // Medium bumps
  const h2 = Math.sin(x * 0.06 + z * 0.05) * 1.8 + Math.cos(x * 0.04 - z * 0.03) * 2.2;
  // Small detail
  const h3 = Math.sin(x * 0.12 + z * 0.1) * 0.6 + Math.cos(x * 0.15) * Math.sin(z * 0.13) * 0.5;
  // Ridge formation
  const ridge = Math.abs(Math.sin(x * 0.015 + z * 0.02)) * 5;
  // Valley near lake
  const lakeDist = Math.sqrt((x - 25) * (x - 25) + (z + 15) * (z + 15));
  const lakeDepression = lakeDist < 18 ? -(18 - lakeDist) * 0.35 : 0;

  return h1 + h2 + h3 + ridge * 0.4 + lakeDepression;
}

export { heightAt };

export default function Terrain() {
  const meshRef = useRef();

  const geometry = useMemo(() => {
    const size = 120;
    const segments = 120;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    // Richer color palette
    const grassDark = new THREE.Color("#3a6b2f");
    const grassLight = new THREE.Color("#5a9a3f");
    const grassYellow = new THREE.Color("#7a9a45");
    const dirtDark = new THREE.Color("#6B5335");
    const dirtLight = new THREE.Color("#9B8365");
    const rockDark = new THREE.Color("#5a5a5a");
    const rockLight = new THREE.Color("#8a8a8a");
    const snowColor = new THREE.Color("#e8eef0");
    const sandColor = new THREE.Color("#c2b280");
    const tmpColor = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = heightAt(x, z);
      pos.setY(i, y);

      // Compute slope for coloring
      const dx = heightAt(x + 0.5, z) - heightAt(x - 0.5, z);
      const dz = heightAt(x, z + 0.5) - heightAt(x, z - 0.5);
      const slope = Math.sqrt(dx * dx + dz * dz);

      // Noise for variation
      const n = noise2D(x * 0.3, z * 0.3);

      if (y > 13) {
        tmpColor.copy(snowColor);
      } else if (y > 10) {
        // Snow/rock transition
        const t = (y - 10) / 3;
        tmpColor.lerpColors(rockLight, snowColor, t + n * 0.2);
      } else if (slope > 2.5) {
        // Steep = rock
        tmpColor.lerpColors(rockDark, rockLight, n);
      } else if (y > 7) {
        // High grass / rock mix
        tmpColor.lerpColors(grassYellow, rockDark, (y - 7) / 3 + n * 0.15);
      } else if (y < -2.5) {
        // Lake bed / sand near water
        tmpColor.lerpColors(sandColor, dirtLight, n * 0.5);
      } else if (y < 0) {
        // Wet ground near water
        tmpColor.lerpColors(dirtDark, grassDark, (y + 2.5) / 2.5);
      } else {
        // Main grassy area with variation
        if (n > 0.65) {
          tmpColor.copy(grassLight);
        } else if (n > 0.35) {
          tmpColor.copy(grassDark);
        } else {
          tmpColor.lerpColors(grassDark, grassYellow, n * 2);
        }
        // Dirt patches
        if (n > 0.85) {
          tmpColor.lerp(dirtLight, 0.4);
        }
      }

      colors[i * 3] = tmpColor.r;
      colors[i * 3 + 1] = tmpColor.g;
      colors[i * 3 + 2] = tmpColor.b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow>
      <meshLambertMaterial vertexColors flatShading />
    </mesh>
  );
}
