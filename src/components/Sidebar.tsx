import { 
  FolderIcon, 
  QuestionMarkCircleIcon, 
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const topTabs = [
    { id: 'explorer', icon: FolderIcon, title: 'Explorer' },
  ];

  const bottomTabs = [
    { id: 'help', icon: QuestionMarkCircleIcon, title: 'Help' },
    { id: 'about', icon: InformationCircleIcon, title: 'About' },
  ];

  const renderTab = (tab: { id: string; icon: any; title: string }) => {
    const Icon = tab.icon;
    return (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`p-3 hover:bg-[#2d2d2d] rounded-lg mb-2 group relative transition-colors duration-200 ${
          activeTab === tab.id ? 'bg-[#37373d]' : ''
        }`}
        title={tab.title}
      >
        <Icon
          className={`w-6 h-6 transition-colors duration-200 ${
            activeTab === tab.id ? 'text-white' : 'text-gray-400'
          }`}
        />
        <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 shadow-lg">
          {tab.title}
        </div>
      </button>
    );
  };

  return (
    <div className="w-16 bg-[#252526] flex flex-col items-center py-2 border-r border-[#1e1e1e] h-full justify-between">
      <div className="flex flex-col items-center">
        {topTabs.map(renderTab)}
      </div>
      <div className="flex flex-col items-center">
        {bottomTabs.map(renderTab)}
      </div>
    </div>
  );
}; 