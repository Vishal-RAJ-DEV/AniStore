import React from 'react';
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const Message = ({ variant = 'info', children }) => {
  // Define styling configurations for each variant
  const getStyles = () => {
    switch (variant) {
      case 'success':
        return {
          containerClass: 'bg-green-50 border border-green-200 text-green-800',
          iconComponent: <FaCheckCircle className="h-5 w-5 text-green-500" />,
          headingText: 'Success'
        };
      case 'error':
        return {
          containerClass: 'bg-red-50 border border-red-200 text-red-800',
          iconComponent: <FaExclamationTriangle className="h-5 w-5 text-red-500" />,
          headingText: 'Error'
        };
      case 'info':
      default:
        return {
          containerClass: 'bg-blue-50 border border-blue-200 text-blue-800',
          iconComponent: <FaInfoCircle className="h-5 w-5 text-blue-500" />,
          headingText: 'Information'
        };
    }
  };

  const { containerClass, iconComponent, headingText } = getStyles();

  return (
    <div className={`rounded-md p-4 mb-4 ${containerClass}`}>
      <div className="flex">
        <div className="flex-shrink-0">{iconComponent}</div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">{headingText}</h3>
          <div className="mt-2 text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Message;