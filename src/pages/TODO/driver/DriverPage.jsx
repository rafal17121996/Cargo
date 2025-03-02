import React from 'react';

function DriverHomePage() {
  const userData = JSON.parse(sessionStorage.getItem('userData')) || {};

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">
        Hello {userData.first_name} {userData.last_name}
      </h1>
    </div>
  );
}

export default DriverHomePage;