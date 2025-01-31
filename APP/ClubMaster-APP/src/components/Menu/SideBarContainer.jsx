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
    <div ref={sidebarRef} className="relative"> 
      {!isSidebarOpen && (
        <SidebarSmall onMenuClick={toggleSidebar} isSmall={!isSidebarOpen} />
      )}
      
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {isSidebarOpen && <Sidebar onClose={closeSidebar} />}
      </div>
    </div>
  );
}

export default SidebarContainer;
