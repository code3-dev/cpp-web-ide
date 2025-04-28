import { 
  Bars3Icon, 
  DocumentArrowDownIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon
} from '@heroicons/react/24/solid';

interface HeaderProps {
  onToggleExplorer: () => void;
  onSave: () => void;
  saveStatus: 'saved' | 'saving' | null;
  fontSize: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleExplorer, 
  onSave, 
  saveStatus,
  fontSize,
  onZoomIn,
  onZoomOut
}) => {
  return (
    <div className="h-12 bg-[#1e1e1e] border-b border-[#2d2d2d] flex items-center justify-between px-2 select-none">
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleExplorer}
          className="p-2 hover:bg-[#2d2d2d] rounded-md"
          title="Toggle Explorer"
        >
          <Bars3Icon className="h-5 w-5 text-[#cccccc]" />
        </button>
        <button
          onClick={onSave}
          className="p-2 hover:bg-[#2d2d2d] rounded-md flex items-center space-x-1"
          title="Save File (Ctrl+S)"
        >
          <DocumentArrowDownIcon className="h-5 w-5 text-[#cccccc]" />
          {saveStatus && (
            <span className={`text-xs ${saveStatus === 'saved' ? 'text-green-500' : 'text-gray-400'}`}>
              {saveStatus === 'saving' ? 'Saving...' : 'Saved'}
            </span>
          )}
        </button>
        <div className="flex items-center space-x-1 ml-2 border-l border-[#2d2d2d] pl-2">
          <button
            onClick={onZoomOut}
            className="p-2 hover:bg-[#2d2d2d] rounded-md"
            title="Zoom Out (Ctrl+-)"
          >
            <MagnifyingGlassMinusIcon className="h-4 w-4 text-[#cccccc]" />
          </button>
          <span className="text-xs text-[#cccccc] min-w-[2rem] text-center">
            {fontSize}px
          </span>
          <button
            onClick={onZoomIn}
            className="p-2 hover:bg-[#2d2d2d] rounded-md"
            title="Zoom In (Ctrl++)"
          >
            <MagnifyingGlassPlusIcon className="h-4 w-4 text-[#cccccc]" />
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-4 text-[#cccccc] text-sm">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>C++</span>
        </div>
        <span>UTF-8</span>
        <span>LF</span>
        <span className="text-[#666]">|</span>
        <span title="Line:Column">Ln 1, Col 1</span>
      </div>
    </div>
  );
}; 