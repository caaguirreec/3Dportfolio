import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { Link } from "react-router-dom";
import { CTA } from "../components";
import { experiences, skills, academy } from "../constants";
import { paper } from "../assets/icons";

import "react-vertical-timeline-component/style.min.css";

const SkillCategory = ({ title, items }) => (
  <div className='mb-6'>
    <h4 className='text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3'>
      {title}
    </h4>
    <div className='flex flex-wrap gap-4'>
      {items.map((skill) => (
        <div
          className='block-container w-16 h-16 sm:w-20 sm:h-20'
          key={skill.name}
        >
          <div className='btn-back rounded-xl' />
          <div className='btn-front rounded-xl justify-center items-center'>
            <img
              src={skill.imageUrl}
              alt={skill.name}
              className='w-1/2 h-1/2 object-contain'
            />
            <span className='text-xs mt-1'>{skill.name}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const About = () => {
  const skillCategories = {
    "Backend": skills.filter((s) => s.type === "Backend"),
    "Frontend": skills.filter((s) => s.type === "Frontend"),
    "Cloud & AI": skills.filter((s) => s.type === "Cloud & AI"),
    "Database": skills.filter((s) => s.type === "Database"),
    "DevOps": skills.filter((s) => s.type === "DevOps"),
  };

  return (
    <section className='max-container'>
      {/* Professional Introduction */}
      <h1 className='head-text'>
        Hi, I'm{" "}
        <span className='blue-gradient_text font-semibold drop-shadow'>
          César Aguirre
        </span>
      </h1>

      <div className='mt-5 flex flex-col gap-3 text-slate-500'>
        <p className='text-lg leading-relaxed'>
          Senior Full-Stack Engineer with 12+ years building scalable web applications,
          SaaS platforms, and AI-powered products. I specialize in Python, Node.js,
          React, and AWS — from architecting distributed systems to leading engineering
          teams that ship production-ready solutions.
        </p>
        <div className='flex flex-wrap gap-3 mt-2'>
          <span className='px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium'>
            Full-Stack Development
          </span>
          <span className='px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium'>
            AI / LLM Integration
          </span>
          <span className='px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium'>
            Technical Leadership
          </span>
          <span className='px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium'>
            Cloud Architecture (AWS)
          </span>
        </div>
      </div>

      {/* Tech Skills - Categorized */}
      <div className='py-10 flex flex-col'>
        <h3 className='subhead-text'>Technical Skills</h3>
        <div className='mt-8'>
          {Object.entries(skillCategories).map(([category, categorySkills]) =>
            categorySkills.length > 0 ? (
              <SkillCategory
                key={category}
                title={category}
                items={categorySkills}
              />
            ) : null
          )}
        </div>
      </div>

      {/* Work Experience */}
      <div className='py-16'>
        <h3 className='subhead-text'>Professional Experience</h3>
        <div className='mt-5 flex flex-col gap-3 text-slate-500'>
          <p>
            From IoT prototyping to AI-powered SaaS — here's my journey building
            impactful products across startups and enterprises:
          </p>
        </div>

        <div className='mt-12 flex'>
          <VerticalTimeline>
            {experiences.map((experience) => (
              <VerticalTimelineElement
                key={`${experience.company_name}-${experience.date}`}
                date={experience.date}
                iconStyle={{ background: experience.iconBg }}
                icon={
                  <div className='flex justify-center items-center w-full h-full'>
                  </div>
                }
                contentStyle={{
                  borderBottom: "8px",
                  borderStyle: "solid",
                  borderBottomColor: experience.iconBg,
                  boxShadow: "none",
                }}
              >
                <div>
                  <h3 className='text-black text-xl font-poppins font-semibold'>
                    {experience.title}
                  </h3>
                  <p
                    className='text-black-500 font-medium text-base'
                    style={{ margin: 0 }}
                  >
                    {experience.company_name}
                  </p>
                </div>

                <ul className='my-5 list-disc ml-5 space-y-2'>
                  {experience.points.map((point, index) => (
                    <li
                      key={`experience-point-${index}`}
                      className='text-black-500/50 font-normal pl-1 text-sm'
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>

        {/* Academy */}
        <h3 className='subhead-text mt-16'>Education & Research</h3>
        <div className='mt-5 flex flex-col gap-3 text-slate-500'>
          <p>
            My academic background in electronic engineering and machine learning
            research laid the foundation for my engineering career, with 3 peer-reviewed
            publications in IEEE and Springer.
          </p>
        </div>
        <div className='mt-12 flex'>
          <VerticalTimeline>
            {academy.map((item) => (
              <VerticalTimelineElement
                key={item.institution + item.date}
                date={item.date}
                iconStyle={{ background: item.iconBg }}
                icon={
                  <div className='flex justify-center items-center w-full h-full'>
                  </div>
                }
                contentStyle={{
                  borderBottom: "8px",
                  borderStyle: "solid",
                  borderBottomColor: item.iconBg,
                  boxShadow: "none",
                }}
              >
                <div>
                  <h3 className='text-black text-xl font-poppins font-semibold'>
                    {item.title}
                  </h3>
                  <p
                    className='text-black-500 font-medium text-base'
                    style={{ margin: 0 }}
                  >
                    {item.institution}
                  </p>
                </div>

                <ul className='my-5 list-disc ml-5 space-y-2'>
                  {item.points.map((point, index) => (
                    <li
                      key={`academy-point-${index}`}
                      className='text-black-500/50 font-normal pl-1 text-sm'
                    >
                      {point}
                    </li>
                  ))}
                </ul>
                {item.publications && item.publications.length > 0 && (
                  <>
                    <p className='text-black-500 font-medium text-sm mt-4'>
                      Publications:
                    </p>
                    <div className='mt-3 flex flex-wrap gap-4'>
                      {item.publications.map((publication) => (
                        <Link
                          key={publication.name}
                          to={publication.url}
                          target='_blank'
                          className='flex items-center gap-2 text-blue-600 hover:text-blue-800 text-xs transition-colors'
                          title={publication.name}
                        >
                          <img
                            src={paper}
                            alt={publication.name}
                            className='w-6 h-6'
                          />
                          <span className='max-w-[200px] truncate'>
                            {publication.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      </div>

      <hr className='border-slate-200' />

      <CTA />
    </section>
  );
};

export default About;
