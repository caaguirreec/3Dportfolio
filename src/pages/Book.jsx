import { Canvas } from "@react-three/fiber";
import { Link } from "react-router-dom";
import { Suspense, useRef, useState } from "react";
import { Tulia, Cyclist, CyclistAnimated } from "../models";
import { Loader } from "../components";
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';
import booktuliaenbicialsur from "../assets/booktuliaenbicialsur.pdf";


const Contact = () => {
  
  const [loading] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState("idle");
  const [currentStage, setCurrentStage] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const adjustCyclistForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [1.5, 1.5, 1.5];
      screenPosition = [0.9, -0.9, 2];
    } else {
      screenScale = [1.5, 1.5, 1.5];
      screenPosition = [0.9, -0.9, 2];
    }
    return [screenScale, screenPosition];
  };
  const adjustTuliaForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [4.2, 4.2, 4.2];
      screenPosition = [-3, -4, -4];
    } else {
      screenScale = [4.2, 4.2, 4.2];
      screenPosition = [-3, -4, -4];
    }

    return [screenScale, screenPosition];
  };

  const [cyclistScale, cyclistPosition] = adjustCyclistForScreenSize();
  const [tuliaScale, tuliaPosition] = adjustTuliaForScreenSize();
  return (
    <section className='relative flex lg:flex-row flex-col max-container'>
     <div className='flex-1 min-w-[50%] flex flex-col'>
       <h2 className='head-text'>Book</h2>
       
       <p className='text-slate-500 mt-2 leading-relaxed'>
            Welcome to a fascinating journey through the book TuliaEnBiciAlSur.
            I will try cover the most important aspects of the trip through Southamerica on a bicycle with Tulia. As a reader, you will find two narratives in pararell, one of them is the story of the trip and the other one is the story through Tulia's eyes and experiences with the most representative fauna of Andean territores.            
            </p>
       </div>
      <div className='lg:w-1/2 w-full lg:h-auto md:h-[550px] h-[350px]'>

<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
<div
    style={{
        border: '1px solid rgba(0, 0, 0, 0.3)',
        height: '750px',
    }}
>
<Viewer fileUrl={booktuliaenbicialsur} />;
</div>
  
</Worker>
     
        {/* <Canvas
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
           <CyclistAnimated
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
            position={cyclistPosition}
            rotation={[0.1, 0.7077, 0]}
            scale={cyclistScale}
          />
            <Tulia
            setIsRotating={setIsRotating}
            isRotating={isRotating}
            position={tuliaPosition}
            rotation={[0.1, 0.7077, 0]}
            scale={tuliaScale}
          /> 
          </Suspense>
        </Canvas> */}
      </div>
    </section>
  );
};

export default Contact;
