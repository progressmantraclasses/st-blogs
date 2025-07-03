import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ImpactTrackingScreen = () => {
  // Sample data for impact tracking
  const impactData = [
    { name: 'Food Drive', mealsServed: 500, wasteCollected: 200 },
    { name: 'Clean-Up Campaign', mealsServed: 0, wasteCollected: 1500 },
    { name: 'Blood Donation', mealsServed: 300, wasteCollected: 50 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Impact Tracking</h1>

        {/* Real-Time Data Visualization */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Event Impact Overview</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impactData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="mealsServed" fill="#3b82f6" name="Meals Served" />
                <Bar dataKey="wasteCollected" fill="#10b981" name="Waste Collected (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Event Reports</h2>
          <div className="space-y-4">
            {impactData.map((event, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700">{event.name}</h3>
                <p className="text-gray-600">Meals Served: {event.mealsServed}</p>
                <p className="text-gray-600">Waste Collected: {event.wasteCollected} kg</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactTrackingScreen;