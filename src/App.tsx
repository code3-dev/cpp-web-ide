import { useState, useEffect } from 'react'
import { Editor } from './components/Editor'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { Explorer } from './components/Explorer'
import { Splash } from './components/Splash'
import './App.css'

const DEFAULT_CODE = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, Web IDE!" << endl;
    return 0;
}`

const STORAGE_KEY = 'web-ide-code'
const FONT_SIZE_KEY = 'web-ide-font-size'

function App() {
  const [code, setCode] = useState(() => {
    const savedCode = localStorage.getItem(STORAGE_KEY)
    return savedCode || DEFAULT_CODE
  })
  const [activeTab, setActiveTab] = useState('explorer')
  const [showExplorer, setShowExplorer] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | null>(null)
  const [fontSize, setFontSize] = useState(() => {
    const savedSize = localStorage.getItem(FONT_SIZE_KEY)
    return savedSize ? parseInt(savedSize, 10) : 14
  })
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, code)
  }, [code])

  useEffect(() => {
    localStorage.setItem(FONT_SIZE_KEY, fontSize.toString())
  }, [fontSize])

  const handleSave = async () => {
    try {
      setSaveStatus('saving')
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, code)
      
      // Create a Blob with the code content
      const blob = new Blob([code], { type: 'text/plain' })
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'main.cpp'
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(null), 2000)
    } catch (error) {
      console.error('Error saving file:', error)
      setSaveStatus(null)
    }
  }

  // Add keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [code])

  const handleZoomChange = (newSize: number) => {
    setFontSize(newSize)
  }

  const explorerWidth = 240

  const renderContent = () => {
    switch (activeTab) {
      case 'explorer':
        return showExplorer && (
          <div style={{ width: explorerWidth }} className="h-full border-r border-[#2d2d2d]">
            <Explorer />
          </div>
        )
      case 'help':
        return showExplorer && (
          <div style={{ width: explorerWidth }} className="h-full border-r border-[#2d2d2d] text-gray-300 p-4 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Help</h2>
            <div className="space-y-4">
              <section>
                <h3 className="text-lg font-medium mb-2">Keyboard Shortcuts</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Save to File</span>
                    <div className="flex items-center space-x-2">
                      <kbd className="px-2 py-1 bg-[#37373d] rounded">Ctrl + S</kbd>
                      <span className="text-xs text-gray-400">(Downloads main.cpp)</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Format Code</span>
                    <kbd className="px-2 py-1 bg-[#37373d] rounded">Ctrl + Shift + F</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Undo</span>
                    <kbd className="px-2 py-1 bg-[#37373d] rounded">Ctrl + Z</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Redo</span>
                    <div className="flex items-center space-x-2">
                      <kbd className="px-2 py-1 bg-[#37373d] rounded">Ctrl + Y</kbd>
                      <span className="text-gray-400">or</span>
                      <kbd className="px-2 py-1 bg-[#37373d] rounded">Ctrl + Shift + Z</kbd>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Zoom In</span>
                    <div className="flex items-center space-x-2">
                      <kbd className="px-2 py-1 bg-[#37373d] rounded">Ctrl + +</kbd>
                      <span className="text-gray-400">or</span>
                      <kbd className="px-2 py-1 bg-[#37373d] rounded">Ctrl + =</kbd>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Zoom Out</span>
                    <div className="flex items-center space-x-2">
                      <kbd className="px-2 py-1 bg-[#37373d] rounded">Ctrl + -</kbd>
                      <span className="text-gray-400">or</span>
                      <kbd className="px-2 py-1 bg-[#37373d] rounded">Ctrl + _</kbd>
                    </div>
                  </div>
                </div>
              </section>
              <section>
                <h3 className="text-lg font-medium mb-2">Features</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>C++ Code Editor with Syntax Highlighting</li>
                  <li>Auto-save to Browser Storage</li>
                  <li>Save to File (main.cpp)</li>
                  <li>Code Formatting</li>
                  <li>File Explorer</li>
                  <li>Adjustable Font Size</li>
                </ul>
              </section>
            </div>
          </div>
        )
      case 'about':
        return showExplorer && (
          <div style={{ width: explorerWidth }} className="h-full border-r border-[#2d2d2d] text-gray-300 p-4 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <div className="space-y-4">
              <section className="flex flex-col items-center mb-6">
                <div className="relative">
                  <svg 
                    className="w-16 h-16 text-blue-500"
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M12,8L10.67,8.09C9.81,7.07 7.4,4.5 5,4.5C5,4.5 3.03,7.46 4.96,11.41C4.41,12.24 4.07,12.67 4,13.66L2.07,13.95L2.28,14.93L4.04,14.67L4.18,15.38L2.61,16.32L3.08,17.21L4.53,16.32C5.68,18.76 8.59,20 12,20C15.41,20 18.32,18.76 19.47,16.32L20.92,17.21L21.39,16.32L19.82,15.38L19.96,14.67L21.72,14.93L21.93,13.95L20,13.66C19.93,12.67 19.59,12.24 19.04,11.41C20.97,7.46 19,4.5 19,4.5C16.6,4.5 14.19,7.07 13.33,8.09L12,8M9,11A1,1 0 0,1 10,12A1,1 0 0,1 9,13A1,1 0 0,1 8,12A1,1 0 0,1 9,11M15,11A1,1 0 0,1 16,12A1,1 0 0,1 15,13A1,1 0 0,1 14,12A1,1 0 0,1 15,11M11,14H13L12.3,15.39C12.5,16.03 13.06,16.5 13.75,16.5A1.5,1.5 0 0,0 15.25,15H15.75A2,2 0 0,1 13.75,17C13,17 12.35,16.59 12,16V16H12C11.65,16.59 11,17 10.25,17A2,2 0 0,1 8.25,15H8.75A1.5,1.5 0 0,0 10.25,16.5C10.94,16.5 11.5,16.03 11.7,15.39L11,14Z" />
                  </svg>
                  <div className="absolute inset-0 bg-blue-500 rounded-full filter blur-xl opacity-20"></div>
                </div>
              </section>
              <section>
                <h3 className="text-lg font-medium mb-2">Web IDE</h3>
                <p className="text-sm leading-relaxed">
                  A modern, lightweight C++ IDE for the web. Built with React and Monaco Editor,
                  this IDE provides a seamless development experience with features like syntax highlighting,
                  code formatting, and file management.
                </p>
              </section>
              <section>
                <h3 className="text-lg font-medium mb-2">Version</h3>
                <p className="text-sm">1.0.0</p>
              </section>
              <section>
                <h3 className="text-lg font-medium mb-2">Technologies</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>React</li>
                  <li>Monaco Editor</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                </ul>
              </section>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-[#1e1e1e] overflow-hidden">
      <Header 
        onToggleExplorer={() => setShowExplorer(!showExplorer)} 
        onSave={handleSave}
        saveStatus={saveStatus}
        fontSize={fontSize}
        onZoomIn={() => handleZoomChange(Math.min(fontSize + 1, 30))}
        onZoomOut={() => handleZoomChange(Math.max(fontSize - 1, 8))}
      />
      <div className="flex-1 flex min-h-0">
        <div className="flex h-full">
          <div className="h-full">
            <Sidebar 
              activeTab={activeTab} 
              onTabChange={(tab) => {
                if (tab === activeTab) {
                  setShowExplorer(!showExplorer)
                } else {
            setActiveTab(tab)
            setShowExplorer(true)
                }
              }} 
            />
            </div>
          {renderContent()}
        </div>
        <div className="flex-1 h-full">
              <Editor 
                onChange={setCode} 
            initialValue={code}
            fontSize={fontSize}
            onZoomChange={handleZoomChange}
              />
        </div>
      </div>
    </div>
  )
}

export default App
