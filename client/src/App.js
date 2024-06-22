// frontend/src/App.js
import React, { useState } from 'react';
import './styles/App.css';
import CodeEditor from './components/CodeEditor';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable"
import Header from './components/Header';
import RightCol from './components/RightCol';
import { CODE_SNIPPETS } from './utils/constants';


function App() {
  const [code, setCode] = useState(CODE_SNIPPETS.python);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [executionTime, setExecutionTime] = useState();
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('python');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/runcode/' + language, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, input }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (result.status) {
        setOutput(result.data);
        setExecutionTime(result.executionTime + ' ms');
        setError('');
      } else {
        setOutput('');
        setExecutionTime('Error Occurred');
        setError(result.data);
      }
    } catch (error) {
      setError(error.message);
    }
  };


  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setCode(CODE_SNIPPETS[selectedLanguage]);
  };


  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <Header language={language} handleLanguageChange={handleLanguageChange} handleSubmit={handleSubmit} />

      {/* Main Content */}
      <main className="flex-1 p-4 text-gray-300 overflow-auto">
        <ResizablePanelGroup direction="horizontal" className="h-full">

          {/* Left Column */}
          <ResizablePanel defaultSize={70} minSize={30}>
            <div className="flex flex-col gap-4 h-full">
              <CodeEditor language={language} code={code} setCode={setCode} />
            </div>
          </ResizablePanel>

          <ResizableHandle className='bg-gray-900 text-gray-900' withHandle />

          {/* Right Column */}
          <ResizablePanel defaultSize={30} minSize={20}>
            <RightCol input={input} setInput={setInput} output={output} error={error} executionTime={executionTime} />
          </ResizablePanel>

        </ResizablePanelGroup>
      </main>
    </div>

  );
}

export default App;
