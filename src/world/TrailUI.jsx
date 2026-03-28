import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const stopContent = {
  1: {
    title: "Welcome to the Trail",
    subtitle: "Ride to explore my world",
    body: "Use WASD or arrow keys to ride (touch drag on mobile). Discover my work, projects, and passions along the trail.",
    link: null,
    emoji: "🚴",
  },
  2: {
    title: "About Me",
    subtitle: "The Campsite",
    body: "Senior Full-Stack Engineer with 12+ years building scalable web apps, SaaS platforms, and AI-powered products. Python, Node.js, React, AWS.",
    link: "/about",
    linkLabel: "Read more about me",
    emoji: "🏕️",
  },
  3: {
    title: "Projects",
    subtitle: "The Lake",
    body: "From AI-first startups to IoT art installations — explore the things I've built across industries and technologies.",
    link: "/projects",
    linkLabel: "View all projects",
    emoji: "🌊",
  },
  4: {
    title: "Skills & Experience",
    subtitle: "The Climbing Wall",
    body: "Python, JavaScript, AWS, AI/ML, React, Node.js, Docker — 12+ years climbing the stack from hardware to cloud.",
    link: "/about",
    linkLabel: "See full experience",
    emoji: "🧗",
  },
  5: {
    title: "Let's Connect",
    subtitle: "The Summit",
    body: "Reached the top! Whether it's a collaboration, opportunity, or just to say hello — I'd love to hear from you.",
    link: "/contact",
    linkLabel: "Get in touch",
    emoji: "⛰️",
  },
};

export default function TrailUI({ currentStage, isMobile }) {
  const [visible, setVisible] = useState(false);
  const [displayStage, setDisplayStage] = useState(null);

  useEffect(() => {
    if (currentStage) {
      setDisplayStage(currentStage);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [currentStage]);

  const content = displayStage ? stopContent[displayStage] : null;

  return (
    <>
      {/* Controls hint — always visible, fades after first move */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[2] pointer-events-none">
        <div className="bg-black/20 backdrop-blur-sm text-white/80 px-4 py-2 rounded-full text-xs sm:text-sm">
          {isMobile ? "Swipe to ride" : "WASD / Arrow keys to ride"}
        </div>
      </div>

      {/* Stop content overlay */}
      <div
        className={`absolute top-20 sm:top-28 left-0 right-0 z-[1] flex items-center justify-center transition-all duration-500 ${
          visible && content ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-white/60 backdrop-blur-sm max-w-xs sm:max-w-md mx-4 rounded-2xl shadow-lg p-4 sm:p-6 border border-white/30">
          <div className="text-3xl mb-2">{content?.emoji}</div>
          <p className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-1">
            {content?.subtitle}
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {content?.title}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {content?.body}
          </p>
          {content?.link && (
            <Link
              to={content.link}
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {content.linkLabel} →
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
