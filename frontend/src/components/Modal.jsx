import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, children }) => {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Close modal when clicking on backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.target.closest('.fixed.inset-0')) { //here we are comparing with the class name of backdrop so that only when we click on backdrop it will close the modal
      onClose();
    }
  };

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      {/* Backdrop with opacity */}
      <div className="fixed inset-0 bg-black opacity-50"></div>
      
      {/* Modal content */}
      <div className="absolute top-[40%] right-[50%] translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] border border-[#333] p-6 rounded-lg z-10 w-[90%] max-w-md shadow-xl">
        {/* Close button */}
        <div className="absolute top-2 right-2 hover:scale-100">
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-[#333] hover:text-2xl focus:outline-none"
            aria-label="Close modal"
          >
            <FaTimes size={16} className='hover:scale-110 transition-all hover:rotate-90' />
          </button>
        </div>
        
        {/* Modal content */}
        <div className="mt-2 text-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;