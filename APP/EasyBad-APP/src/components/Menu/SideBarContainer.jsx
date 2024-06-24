import { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import SidebarSmall from './SidebarSmall';

function SidebarContainer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  return (
    <div ref={sidebarRef}> 
      <SidebarSmall onMenuClick={toggleSidebar} isSmall={!isSidebarOpen} /> 
      {isSidebarOpen && <Sidebar onClose={closeSidebar} />} 
    </div>
  );
}

export default SidebarContainer;
