import React from 'react';
import { CheckCircle, AlertCircle, Info, Code, List, Hash } from 'lucide-react';

const FormattedAIResponse = ({ content }) => {
  // Parse markdown-like formatting
  const parseContent = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let currentList = [];
    let currentCodeBlock = null;
    let codeLines = [];

    lines.forEach((line, idx) => {
      // Code block
      if (line.trim().startsWith('```')) {
        if (currentCodeBlock) {
          // End code block
          elements.push(
            <div key={`code-${idx}`} className="my-4 rounded-xl bg-black/40 border border-purple-500/30 overflow-hidden">
              <div className="px-4 py-2 bg-purple-500/10 border-b border-purple-500/30 flex items-center gap-2 text-xs text-purple-300">
                <Code className="w-4 h-4" />
                {currentCodeBlock}
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-gray-200">
                <code>{codeLines.join('\n')}</code>
              </pre>
            </div>
          );
          currentCodeBlock = null;
          codeLines = [];
        } else {
          // Start code block
          currentCodeBlock = line.replace(/```/g, '').trim() || 'code';
        }
        return;
      }

      if (currentCodeBlock) {
        codeLines.push(line);
        return;
      }

      // Flush current list if needed
      if (!line.trim().startsWith('-') && !line.trim().startsWith('•') && !line.trim().match(/^\d+\./) && currentList.length > 0) {
        elements.push(
          <ul key={`list-${idx}`} className="my-3 space-y-2">
            {currentList.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-200">
                <CheckCircle className="w-4 h-4 mt-1 text-cyan-400 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }

      // Heading (##)
      if (line.trim().startsWith('##')) {
        elements.push(
          <h3 key={idx} className="text-xl font-bold mt-6 mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-2">
            <Hash className="w-5 h-5 text-cyan-400" />
            {line.replace(/##/g, '').trim()}
          </h3>
        );
        return;
      }

      // Heading (#)
      if (line.trim().startsWith('#')) {
        elements.push(
          <h2 key={idx} className="text-2xl font-bold mt-6 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            {line.replace(/#/g, '').trim()}
          </h2>
        );
        return;
      }

      // Bullet list
      if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
        currentList.push(line.replace(/^[-•]\s*/, '').trim());
        return;
      }

      // Numbered list
      if (line.trim().match(/^\d+\./)) {
        currentList.push(line.replace(/^\d+\.\s*/, '').trim());
        return;
      }

      // Bold text (**text**)
      if (line.includes('**')) {
        const formatted = line.split('**').map((part, i) => 
          i % 2 === 1 ? <strong key={i} className="font-bold text-purple-300">{part}</strong> : part
        );
        elements.push(<p key={idx} className="my-2 text-gray-200">{formatted}</p>);
        return;
      }

      // Info blocks (starts with specific keywords)
      if (line.trim().startsWith('IMPORTANT:') || line.trim().startsWith('Note:') || line.trim().startsWith('⚠')) {
        elements.push(
          <div key={idx} className="my-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-200">{line.replace(/^(IMPORTANT:|Note:|⚠)\s*/, '')}</p>
          </div>
        );
        return;
      }

      // Regular paragraph
      if (line.trim()) {
        elements.push(<p key={idx} className="my-2 text-gray-200 leading-relaxed">{line}</p>);
      }
    });

    // Flush remaining list
    if (currentList.length > 0) {
      elements.push(
        <ul key="list-final" className="my-3 space-y-2">
          {currentList.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-200">
              <CheckCircle className="w-4 h-4 mt-1 text-cyan-400 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    return elements;
  };

  return (
    <div className="formatted-ai-response">
      {parseContent(content)}
    </div>
  );
};

export default FormattedAIResponse;
