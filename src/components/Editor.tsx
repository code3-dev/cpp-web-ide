/** @jsxImportSource @emotion/react */
import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useCallback, useState, useRef } from 'react';
import { formatCppCode } from '../utils/cppFormat';
import { getCompletionItems } from '../utils/cppSyntaxHelper';
import { css } from '@emotion/react';

interface EditorProps {
  onChange?: (value: string) => void;
  initialValue?: string;
  readOnly?: boolean;
  fontSize?: number;
  onZoomChange?: (fontSize: number) => void;
}

const editorWrapperStyle = css`
  width: 100%;
  height: 100%;
  position: relative;
  
  .monaco-editor {
    .suggest-widget {
      left: 50% !important;
      transform: translateX(-50%);
      
      .monaco-list .monaco-list-row {
        display: flex;
        align-items: center;
      }
      
      .details-view {
        left: 0 !important;
        width: 100% !important;
      }
    }
  }
`;

export const Editor: React.FC<EditorProps> = ({ 
  onChange, 
  initialValue = '', 
  readOnly = false,
  fontSize = 14,
  onZoomChange
}) => {
  const [value, setValue] = useState(initialValue);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Register C++ code formatter
    editor.addAction({
      id: 'format-cpp',
      label: 'Format C++ Code',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF
      ],
      run: () => {
        const formatted = formatCppCode(editor.getValue());
        editor.setValue(formatted);
      }
    });

    // Register undo/redo actions
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ, () => {
      editor.trigger('keyboard', 'undo');
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, () => {
      editor.trigger('keyboard', 'redo');
    });

    // Also add Ctrl+Shift+Z for redo (common alternative)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ, () => {
      editor.trigger('keyboard', 'redo');
    });

    // Register zoom in handlers (both Ctrl++ and Ctrl+=)
    const handleZoomIn = () => {
      const newSize = Math.min(fontSize + 1, 30);
      onZoomChange?.(newSize);
    };

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Equal, handleZoomIn);
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Equal, handleZoomIn);
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.NumpadAdd, handleZoomIn);

    // Register zoom out handlers (both Ctrl+- and Ctrl+_)
    const handleZoomOut = () => {
      const newSize = Math.max(fontSize - 1, 8);
      onZoomChange?.(newSize);
    };

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Minus, handleZoomOut);
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Minus, handleZoomOut);
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.NumpadSubtract, handleZoomOut);

    // Register completion provider
    monaco.languages.registerCompletionItemProvider('cpp', {
      provideCompletionItems: (model: any, position: any) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        });

        const word = textUntilPosition.trim().split(/\s+/).pop() || '';
        const suggestions = getCompletionItems(word);

        return {
          suggestions: suggestions.map((item: any) => ({
            ...item,
            kind: monaco.languages.CompletionItemKind[item.kind.toUpperCase()],
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: position.column - word.length,
              endColumn: position.column
            }
          }))
        };
      }
    });

    // Add hover provider for C++ keywords and stdlib
    monaco.languages.registerHoverProvider('cpp', {
      provideHover: (model: any, position: any) => {
        const word = model.getWordAtPosition(position);
        if (!word) return null;

        const suggestions = getCompletionItems(word.word);
        const suggestion = suggestions[0];

        if (suggestion) {
          return {
            contents: [
              { value: '**' + suggestion.label + '**' },
              { value: suggestion.detail || 'C++ ' + suggestion.kind }
            ]
          };
        }

        return null;
      }
    });
  };

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setValue(value);
      onChange?.(value);
    }
  }, [onChange]);

  return (
    <div css={editorWrapperStyle} className="h-full w-full">
      <MonacoEditor
        height="100%"
        defaultLanguage="cpp"
        theme="vs-dark"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: fontSize,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          renderLineHighlight: 'all',
          cursorStyle: 'line',
          automaticLayout: true,
          padding: { top: 10 },
          readOnly,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          overviewRulerLanes: 0,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          renderValidationDecorations: 'on',
          colorDecorators: true,
          bracketPairColorization: {
            enabled: true,
          },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          snippetSuggestions: 'inline',
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          tabCompletion: 'on',
          suggest: {
            insertMode: 'insert',
            snippetsPreventQuickSuggestions: false,
            showIcons: true,
            preview: true,
            previewMode: 'prefix',
            filterGraceful: true,
            localityBonus: true,
            shareSuggestSelections: true,
            showMethods: true,
            showFunctions: true,
            showConstructors: true,
            showFields: true,
            showVariables: true,
            showClasses: true,
            showStructs: true,
            showInterfaces: true,
            showModules: true,
            showProperties: true,
            showEvents: true,
            showOperators: true,
            showUnits: true,
            showValues: true,
            showConstants: true,
            showEnums: true,
            showEnumMembers: true,
            showKeywords: true,
            showWords: true,
            showColors: true,
            showFiles: true,
            showReferences: true,
            showFolders: true,
            showTypeParameters: true,
            showSnippets: true,
            showUsers: true,
            showIssues: true,
          },
          suggestSelection: 'first',
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true
          },
          suggestFontSize: fontSize,
          suggestLineHeight: Math.floor(fontSize * 1.4),
        }}
      />
    </div>
  );
}; 