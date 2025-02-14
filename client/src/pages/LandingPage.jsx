import React from "react";
import { Button } from "@/components/ui/button";
import { FaMapMarkerAlt, FaShieldAlt, FaUsers, FaExclamationTriangle } from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Smart Security Management</h1>
        <p className="mt-4 text-lg text-gray-600">
          Enhancing urban security through real-time tracking, verification, and incident management.
        </p>
      </header>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<FaShieldAlt className="text-blue-600 text-4xl" />} 
          title="Security Guard Database" 
          description="Maintain structured records of all security personnel and track their deployment history." 
        />
        <FeatureCard 
          icon={<FaMapMarkerAlt className="text-green-600 text-4xl" />} 
          title="Live Guard Tracking" 
          description="Monitor on-duty guards in real-time with interactive maps and geofencing alerts." 
        />
        <FeatureCard 
          icon={<FaUsers className="text-yellow-600 text-4xl" />} 
          title="Multi-Level Access" 
          description="Grant role-based access to admins, police, and community members." 
        />
        <FeatureCard 
          icon={<FaExclamationTriangle className="text-red-600 text-4xl" />} 
          title="Incident Reporting" 
          description="Enable users to report security issues and alert the nearest security personnel." 
        />
      </section>

      <div className="mt-10">
        <Button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700">
          Get Started
        </Button>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-center flex flex-col items-center">
      {icon}
      <h3 className="text-xl font-semibold mt-4">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
};

export default LandingPage;
