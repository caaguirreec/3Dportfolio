import { Canvas } from "@react-three/fiber";
import { Link } from "react-router-dom";
import { Suspense, useRef, useState } from "react";
import { Tulia, Cyclist, CyclistAnimated } from "../models";
import { Loader } from "../components";
import{instagram} from "../assets/icons";

const Contact = () => {
  const formRef = useRef();
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
       <h2 className='head-text'>Tulia en bici al sur</h2>
       <label className='text-black-500 font-semibold'>
            Viaje por suramérica en bicicleta con mi perrita husky siberiana.
            <Link key="Instagram" to="https://www.instagram.com/tuliaenbicialsur/" target='_blank'>
                     <img
                       src={instagram}
                       alt="Instagram"
                       className='w-6 h-6 object-contain'
                     />
            </Link>
            </label>
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
        </Canvas>
      </div>
    </section>
  );
};

export default Contact;
