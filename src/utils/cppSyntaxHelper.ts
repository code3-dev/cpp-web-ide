interface CppSnippet {
  prefix: string;
  body: string[];
  description: string;
}

export const cppSnippets: { [key: string]: CppSnippet } = {
  'cout': {
    prefix: 'cout',
    body: ['cout << ${1:message} << endl;'],
    description: 'Print to console'
  },
  'cin': {
    prefix: 'cin',
    body: ['cin >> ${1:variable};'],
    description: 'Read from console'
  },
  'for': {
    prefix: 'for',
    body: [
      'for (int ${1:i} = 0; ${1:i} < ${2:size}; ${1:i}++) {',
      '    ${3:// code}',
      '}'
    ],
    description: 'For loop'
  },
  'while': {
    prefix: 'while',
    body: [
      'while (${1:condition}) {',
      '    ${2:// code}',
      '}'
    ],
    description: 'While loop'
  },
  'if': {
    prefix: 'if',
    body: [
      'if (${1:condition}) {',
      '    ${2:// code}',
      '}'
    ],
    description: 'If statement'
  },
  'class': {
    prefix: 'class',
    body: [
      'class ${1:ClassName} {',
      'public:',
      '    ${1:ClassName}() {}',
      '    ~${1:ClassName}() {}',
      '',
      'private:',
      '    ${2:// members}',
      '};'
    ],
    description: 'Class definition'
  },
  'vector': {
    prefix: 'vector',
    body: ['vector<${1:int}> ${2:vec};'],
    description: 'Vector container'
  },
  'main': {
    prefix: 'main',
    body: [
      '#include <iostream>',
      '',
      'int main() {',
      '    ${1:// code}',
      '    return 0;',
      '}'
    ],
    description: 'Main function'
  }
};

export const cppKeywords = [
  'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
  'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if',
  'int', 'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static',
  'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while',
  'class', 'namespace', 'try', 'catch', 'throw', 'template', 'typename', 'virtual',
  'public', 'private', 'protected', 'friend', 'using', 'new', 'delete', 'this',
  'operator', 'explicit', 'inline', 'mutable', 'export', 'bool', 'true', 'false',
  'nullptr', 'constexpr', 'static_assert', 'thread_local', 'alignas', 'alignof',
  'char16_t', 'char32_t', 'decltype', 'noexcept', 'override', 'final'
];

export const cppStdLib = [
  // Basic I/O and strings
  'iostream', 'string', 'fstream', 'sstream', 'iomanip',
  // Containers
  'vector', 'map', 'set', 'queue', 'stack', 'deque', 'list', 'array',
  // Algorithms and utilities
  'algorithm', 'numeric', 'utility', 'functional',
  // Memory management
  'memory',
  // C standard library wrappers
  'cstdlib', 'cstring', 'cmath', 'ctime', 'cassert',
  // Additional utilities
  'random', 'regex', 'stdexcept', 'exception'
];

export const getCompletionItems = (prefix: string) => {
  const items = [];
  
  // Check snippets
  for (const [key, snippet] of Object.entries(cppSnippets)) {
    if (key.toLowerCase().startsWith(prefix.toLowerCase())) {
      items.push({
        label: key,
        kind: 'snippet',
        detail: snippet.description,
        insertText: snippet.body.join('\n')
      });
    }
  }
  
  // Check keywords
  for (const keyword of cppKeywords) {
    if (keyword.startsWith(prefix.toLowerCase())) {
      items.push({
        label: keyword,
        kind: 'keyword',
        insertText: keyword
      });
    }
  }
  
  // Check stdlib
  for (const lib of cppStdLib) {
    if (lib.startsWith(prefix.toLowerCase())) {
      items.push({
        label: lib,
        kind: 'module',
        insertText: `#include <${lib}>`
      });
    }
  }
  
  return items;
}; 