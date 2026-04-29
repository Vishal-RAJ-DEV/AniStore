import React from 'react';

const ProgressStep = ({ currentStep = 1 }) => {
  const steps = [
    { id: 1, name: 'Add to Cart' },
    { id: 2, name: 'Shipping' },
    { id: 3, name: 'Place Order' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-16">
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isFuture = step.id > currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Step indicator */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-500 ease-in-out z-10
                    ${
                      isCompleted
                        ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)] scale-100'
                        : isCurrent
                        ? 'bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] border-transparent text-white shadow-[0_0_15px_rgba(255,107,157,0.5)] scale-110'
                        : 'bg-[#1a1a1a] border-gray-800 text-gray-500'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 stroke-current"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="font-bold text-sm sm:text-base">{step.id}</span>
                  )}
                </div>

                {/* Step label */}
                <div
                  className={`absolute top-14 sm:top-16 text-xs sm:text-sm whitespace-nowrap font-medium transition-colors duration-300
                    ${
                      isCompleted
                        ? 'text-green-500'
                        : isCurrent
                        ? 'text-[#ff6b9d] font-bold'
                        : 'text-gray-500'
                    }
                  `}
                >
                  {step.name}
                </div>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="flex-auto h-1 sm:h-1.5 mx-2 sm:mx-4 bg-[#1a1a1a] rounded-full relative z-0 border border-gray-800/50">
                  <div
                    className="absolute top-0 left-0 h-full bg-green-500/50 rounded-full transition-all duration-500 ease-in-out shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStep;
