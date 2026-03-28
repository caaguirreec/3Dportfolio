import { Link } from "react-router-dom";

import { CTA } from "../components";
import { projects } from "../constants";
import { arrow } from "../assets/icons";

const categories = [
  { key: "saas", label: "SaaS Products" },
  { key: "hardware", label: "Hardware Products" },
];

const ProjectCard = ({ project }) => (
  <div className='lg:w-[400px] w-full' key={project.name}>
    <div className='block-container w-12 h-12'>
      <div className={`btn-back rounded-xl ${project.theme}`} />
      <div className='btn-front rounded-xl flex justify-center items-center'>
        <img
          src={project.iconUrl}
          alt={project.name}
          className='w-1/2 h-1/2 object-contain'
        />
      </div>
    </div>

    <div className='mt-5 flex flex-col'>
      <h4 className='text-2xl font-poppins font-semibold'>
        {project.name}
      </h4>
      <p className='mt-2 text-slate-500'>{project.description}</p>
      <div className='mt-5 flex items-center gap-2 font-poppins'>
        <Link
          to={project.link}
          target='_blank'
          rel='noopener noreferrer'
          className='font-semibold text-blue-600'
        >
          Live Link
        </Link>
        <img
          src={arrow}
          alt='arrow'
          className='w-4 h-4 object-contain'
        />
      </div>
    </div>
  </div>
);

const Projects = () => {
  return (
    <section className='max-container'>
      <h1 className='head-text'>
        My{" "}
        <span className='blue-gradient_text drop-shadow font-semibold'>
          Projects
        </span>
      </h1>

      <p className='text-slate-500 mt-2 leading-relaxed'>
        Throughout the years, I have embarked on numerous projects, but these are
        the ones I hold closest to my heart.
      </p>

      {categories.map(({ key, label }) => {
        const items = projects.filter((p) => p.category === key);
        if (items.length === 0) return null;
        return (
          <div key={key} className='mt-16'>
            <h2 className='text-2xl font-poppins font-semibold text-slate-700'>
              {label}
            </h2>
            <div className='flex flex-wrap mt-8 gap-16'>
              {items.map((project) => (
                <ProjectCard key={project.name} project={project} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Music Projects */}
      <div className='mt-16'>
        <h2 className='text-2xl font-poppins font-semibold text-slate-700'>
          Music Projects
        </h2>
        <div className='flex flex-wrap mt-8 gap-16'>
          <div className='lg:w-[400px] w-full'>
            <div className='block-container w-12 h-12'>
              <div className='btn-back rounded-xl btn-back-green' />
              <div className='btn-front rounded-xl flex justify-center items-center'>
                <span className='text-xl'>🎵</span>
              </div>
            </div>

            <div className='mt-5 flex flex-col'>
              <h4 className='text-2xl font-poppins font-semibold'>
                Music
              </h4>
              <p className='mt-2 text-slate-500'>
                Explore my music projects, recordings, and performances.
              </p>
              <div className='mt-5 flex items-center gap-2 font-poppins'>
                <Link
                  to='/music'
                  className='font-semibold text-blue-600'
                >
                  Explore
                </Link>
                <img
                  src={arrow}
                  alt='arrow'
                  className='w-4 h-4 object-contain'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className='border-slate-200 mt-16' />

      <CTA />
    </section>
  );
};

export default Projects;
