import { Canvas } from "@react-three/fiber";
import { Link } from "react-router-dom";
import { Suspense, useRef, useState } from "react";
import { Tulia, Cyclist, CyclistAnimated } from "../models";
import { Loader } from "../components";
import{instagrambig,polarstepsbig,book} from "../assets/icons";

const Contact = () => {
  const formRef = useRef();
  const features = [
    {
        imageUrl: instagrambig,
        name: "Instagram",
        type: "Social media",
        url: "https://www.instagram.com/tuliaenbicialsur/",
    },
    {
      imageUrl: polarstepsbig,
      name: "Polarsteps",
      type: "Travel blog",
      url: "https://www.polarsteps.com/CesarAguirre/13496275-tuliaenbicialsur",
  },{
    imageUrl: book,
    name: "Interactive book",
    type: "Book",
    url: "/booktuliaenbicialsur",
}];
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
       <h2 className='head-text'>TuliaEnBiciAlSur</h2>
       
       <p className='text-slate-500 mt-2 leading-relaxed'>
            Bikepacking trip through South america with my siberian dog Tulia.
            In this section Tulia and me invite you to share with us this adventure of a lifetime. 
            Through diverse sources as social media, a book and a 3D inmersive experience, you can follow us and be part of this amazing journey. 
            
            </p>
          <div className='mt-16 flex flex-wrap gap-12'>
                    {features.map((feature) => (
                      <div className='block-container w-20 h-20' key={feature.name}>
                        <div className='btn-back rounded-xl' />
                        <div className='btn-front rounded-xl flex justify-center items-center'>
                        <Link key={feature.name} to={feature.url} target='_blank'>
                          <img
                            src={feature.imageUrl}
                            alt={feature.name}
                            //className='w-1/2 h-1/2 object-contain'
                          />
                        </Link>
                        </div>
                      </div>
                    ))}
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
