import { Link } from "react-router-dom";

import { arrow } from "../assets/icons";

const HomeInfo = ({ currentStage }) => {
  if (currentStage === 1)
    return (
      <h1 className='sm:text-x sm:leading-snug text-center bg-white  py-4 px-8 text-black mx-5'>
        Hi, I'm
        <span className='font-semibold mx-2 text-black'>César</span>
        👋
        <br />
        Software Engineer, and bikepacker from Colombia 🇨🇴
      </h1>
    );

  if (currentStage === 2) {
    return (
      <div className='info-box'>
        <p className='font-normal sm:text-x text-center'>
          10+ years building digital solutions in tech sector. <br /> 
          Teamwork, technical mastery, and creative problem-solving are some skills I have built.
        </p>

        <Link to='/about' className='bg-black neo-btn'>
          Look at
          <img src={arrow} alt='arrow' className='w-4 h-4 object-contain' />
        </Link>
      </div>
    );
  }

  if (currentStage === 3) {
    return (
      <div className='info-box'>
        <p className='font-normal text-center sm:text-x'>
          I have worked on a music project as a cello performer. <br /> Curious?
        </p>

        <Link to='/music' className='bg-black neo-btn'>
          Visit
          <img src={arrow} alt='arrow' className='w-4 h-4 object-contain' />
        </Link>
      </div>
    );
  }

  if (currentStage === 4) {
    return (
      <div className='info-box'>
      <p className='font-normal sm:text-x text-center'>
        Need a digital project done or looking for a dev? <br/> I'm just a message away
      </p>

      <Link to='/contact' className='bg-black neo-btn'>
        Visit
        <img src={arrow} alt='arrow' className='w-4 h-4 object-contain' />
      </Link>
    </div>
    );
  }
  if (currentStage === 5) {
    return (
      <div className='info-box'>
      <p className='font-normal sm:text-x text-center'>
        I am also a Bikepacker seeking new places to ride and adventures to live.<br/>
      </p>

      <Link to='/traveling' className='bg-black neo-btn'>
        Explore
        <img src={arrow} alt='arrow' className='w-4 h-4 object-contain' />
      </Link>
    </div>
    );
  }
  return null;
};

export default HomeInfo;
