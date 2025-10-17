import React from 'react';

const WelcomeSection = ({ user, weekInfo }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  };

  return (
    <div className="mb-6 flex justify-center items-center ">
      <div className="flex-col items-center justify-between">
      <h2 className="text-3xl font-nunito font-bold text-gray-900 mb-1">
        Good {getGreeting()}, {user?.name || "Chef"}! 👋
      </h2>
      <p className="text-gray-600">
        Ready to nourish your body with today's personalized meal plan?
      </p>
      </div>
    </div>
  );
};

export default WelcomeSection;