import { useState, useEffect } from 'react';
import { FileSearch, Brain, CheckCircle, Activity } from 'lucide-react';

function LoadingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: FileSearch, text: 'Parsing policy document...', duration: 1000 },
    { icon: Brain, text: 'Analyzing clauses with AI...', duration: 1500 },
    { icon: Activity, text: 'Simulating 20 medical scenarios...', duration: 1000 },
    { icon: CheckCircle, text: 'Generating your report card...', duration: 500 }
  ];

  useEffect(() => {
    let totalTime = 0;
    steps.forEach((step, index) => {
      totalTime += step.duration;
      setTimeout(() => {
        setCurrentStep(index + 1);
      }, totalTime);
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        {/* Animated Shield Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
              <Activity className="w-12 h-12 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full opacity-25 animate-ping"></div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Analyzing Your Policy
        </h2>

        {/* Progress Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = currentStep > index;
            const isCurrent = currentStep === index;

            return (
              <div
                key={index}
                className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${
                  isCompleted
                    ? 'bg-green-50 border-2 border-green-300'
                    : isCurrent
                    ? 'bg-cyan-50 border-2 border-cyan-400 shadow-lg scale-105'
                    : 'bg-white border-2 border-gray-200 opacity-50'
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-500'
                    : isCurrent
                    ? 'bg-cyan-500 animate-pulse'
                    : 'bg-gray-300'
                }`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1">
                  <p className={`font-medium ${
                    isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.text}
                  </p>
                </div>

                {isCompleted && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
                
                {isCurrent && (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            {currentStep} of {steps.length} steps completed
          </p>
        </div>

        {/* Fun Fact */}
        <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">💡 Did you know?</span> 68% of Indians never read their full policy document
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoadingPage;
