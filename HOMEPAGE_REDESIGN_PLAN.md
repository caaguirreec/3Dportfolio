# Open-World Bikepacking Trail — Homepage Redesign Plan

## Vision
An immersive 3D experience where visitors ride a bike through a mountainous landscape, discovering portfolio sections as trail stops. Inspired by Bruno Simon's car-driving portfolio, but themed around your passions: bikepacking, camping, climbing, swimming, and traveling with your husky.

---

## Architecture Overview

```
Home.jsx (main scene controller)
├── TrailWorld.jsx          — terrain, trees, path, water, sky
├── BikeController.jsx      — player bike + physics + camera
├── TrailStops/
│   ├── CampsiteStop.jsx    — About Me (tent, fire, husky)
│   ├── LakeStop.jsx        — Projects (floating orbs on water)
│   ├── ClimbingWallStop.jsx — Skills & Tech Stack
│   ├── SummitStop.jsx       — Contact (panoramic view)
│   └── TrailheadStop.jsx   — Welcome / intro
├── HuskyCompanion.jsx      — animated husky that follows the bike
├── TrailUI.jsx             — HUD: minimap, current stop, controls hint
└── WeatherSystem.jsx       — day/night cycle, particles, fog
```

---

## Phase 1: Core Riding Experience (MVP)

### Goal
Get a bike moving through a terrain with a third-person camera. No stops yet — just the feel.

### Key Components

**1. Terrain Generation**
- Use a heightmap-based plane geometry (512x512 segments)
- Apply a displacement texture for mountains, valleys, and flat areas
- Material: mix grass, rock, dirt textures based on slope angle using a custom shader
- Alternative (simpler): use a hand-modeled `.glb` terrain from Blender or a free asset

**2. Trail Path**
- Define trail as a `CatmullRomCurve3` (spline) with control points
- Render as a slightly raised, textured ribbon on the terrain
- The bike follows (or is attracted to) this path loosely
- Path branches at each stop

**3. Bike Controller**
- Upgrade your existing `CyclistAnimated` model or source a low-poly bikepacker model
- Movement: forward/backward speed + left/right steering
- Physics approach options:
  - **Option A (Recommended):** `@react-three/rapier` — full rigid-body physics, terrain collider
  - **Option B (Lighter):** Custom controller with raycasting for ground following
- Pedaling animation synced to speed
- Controls: WASD / Arrow keys + touch joystick for mobile

**4. Third-Person Camera**
- Smooth chase camera using `@react-three/drei`'s `useHelper` or custom spring-based follow
- Camera offset: slightly above and behind the bike
- Lerp position + lookAt for cinematic smoothness
- Allow mouse/touch to orbit around bike temporarily

**5. Sky & Atmosphere**
- Keep your existing `Sky.jsx` or upgrade to drei's `<Sky>` with Preetham model
- Add `<Fog>` for depth and performance (hide distant terrain)
- Particle system: floating dust, fireflies at night, snow on peaks

### Suggested Libraries to Add
```json
{
  "@react-three/rapier": "^1.3.0",   // Physics
  "simplex-noise": "^4.0.1",          // Terrain generation
  "leva": "^0.9.35"                   // Debug controls during development
}
```

### Key Files to Modify
- `src/pages/Home.jsx` — replace Camping scene with TrailWorld
- `src/models/index.js` — add new model exports
- Create `src/world/` directory for terrain and trail logic

---

## Phase 2: Trail Stops & Content

### Goal
Add interactive zones along the trail. When the bike enters a zone, UI content appears.

### Stop Design

**Stop 1: Trailhead Sign (Start)**
- Location: flat area at trail start
- Visual: wooden sign post + directional arrows
- Content: "Hi, I'm César — ride to explore" + controls hint
- Trigger: automatic on load

**Stop 2: Campsite (About Me)**
- Location: clearing near a river bend
- Visual: tent, campfire (particle flames), log seats, your husky resting
- Content: professional summary, bio, languages spoken
- Interaction: fire grows brighter when bike is near, husky stands up and barks
- Links to: /about page

**Stop 3: Lake (Projects)**
- Location: mountain lake with clear water
- Visual: water shader with reflections, floating lanterns/orbs for each project
- Content: project cards appear as the bike circles the lake
- Interaction: orbs glow and rise when near, clicking opens project detail
- Links to: /projects page

**Stop 4: Climbing Wall (Skills & Experience)**
- Location: steep rock face on mountain side
- Visual: textured cliff with holds, skill names carved/painted on rock
- Content: tech stack organized vertically (like difficulty grades)
- Interaction: camera tilts up to show the wall, skills animate in
- Links to: /about#skills

**Stop 5: Mountain Summit (Contact)**
- Location: highest point on the trail
- Visual: panoramic view, prayer flags, cairn stones
- Content: contact form / email CTA, social links
- Interaction: camera pulls out to show full landscape
- Links to: /contact page

### Detection System
- Use collision zones (rapier sensors) or distance checks
- When bike enters a zone radius (~15 units), trigger:
  1. Camera smoothly reframes to show the stop
  2. HTML overlay fades in with content
  3. Ambient sound changes (crackling fire, water lapping, wind)
  4. 3D elements animate (fire sparks, water ripples, husky moves)

---

## Phase 3: Husky Companion

### Goal
An animated husky that follows the bike along the trail — the emotional anchor of the experience.

### Behavior
- **Following:** runs behind/beside the bike at a slight delay (lerped position)
- **Idle:** sits and pants when bike stops, looks around
- **At campsite:** lies by the fire, rolls over (easter egg)
- **At lake:** plays in the water, shakes off
- **At summit:** sits majestically looking at the view

### Model Source
- Recommended: [Sketchfab free husky models](https://sketchfab.com/search?q=husky+dog&type=models&sort_by=-likeCount) — look for ones with walk/run/idle animations
- Export as `.glb` with Draco compression
- Animations needed: idle, walk, run, sit, bark (can blend between them)

---

## Phase 4: Polish & Performance

### Visual Polish
- **Post-processing:** bloom for lights, vignette, color grading (`@react-three/postprocessing`)
- **Shadows:** soft shadows from directional light (sun)
- **LOD:** level-of-detail for distant objects
- **Loading screen:** animated progress bar with bikepacking illustration

### Performance Targets
- 60fps on modern desktop, 30fps on mobile
- Total asset size < 15MB (compressed)
- Use `Suspense` + lazy loading for stops not yet visible
- Instance meshes for trees, rocks, grass (drei's `<Instances>`)

### Mobile Support
- Virtual joystick overlay (nipplejs library or custom)
- Simplified terrain (fewer segments)
- Reduced particles and shadows
- Touch: one finger = steer, two fingers = camera

### Sound Design
- Ambient trail sounds: wind, birds, gravel under tires
- Per-stop sounds: crackling fire, water, wind at summit
- Background music: ambient/acoustic (like your current sakura.mp3)
- Use Web Audio API / Howler.js for spatial audio

---

## 3D Assets Needed

| Asset | Source Suggestion | Format |
|-------|-------------------|--------|
| Terrain | Procedural or Blender heightmap | Generated |
| Bikepacker (bike + rider) | Sketchfab / custom Blender | .glb |
| Husky dog (animated) | Sketchfab free | .glb |
| Tent + campfire | Sketchfab / poly.pizza | .glb |
| Trees (low-poly) | Kenney assets or procedural | .glb |
| Rocks / boulders | Procedural or free pack | .glb |
| Lake / water | drei `<Water>` or custom shader | Code |
| Climbing wall | Blender or Sketchfab | .glb |
| Trail sign | Simple Blender model | .glb |
| Prayer flags | Cloth sim or sprite | .glb |

### Free Asset Sources
- [Kenney.nl](https://kenney.nl/assets) — nature packs, low-poly
- [poly.pizza](https://poly.pizza/) — free low-poly models
- [Sketchfab](https://sketchfab.com/) — search "low poly camping", "husky", "bicycle"
- [ambientCG](https://ambientcg.com/) — PBR textures for terrain

---

## Implementation Timeline (Suggested)

| Week | Milestone |
|------|-----------|
| 1 | Terrain + trail path + basic bike movement |
| 2 | Third-person camera + sky + fog + basic lighting |
| 3 | Trail stops zones + HTML overlays for content |
| 4 | Husky companion + stop-specific animations |
| 5 | Mobile controls + performance optimization |
| 6 | Sound design + post-processing + loading screen |

---

## Quick Start: Minimal Proof of Concept

To test the concept fast before committing to the full build, try this in a single file:

1. Flat green plane + `CatmullRomCurve3` trail (white line)
2. A box (placeholder bike) that moves with WASD
3. `drei` `<OrbitControls>` replaced with a chase camera
4. 4 colored spheres along the trail (stop markers)
5. When box enters sphere radius → show a `<Html>` overlay

This takes ~2-3 hours and proves the interaction model works before investing in assets.

---

## Migration Plan (From Current Homepage)

Your current `Camping.jsx` rotation-based approach is clever but passive. The new system keeps the same content structure (stages 1-5 in HomeInfo) but changes the interaction from "drag to rotate" to "ride to discover."

### What to Keep
- `Sky.jsx` — upgrade but keep the concept
- `HomeInfo.jsx` — refactor stages to map to trail stops
- Audio toggle button — keep the music player UI
- All existing routes (/about, /projects, /contact, /traveling, /music)

### What to Replace
- `Camping.jsx` → `TrailWorld.jsx` + `BikeController.jsx`
- Mouse drag rotation → keyboard/touch riding controls
- Static camera → chase camera
- Single 3D scene → multi-zone world

### Backward Compatibility
Keep the current homepage on a `/classic` route during development so nothing breaks.
