import { ChevronRightIcon, FolderIcon, DocumentIcon } from '@heroicons/react/24/outline';

export const Explorer = () => {
  return (
    <div className="h-full bg-[#252526] flex flex-col">
      <div className="flex-shrink-0 p-2 text-[#cccccc] text-xs uppercase font-semibold border-b border-[#1e1e1e]">
        Explorer
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="flex items-center text-[#cccccc] hover:bg-[#37373d] p-1 rounded cursor-pointer">
            <ChevronRightIcon className="h-4 w-4 transform rotate-90" />
            <FolderIcon className="h-4 w-4 mx-1" />
            <span className="text-sm">cpp_gui</span>
          </div>
          <div className="ml-4">
            <div className="flex items-center text-[#cccccc] hover:bg-[#37373d] p-1 rounded cursor-pointer">
              <FolderIcon className="h-4 w-4 mx-1" />
              <span className="text-sm">src</span>
            </div>
            <div className="ml-4">
              <div className="flex items-center text-[#cccccc] hover:bg-[#37373d] p-1 rounded cursor-pointer">
                <DocumentIcon className="h-4 w-4 mx-1" />
                <span className="text-sm">main.cpp</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 