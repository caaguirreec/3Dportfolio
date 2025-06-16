import { Canvas } from "@react-three/fiber";
import { Link } from "react-router-dom";
import { CTA, Gallery } from "../components";
import { Suspense, useRef, useState } from "react";
import { Tulia, Cyclist, CyclistAnimated } from "../models";
import { Loader } from "../components";
import{instagrambig,polarstepsbig,book} from "../assets/icons";

const Contact = () => {
  const formRef = useRef();
  const features = [
    {
        imageUrl: instagrambig,
        name: "Media",
        type: "Social media",
        url: "https://www.instagram.com/tuliaenbicialsur/",
    },
    {
      imageUrl: polarstepsbig,
      name: "Route",
      type: "Travel blog",
      url: "https://www.polarsteps.com/CesarAguirre/13496275-tuliaenbicialsur",
  },{
    imageUrl: book,
    name: "Book",
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
      screenScale = [0.7, 0.7, 0.7];
      screenPosition = [0.6, -0.9, 2];
    } else {
      screenScale = [0.7, 0.7, 0.7];
      screenPosition = [0.6, -0.9, 2];
    }
    return [screenScale, screenPosition];
  };
  const adjustTuliaForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [2.7, 2.7, 2.7];
      screenPosition = [-1.5, -4, -4];
    } else {
      screenScale = [2.7, 2.7, 2.7];
      screenPosition = [-1.5, -4, -4];
    }

    return [screenScale, screenPosition];
  };

  const [cyclistScale, cyclistPosition] = adjustCyclistForScreenSize();
  const [tuliaScale, tuliaPosition] = adjustTuliaForScreenSize();
  return (
    <section className='relative flex lg:flex-row flex-col max-container bg-color-black'>
       <div className='py-16'>
        <div className='flex-1 min-w-[50%] flex flex-col'>
         <h2 className='head-text'>TuliaEnBiciAlSur</h2>
       
          <p className='text-slate-500 mt-2 leading-relaxed'>
                Bikepacking trip through South america with my siberian dog Tulia.
                In this section Tulia and me invite you to share with us this adventure of a lifetime. 
                Through diverse sources as social media, a book and a 3D inmersive experience, you can follow us and be part of this amazing journey. 
                
                </p>
          <div className='travelingbox mt-16 flex flex-2 flex-row gap-12'>
                    {features.map((feature) => (
                      <div className='block-container w-20 h-20' key={feature.name}>
                        <div className='btn-back rounded-xl' />
                        <div className='btn-front rounded-xl justify-center items-center'>
                        <Link key={feature.name} to={feature.url} target='_blank'>
                          <img
                            src={feature.imageUrl}
                            alt={feature.name}
                            className='w-1/2 h-1/2 object-contain'
                          />    
                          {feature.name}                      
                        </Link>                        
                        </div>
                      </div>
                    ))}
          </div>
        </div>
        <div/>  
        <div style={{ width: "60vw", height: "60vh" }}>
      
        <Canvas
            camera={{
            position: [0, 0, 5],
            fov: 75,
            near: 0.1,
            far: 100000000,
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
      <hr className='border-slate-200' />
      
      {/* Podcast Section */}
      <div className='py-16'>
        <h2 className='head-text'>Podcast</h2>
        <p className='text-slate-500 mt-2 leading-relaxed'>
          Listen to our adventures and experiences during our bikepacking journey through South America.
        </p>
        <div className='mt-8 w-full aspect-video'>
          <iframe
            className='w-full h-full rounded-xl'
            src="https://www.youtube.com/embed/Lv8j5euiVAw"
            title="Tulia En Bici Al Sur Podcast"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      <hr className='border-slate-200' />
      <Gallery />
      <CTA />
      </div>
    </section>
    
  );
};

export default Contact;
