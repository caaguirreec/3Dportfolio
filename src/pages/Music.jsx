import emailjs from "@emailjs/browser";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useState, useEffect } from "react";

import { Cello } from "../models";
import scarboroughFair from "../assets/scarboroughfair.mp3";
import { soundoff, soundon } from "../assets/icons";
import { Alert, CTA, Loader } from "../components";


const Music = () => {
    const audioRef = useRef(new Audio(scarboroughFair));
    audioRef.current.volume = 0.4;
    audioRef.current.loop = true;
    const [currentAnimation, setCurrentAnimation] = useState("idle");
    const [isPlayingMusic, setIsPlayingMusic] = useState(false);
    const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    if (isPlayingMusic) {
      audioRef.current.play();
    }

    return () => {
      audioRef.current.pause();
    };
  }, [isPlayingMusic]);

  
  return (
    <section className='relative flex lg:flex-row flex-col max-container'>
      <div className='py-36'>

      <div className='flex-1 min-w-[50%] flex flex-col'>
        <h1 className='head-text'>FA: Guitar, cello, and voice tribulations</h1>
        Experiencing music from medieval times, Scarborough Fair is a traditional English ballad.
        Then we explore the sound of the cello and guitar in a duet giving a new perspective to the song.
        <br />
        Video is coming soon.
        <br />


        Faaaaaaaaaa
         <div >
                <img
                  src={!isPlayingMusic ? soundoff : soundon}
                  alt='jukebox'
                  onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                  className='w-10 h-10 cursor-pointer object-contain'
                />
              </div>
      </div>

      <div className='lg:w-1/2 w-full lg:h-auto md:h-[550px] h-[350px]'>
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 75,
            near: 0.1,
            far: 1000,
          }}
        >
          <directionalLight position={[0, 0, 1]} intensity={2.5} />
          <ambientLight intensity={1} />
          <pointLight position={[5, 10, 0]} intensity={2} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
          />

          <Suspense fallback={<Loader />}>
            <Cello
              isRotating={isRotating}
              setIsRotating={setIsRotating}
              position={[-0.5, -1.35, 0]}
              rotation={[-12.629, -0.6, 0]}
              scale={[3.5, 3.5, 3.5]}
            />
          </Suspense>
        </Canvas>
      </div>
      <hr className='border-slate-200' />
      <CTA/>
      </div>
    </section>
  );
};

export default Music;
