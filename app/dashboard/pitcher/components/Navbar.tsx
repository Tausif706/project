'use client';
import { 
  LightBulbIcon,
  ChatBubbleLeftIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const navItems = [
    { id: 'ideas', name: 'My Ideas', icon: LightBulbIcon },
    { id: 'chat', name: 'Team Chat', icon: ChatBubbleLeftIcon },
    { id: 'tasks', name: 'Task Board', icon: ClipboardDocumentCheckIcon },
    { id: 'collaborators', name: 'Find Collaborators', icon: UserGroupIcon },
    { id: 'find-professionals', name: 'Find Professionals', icon: UserGroupIcon },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              IdeaCraft
            </span>
            <div className="hidden md:flex md:ml-10 md:space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-3 py-2 transition-colors ${
                    activeTab === item.id 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}