import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Map, Settings, Menu, LucideIcon } from 'lucide-react';

interface NavigationItem {
  name: string;
  icon: React.ReactElement<LucideIcon>;
  onClick: () => void;
}

interface NavigationProps {
  room: string;
}

const Navigation: React.FC<NavigationProps> = ({ room }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const navigationItems: NavigationItem[] = [
    {
      name: 'Home',
      icon: <Home className="w-5 h-5" />,
      onClick: () => navigate(`/room/${room}`)
    },
    {
      name: 'Map',
      icon: <Map className="w-5 h-5" />,
      onClick: () => navigate(`/room/${room}/map`)
    },
    {
      name: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      onClick: () => navigate(`/room/${room}/settings`)
    }
  ];

  const DesktopSidebar: React.FC = () => (
    <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-gray-200 min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Room Dashboard</h2>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={item.onClick}
                className="flex items-center w-full px-4 py-3 hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
              >
                <span className="text-gray-400 group-hover:text-white transition-colors duration-200">
                  {item.icon}
                </span>
                <span className="ml-3 font-medium group-hover:text-white transition-colors duration-200">
                  {item.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );

  const MobileFooter: React.FC = () => (
    <div className="md:hidden">
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-800 text-white"
        aria-label="Toggle mobile menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <nav 
        className={`fixed bottom-0 left-0 right-0 bg-gray-800 text-gray-200 shadow-lg z-40 transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <ul className="flex justify-around items-center p-4">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => {
                  item.onClick();
                  setIsMobileMenuOpen(false);
                }}
                className="flex flex-col items-center p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <span className="text-gray-400">{item.icon}</span>
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileFooter />
    </>
  );
};

export default Navigation;