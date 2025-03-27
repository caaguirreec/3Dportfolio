import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { background } from "../assets/images";
import {  WebGLCubeRenderTarget } from 'three'



export function Sky() {

  const {gl} = useThree();
  const texture = useTexture(background)
  const formatted = new WebGLCubeRenderTarget(texture.image.height).fromEquirectangularTexture(gl, texture)
  return(
    <primitive attach="background" object={formatted.texture} />
  )
}
