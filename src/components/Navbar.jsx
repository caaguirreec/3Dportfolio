import { NavLink } from "react-router-dom";
import { useState } from "react";
import { logo } from "../assets/images";

const Navbar = () => {
  const [isVerticalMenuOpen, setIsVerticalMenuOpen] = useState(false);

  const toggleVerticalMenu = () => {
    setIsVerticalMenuOpen(!isVerticalMenuOpen);
  };

  return (
    <header className='header relative z-[99999]'>
      <div className="flex items-center w-full">
        {/* Vertical Menu Toggle Button */}
        <button 
          onClick={toggleVerticalMenu}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
        </button>

        <NavLink to='/' className="ml-2">
          <img src={logo} alt='logo' className='w-18 h-18 object-contain' />
        </NavLink>
        
        {/* Horizontal Menu */}
        <nav className='flex text-lg gap-7 font-medium ml-auto'>
          <NavLink to='/about' className={({ isActive }) => isActive ? "text-blue-600" : "text-black" }>
            About
          </NavLink>
          <NavLink to='/projects' className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>
            Projects
          </NavLink>
          <NavLink to='/traveling' className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>
            Traveling
          </NavLink>

        </nav>
      </div>

      {/* Vertical Menu */}
      {isVerticalMenuOpen && (
        <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-[99999]">
          <NavLink 
            to="/bikepackingame" 
            className={({ isActive }) => 
              `block px-4 py-2 text-gray-800 hover:bg-blue-50 transition-colors ${
                isActive ? "text-blue-600 bg-blue-50" : ""
              }`
            }
            onClick={() => setIsVerticalMenuOpen(false)}
          >
            Bikepacking Game
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => 
              `block px-4 py-2 text-gray-800 hover:bg-blue-50 transition-colors ${
                isActive ? "text-blue-600 bg-blue-50" : ""
              }`
            }
            onClick={() => setIsVerticalMenuOpen(false)}
          >
            Contact
          </NavLink>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `block px-4 py-2 text-gray-800 hover:bg-blue-50 transition-colors ${
                isActive ? "text-blue-600 bg-blue-50" : ""
              }`
            }
            onClick={() => setIsVerticalMenuOpen(false)}
          >
            Home
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Navbar;
