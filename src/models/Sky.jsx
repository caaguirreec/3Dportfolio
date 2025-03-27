import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { background } from "../assets/images";
import {  WebGLCubeRenderTarget } from 'three'


// 3D Model from: https://sketchfab.com/3d-models/phoenix-bird-844ba0cf144a413ea92c779f18912042
export function Sky() {

  const {gl} = useThree();
  const texture = useTexture(background)
  const formatted = new WebGLCubeRenderTarget(texture.image.height).fromEquirectangularTexture(gl, texture)
  return(
    <primitive attach="background" object={formatted.texture} />
  )
}
