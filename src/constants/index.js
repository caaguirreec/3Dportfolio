import { meta, shopify, starbucks, tesla, tulia1,tulia2, tulia3,tulia4,tulia5,tulia6,tulia7,tulia8,tulia9,tulia10} from "../assets/images";
import {
    car,
    car2,
    contact,
    css,
    estate,
    express,
    git,
    github,
    html,
    javascript,
    linkedin,
    mongodb,
    motion,
    mui,
    nextjs,
    nodejs,
    pricewise,
    react,
    redux,
    sass,
    snapgram,
    summiz,
    tailwindcss,
    threads,
    typescript,
    java,
    python,
    aws
} from "../assets/icons";

export const gallery =[
    {
        imageUrl:tulia1,
        name: "Tulia en Bici al Sur", 
    },
    {
        imageUrl:tulia2,
        name: "Tulia en Bici al Sur", 
    },
    {
        imageUrl:tulia3,
        name: "Tulia en Bici al Sur", 
    },
    {
        imageUrl:tulia4,
        name: "Tulia en Bici al Sur", 
    },
    {
        imageUrl:tulia5,
        name: "Tulia en Bici al Sur", 
    },
    {
        imageUrl:tulia6,
        name: "Tulia en Bici al Sur", 
    },
    {
        imageUrl:tulia7,
        name: "Tulia en Bici al Sur", 
    },
    {
        imageUrl:tulia8,
        name: "Tulia en Bici al Sur", 
    },
    {
        imageUrl:tulia9,
        name: "Tulia en Bici al Sur", 
    },
    {
        imageUrl:tulia10,
        name: "Tulia en Bici al Sur", 
    }
]
export const skills = [
    {
        imageUrl: python,
        name: "Python",
        type: "Backend",
    },
    {
        imageUrl: javascript,
        name: "JavaScript",
        type: "Frontend",
    },
    {
        imageUrl: typescript,
        name: "TypeScript",
        type: "Frontend",
    },
    {
        imageUrl: java,
        name: "Java",
        type: "Backend",
    },
    {
        imageUrl: react,
        name: "React",
        type: "Frontend",
    },
    {
        imageUrl: nodejs,
        name: "Node.js",
        type: "Backend",
    },
    {
        imageUrl: express,
        name: "Express",
        type: "Backend",
    },
    {
        imageUrl: aws,
        name: "AWS",
        type: "Cloud & AI",
    },
    {
        imageUrl: mongodb,
        name: "MongoDB",
        type: "Database",
    },
    {
        imageUrl: git,
        name: "Git",
        type: "DevOps",
    },
    {
        imageUrl: github,
        name: "GitHub",
        type: "DevOps",
    },
    {
        imageUrl: tailwindcss,
        name: "Tailwind",
        type: "Frontend",
    },
    {
        imageUrl: html,
        name: "HTML5",
        type: "Frontend",
    },
    {
        imageUrl: css,
        name: "CSS3",
        type: "Frontend",
    },
];
export const academy = [
    {
        title: "Researcher",
        institution: "Universidad Nacional de Colombia",
        date: "Oct 2012- Oct 2015",
        points: [
            "Researcher in machine learning and vibration analysis for mechanical systems.",
            "Research and develop machine learning models to predict mechanical failures inindustrial devices as bearings, engines, and axis.",
            " The job was performed on a mechanical lab designed to acquire mechanical signals through vibration analysis."
            
        ],
        publications: [
            {
                name: "Identificación mejorada de componentes en baja frecuencia de turbinas eólicas empleando EEMD eintegración en el tiempo",
                url:  "https://www.redalyc.org/pdf/1470/147040027009.pdf",
            },
            {
                name: "Epilepsy activity detection based on optimized one-class classifiers",
                url:  "https://ieeexplore.ieee.org/abstract/document/6644936",
            },
            {
                name: "EEG Rhythm Analysis Using Stochastic Relevance",
                url:  "https://link.springer.com/chapter/10.1007/978-3-319-00846-2_163",
            }   
        ]
     },
     {
        title: "Bachelor's degree in Electronic engineering",
        institution: "Universidad Nacional de Colombia",
        date: "Jan 2007- Dec 2012",
        points: [
            "Degree in electronic engineering with a focus on electronics and telecommunications.",
            "Thesis: Design and implementation of an information system for monitoring and control of fishery in San Andrés island.",
        ],
        publications:[
            {
                name:"SIMASPE",
                url: "https://agenciadenoticias.unal.edu.co/detalle/software-para-afrontar-pesca-intensiva-en-san-andres"
            }
        ]
    }
]
export const experiences = [
    {
        title: "Software Development Engineer",
        company_name: "Katapult Labs",
        icon: meta,
        iconBg: "#a2d2ff",
        date: "May 2025 - Present",
        points: [
            "Architect and deliver full-stack AI-first applications (getbuddy.com, trashie.io), building complete startup ecosystems from backend APIs to frontend interfaces using Python and JavaScript.",
            "Integrate generative AI and LLM capabilities to automate workflows, reducing manual processing time by ~60%.",
            "Design scalable cloud infrastructure on AWS supporting rapid iteration across multiple product lines.",
            "Stack: Python, JavaScript, React, Node.js, AWS (Lambda, S3, Bedrock), MongoDB",
        ],
    },
    {
        title: "Software Development Engineer",
        company_name: "Playvox",
        icon: starbucks,
        iconBg: "#accbe1",
        date: "Jun 2022 - Apr 2024",
        points: [
            "Engineered backend systems in Python (Django) and Node.js serving contact center operations across enterprise clients.",
            "Integrated AWS Bedrock AI models into production APIs, enabling intelligent automation of customer interaction analysis.",
            "Built serverless data pipelines using AWS Lambda and RDS, processing thousands of daily transactions.",
            "Stack: Python (Django), Node.js, AWS Lambda, RDS, Bedrock",
        ],
    },
    {
        title: "R&D Leader",
        company_name: "IAS Software",
        icon: tesla,
        iconBg: "#fbc3bc",
        date: "Jul 2019 - May 2022",
        points: [
            "Led a team of 6+ engineers designing and launching SaaS products for the insurance and banking sectors.",
            "Defined technical architecture and business models contributing to product-driven revenue growth.",
            "Mentored junior developers through code reviews and pair programming, improving team delivery velocity by ~40%.",
        ],
    },
    {
        title: "Software Development Engineer",
        company_name: "IAS Software",
        icon: tesla,
        iconBg: "#fbc3bc",
        date: "Jul 2017 - Jul 2019",
        points: [
            "Designed and maintained enterprise software systems for the insurance sector, serving thousands of end users.",
            "Provided frontend and backend architecture consultancy for banking clients integrating new features.",
            "Implemented responsive cross-browser designs and contributed to code quality standards across the team.",
        ],
    },
    {
        title: "R&D Engineer",
        company_name: "Vega Energy",
        icon: shopify,
        iconBg: "#b7e4c7",
        date: "Jan 2015 - Feb 2017",
        points: [
            "Developed IoT product prototypes for telemetry and industrial measurement, from circuit design to firmware deployment.",
            "Built embedded software and web interfaces for real-time sensor data visualization.",
            "Collaborated within a multidisciplinary engineering team delivering production-ready hardware/software systems.",
        ],
    },
];

export const socialLinks = [
    {
        name: 'Contact',
        iconUrl: contact,
        link: '/contact',
    },
    {
        name: 'GitHub',
        iconUrl: github,
        link: 'https://github.com/caaguirreec',
    },
    {
        name: 'LinkedIn',
        iconUrl: linkedin,
        link: 'https://www.linkedin.com/in/c%C3%A9sar-aguirre-902220158',
    }
];

export const projects = [
    {
        iconUrl: car,
        theme: 'btn-back-blue',
        name: 'Bikey App',
        description: 'Web and mobile app for cyclists to increase safety across urban areas by providing real-time tracking information.',
        link: 'https://www.bikey.app/#/landing',
        category: 'saas',
    },
    {
        iconUrl: snapgram,
        theme: 'btn-back-pink',
        name: 'Telliou',
        description: 'Virtual and programatic call centers automated designed for small business.',
        link: 'https://www.telliou.com/',
        category: 'saas',
    },
    {
        iconUrl: estate,
        theme: 'btn-back-black',
        name: 'Houndter',
        description: 'Scraping tool for data analysis on social media.',
        link: 'https://houndter.com/',
        category: 'saas',
    },
    {
        iconUrl: summiz,
        theme: 'btn-back-yellow',
        name: 'Objetos Residuales',
        description: 'Kinetic sound art installation using a Raspberry Pi and DSP to play four independent audio channels through repurposed instruments, controllable via smartphone over a self-hosted Wi-Fi network.',
        link: 'https://github.com/caaguirreec/Objetos-residuales',
        category: 'hardware',
    },
    {
        iconUrl: car2,
        theme: 'btn-back-red',
        name: 'Pioneer',
        description: 'Creation from scratch of a controlled mechanical car with a Raspberry Pi, a camera, and a web interface to control it.',
        link: 'https://github.com/caaguirreec/PI-oneer',
        category: 'hardware',
    },
    {
        iconUrl: threads,
        theme: 'btn-back-green',
        name: 'Audiovisual Loop Station',
        description: 'Pedal loop interface to mix microphone sound waves, recording and save them to create a compound sounds.',
        link: 'https://github.com/caaguirreec/AudioVisualLoopStation',
        category: 'hardware',
    },
];