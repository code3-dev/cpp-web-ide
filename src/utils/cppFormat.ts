interface FormatConfig {
  indentSize: number;
  maxLineLength: number;
  breakBeforeBrace: boolean;
  spaceBeforeParens: boolean;
  spaceInEmptyParens: boolean;
  spaceBeforeComma: boolean;
  spaceAfterComma: boolean;
  alignTrailingComments: boolean;
}

const defaultConfig: FormatConfig = {
  indentSize: 4,
  maxLineLength: 80,
  breakBeforeBrace: false,
  spaceBeforeParens: true,
  spaceInEmptyParens: false,
  spaceBeforeComma: false,
  spaceAfterComma: true,
  alignTrailingComments: true,
};

export const formatCppCode = (code: string, config: Partial<FormatConfig> = {}): string => {
  const options = { ...defaultConfig, ...config };
  const lines = code.split('\n');
  let formattedCode = '';
  let indentLevel = 0;
  
  const addIndent = (line: string) => ' '.repeat(options.indentSize * indentLevel) + line;

  const preserveStrings = (line: string): { parts: string[], strings: string[] } => {
    const strings: string[] = [];
    const parts = line.split(/("(?:[^"\\]|\\.)*")/);
    
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 1) { // This is a string
        strings.push(parts[i]);
        parts[i] = `__STRING_${Math.floor(i/2)}__`;
      }
    }
    
    return { parts, strings };
  };

  const restoreStrings = (line: string, strings: string[]): string => {
    let result = line;
    strings.forEach((str, i) => {
      result = result.replace(`__STRING_${i}__`, str);
    });
    return result;
  };
  
  const formatOperators = (line: string): string => {
    // Handle stream operators first
    line = line.replace(/\s*<<\s*/g, ' << ');
    line = line.replace(/\s*>>\s*/g, ' >> ');
    
    // Handle other operators
    const operators = ['=', '+', '-', '*', '/', '%', '&', '|', '^', '<', '>', '!'];
    operators.forEach(op => {
      if (op !== '<' && op !== '>') { // Skip < and > as they're handled for streams
        const regex = new RegExp(`\\s*\\${op}\\s*`, 'g');
        line = line.replace(regex, ` ${op} `);
      }
    });
    
    // Clean up spaces
    return line.replace(/\s+/g, ' ').trim();
  };

  const processLine = (line: string): string[] => {
    let result = line.trim();
    
    // Handle preprocessor directives
    if (result.startsWith('#')) {
      result = result.replace(/\s+/g, ' ');
      result = result.replace('#include < ', '#include <');
      result = result.replace(' >', '>');
      return [result];
    }

    // Preserve strings before formatting
    const { parts, strings } = preserveStrings(result);
    result = parts.join('');
    
    // Handle braces
    if (result.includes('{')) {
      indentLevel++;
    }
    
    if (result.includes('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Split multiple statements and handle return statements
    if (result.includes(';')) {
      const statements = result.split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt);
      
      return statements.map(stmt => {
        // Format each statement
        let formatted = formatOperators(stmt);
        // Restore strings
        formatted = restoreStrings(formatted, strings);
        return formatted + ';';
      });
    }
    
    // Format single statement
    result = formatOperators(result);
    // Restore strings
    result = restoreStrings(result, strings);
    
    return [result];
  };
  
  // Process each line
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Skip empty lines
    if (!line.trim()) {
      formattedCode += '\n';
      continue;
    }
    
    // Process and add the line
    const processedLines = processLine(line);
    for (let j = 0; j < processedLines.length; j++) {
      const processedLine = processedLines[j];
      if (processedLine) {
        // Always put return statements on a new line
        if (j > 0 && processedLine.trim().startsWith('return')) {
          formattedCode += '\n';
        }
        formattedCode += addIndent(processedLine) + '\n';
      }
    }
  }
  
  // Clean up extra newlines
  return formattedCode.trim().replace(/\n\s*\n\s*\n/g, '\n\n');
}; 