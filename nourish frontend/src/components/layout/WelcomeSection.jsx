import React from 'react';

const WelcomeSection = ({ user, weekInfo }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">
        Good {getGreeting()}, {user?.name || "Chef"}! 👋
      </h2>
      <p className="text-gray-600">
        Ready to nourish your body with today's personalized meal plan?
      </p>
      {weekInfo && (
        <p className="text-sm text-gray-500 mt-1">
          Week {weekInfo.weekOfMonth} of {new Date(weekInfo.startDate).toLocaleDateString('en-US', { month: 'long' })} • {weekInfo.optionName}
        </p>
      )}
    </div>
  );
};

export default WelcomeSection;