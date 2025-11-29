import React, { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { 
  FaBars, 
  FaTimes, 
  FaTachometerAlt, 
  FaList, 
  FaBox, 
  FaClipboardList, 
  FaUsers, 
  FaShoppingCart 
} from 'react-icons/fa'

const AdminMenu = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu on route change
  const handleLinkClick = () => {
    setMenuOpen(false);
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
    { name: 'Categories', path: '/admin/categorylist', icon: FaList },
    { name: 'Create Product', path: '/admin/productlist', icon: FaBox },
    { name: 'All Products', path: '/admin/allproductslist', icon: FaClipboardList },
    { name: 'Users', path: '/admin/userlist', icon: FaUsers },
    { name: 'Orders', path: '/admin/orderlist', icon: FaShoppingCart },
  ];

  return (
    <div className="fixed top-4 right-4 z-[9998]" ref={menuRef}>
      {/* Menu Toggle Button */}
      <button
        onClick={toggleMenu}
        className="bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white p-3 rounded-lg shadow-lg hover:from-[#ff5c92] hover:to-[#ff7a99] transition-all duration-200 flex items-center space-x-2"
      >
        {isMenuOpen ? (
          <>
            <FaTimes size={20} />
            {/* <span className="font-medium">Close</span> */}
          </>
        ) : (
          <>
            <FaBars size={20} />
            {/* <span className="font-medium">Admin Menu</span> */}
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute top-14 right-0 w-64 bg-[#1e1e1e] rounded-lg shadow-2xl border border-[#333] overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'opacity-100 transform translate-y-0 visible' 
            : 'opacity-0 transform -translate-y-4 invisible'
        }`}
      >
        <div className="py-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-white hover:bg-[#2a2a2a] transition-colors duration-200 border-l-4 ${
                  isActive
                    ? 'bg-[#2a2a2a] border-l-[#ff6b9d] text-[#ff6b9d]'
                    : 'border-l-transparent hover:border-l-[#ff6b9d]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`mr-3 ${isActive ? 'text-[#ff6b9d]' : 'text-gray-400'}`}
                    size={18}
                  />
                  <span className={`font-medium ${isActive ? 'text-[#ff6b9d]' : ''}`}>
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Backdrop overlay for mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 -z-10 lg:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </div>
  )
}

export default AdminMenu