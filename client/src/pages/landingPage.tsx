import React from 'react';
import {
  Users, AlertTriangle, Shield, Map, 
  Bell, UserCheck, Radio, Star, AlertCircle,
  ChevronDown, Filter, MoreVertical
} from 'lucide-react';

interface GuardStatus {
  onDuty: number;
  offDuty: number;
  onLeave: number;
  total: number;
}

interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  message: string;
  time: string;
  location: string;
}

const SecurityDashboard = () => {
//   const [activeView, setActiveView] = useState<'overview' | 'map'>('overview');
  
  const guardStatus: GuardStatus = {
    onDuty: 45,
    offDuty: 12,
    onLeave: 3,
    total: 60
  };

  const recentAlerts: Alert[] = [
    {
      id: '1',
      type: 'danger',
      message: 'Guard left designated area',
      time: '2 mins ago',
      location: 'Zone A'
    },
    {
      id: '2',
      type: 'warning',
      message: 'Missed check-in',
      time: '5 mins ago',
      location: 'Zone B'
    },
    {
      id: '3',
      type: 'info',
      message: 'New incident report filed',
      time: '10 mins ago',
      location: 'Zone C'
    }
  ];

  const StatusCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Dashboard</h1>
          <p className="text-gray-500">Real-time security monitoring and management</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Bell className="w-4 h-4 mr-2" />
            Alerts
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatusCard
          title="Guards On Duty"
          value={guardStatus.onDuty}
          icon={<UserCheck className="w-6 h-6 text-green-500" />}
          color="bg-green-100"
        />
        <StatusCard
          title="Active Incidents"
          value={3}
          icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
          color="bg-red-100"
        />
        <StatusCard
          title="Zones Monitored"
          value={8}
          icon={<Map className="w-6 h-6 text-blue-500" />}
          color="bg-blue-100"
        />
        <StatusCard
          title="Total Guards"
          value={guardStatus.total}
          icon={<Users className="w-6 h-6 text-purple-500" />}
          color="bg-purple-100"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Guard Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">Live Guard Tracking</h2>
            </div>
            <div className="p-6">
              <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Map Component Would Go Here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Alerts & Quick Actions */}
        <div className="space-y-8">
          {/* Recent Alerts */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">Recent Alerts</h2>
              <button className="text-blue-600 text-sm hover:text-blue-700">View All</button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentAlerts.map(alert => (
                  <div key={alert.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${
                      alert.type === 'danger' ? 'bg-red-100' :
                      alert.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <AlertCircle className={`w-4 h-4 ${
                        alert.type === 'danger' ? 'text-red-500' :
                        alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500">{alert.time}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-xs text-gray-500">{alert.location}</span>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <span className="ml-3 font-medium">Assign Guard</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <Radio className="w-5 h-5 text-blue-500" />
                    <span className="ml-3 font-medium">Broadcast Alert</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-blue-500" />
                    <span className="ml-3 font-medium">Review Reports</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;