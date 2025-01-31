import { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import SidebarSmall from './SidebarSmall';

function SidebarContainer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Timer pour éviter une fermeture trop rapide
  const hoverTimer = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar(); 
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef]);

  const handleMouseEnter = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
    }
    setIsHovering(true);
    setIsSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimer.current = setTimeout(() => {
      setIsHovering(false);
      setIsSidebarOpen(false);
    }, 300); // Délai de 300ms avant la fermeture
  };

  return (
    <div ref={sidebarRef} className="relative"> 
      {!isSidebarOpen && (
        <div 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <SidebarSmall onMenuClick={toggleSidebar} isSmall={!isSidebarOpen} />
        </div>
      )}
      
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isSidebarOpen && <Sidebar onClose={closeSidebar} />}
      </div>
    </div>
  );
}

export default SidebarContainer;
