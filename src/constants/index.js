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
        imageUrl: java,
        name: "Java",
        type: "Backend",
    },
    {
        imageUrl: python,
        name: "Python",
        type: "Backend",
    },
    {
        imageUrl: aws,
        name: "AWS",
        type: "Cloud",
    },
    {
        imageUrl: css,
        name: "CSS",
        type: "Frontend",
    },
    {
        imageUrl: express,
        name: "Express",
        type: "Backend",
    },
    {
        imageUrl: git,
        name: "Git",
        type: "Version Control",
    },
    {
        imageUrl: github,
        name: "GitHub",
        type: "Version Control",
    },
    {
        imageUrl: html,
        name: "HTML",
        type: "Frontend",
    },
    {
        imageUrl: javascript,
        name: "JavaScript",
        type: "Frontend",
    },
    {
        imageUrl: mongodb,
        name: "MongoDB",
        type: "Database",
    },
    {
        imageUrl: nodejs,
        name: "Node.js",
        type: "Backend",
    },
    {
        imageUrl: react,
        name: "React",
        type: "Frontend",
    },
    {
        imageUrl: typescript,
        name: "TypeScript",
        type: "Frontend",
    }
    
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
        title: "Software development Engineer",
        company_name: "Playvox",                                    
        icon: meta,
        iconBg: "#a2d2ff",
        date: "Jun 2022 - Abr 2024",
        points: [                                                                                                                                                                        
            "Design, code and maintain backend code in Python and Node for contact center industry.",
            "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
            "Implementing IA models and integrating them with APIs, and data flows",
            "Participating in code reviews and providing constructive feedback to other developers.",
            "Stack: Python(Django and plain)+AWS Lambda+ AWS RDS + AWS Bedrock(IA)",
        ],
    },
    {
        title: "Leader Reasearch & Development",
        company_name: "IAS Software",
        icon: starbucks,
        iconBg: "#accbe1",
        date: "July 2019 - May 2022",
        points: [
            "Design and build SaaS(software as a service) products, lead a software development team, build, test, reinforce SaaS and manage development teams across projects.",
            "Managing teams across products, and teach junior developers.",
        ],
    },
    {
        title: "Software development Engineer",
        company_name: "IAS Software",
        icon: tesla,
        iconBg: "#fbc3bc",
        date: "Jul 2017 - Jul 2019",
        points: [
            "analyze, design, code and maintain industrial complex software systems in the insurance sector",
            "Consultancy for banking systems regarding frontend and backend architecture for new features",
            "Implementing responsive design and ensuring cross-browser compatibility.",
        ],
    },
    {
        title: "Web Developer",
        company_name: "On24",
        icon: shopify,
        iconBg: "#b7e4c7",
        date: "March 2017 - Jun 2017",
        points: [
            "Developing and maintaining web applications using Java SE, Java EE and other technologies",
            "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
            "Participating in code reviews and providing constructive feedback to other developers.",
        ],
    },
    {
        title: "Research & Development engineer",
        company_name: "Vega Energy",
        icon: meta,
        iconBg: "#a2d2ff",
        date: "Feb 2014 - Mar 2017",
        points: [
            "Research and development of product prototypes related to electronic and mechanic devices in telemetry and the measurement industry. The main tasks included everything from designing electronic schemes, prototypes to coding and deploying firmware, and software in a complex and productive engineering team",
            "Participating in code reviews and providing constructive feedback to other developers.",
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
        iconUrl: car2,
        theme: 'btn-back-red',
        name: 'Pioneer',
        description: 'Creation from scratch of a controlled mechanical car with a Raspberry Pi, a camera, and a web interface to control it.',
        link: 'https://github.com/caaguirreec/PI-oneer',
    },
    {
        iconUrl: threads,
        theme: 'btn-back-green',
        name: 'Audiovisual Loop Station',
        description: 'Pedal loop interface to mix microphone sound waves, recording and save them to create a compound sounds.',
        link: 'https://github.com/caaguirreec/AudioVisualLoopStation',
    },
    {
        iconUrl: car,
        theme: 'btn-back-blue',
        name: 'Bikey App',
        description: 'Web and mobile app for cyclists to increase safety across urban areas by providing real-time tracking information.',
        link: 'https://www.bikey.app/#/landing',
    },
    {
        iconUrl: snapgram,
        theme: 'btn-back-pink',
        name: 'Telliou',
        description: 'Virtual and programatic call centers automated designed for small business.',
        link: 'https://www.telliou.com/',
    },
    {
        iconUrl: estate,
        theme: 'btn-back-black',
        name: 'Houndter',
        description: 'Scraping tool for data analysis on social media.',
        link: 'https://houndter.com/',
    }
];