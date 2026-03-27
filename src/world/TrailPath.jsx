import { heightAt } from "./Terrain";

// Trail stops positions — these define the world's content zones
export const TRAIL_STOPS = [
  {
    id: "trailhead",
    position: [0, 0, 3],
    label: "Trailhead",
    radius: 8,
    stage: 1,
  },
  {
    id: "campsite",
    position: [-15, 0, -20],
    label: "Campsite",
    radius: 10,
    stage: 2,
  },
  {
    id: "lake",
    position: [25, 0, -15],
    label: "Lake",
    radius: 12,
    stage: 3,
  },
  {
    id: "climbing",
    position: [-25, 0, 25],
    label: "Climbing Wall",
    radius: 10,
    stage: 4,
  },
  {
    id: "summit",
    position: [5, 0, 40],
    label: "Summit",
    radius: 10,
    stage: 5,
  },
];

// Create a visible trail connecting all stops
export default function TrailPath() {
  // Trail markers at stops
  const markers = TRAIL_STOPS.map((stop) => {
    const y = heightAt(stop.position[0], stop.position[2]);
    return { ...stop, y };
  });

  return (
    <group>
      {/* Stop markers — wooden signposts */}
      {markers.map((marker) => (
        <group key={marker.id} position={[marker.position[0], marker.y, marker.position[2]]}>
          {/* Post */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 2.4, 5]} />
            <meshLambertMaterial color="#6B4226" />
          </mesh>
          {/* Sign */}
          <mesh position={[0.5, 2.0, 0]}>
            <boxGeometry args={[1.2, 0.35, 0.08]} />
            <meshLambertMaterial color="#deb887" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
