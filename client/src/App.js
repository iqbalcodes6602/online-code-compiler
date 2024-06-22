// frontend/src/App.js
import React, { useState } from 'react';
import './App.css';
import CodeEditor from './CodeEditor';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable"

export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
};

export const CODE_SNIPPETS = {
  javascript: `function greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("world");\n`,
  python: `def greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("world")\n`,
  java: `public class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp:
    'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
};

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

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setCode(CODE_SNIPPETS[selectedLanguage]);
  };

  return (
    // <div className="h-screen bg-gray-900 flex flex-col">
    //   {/* Header */}
    //   <header className="text-white flex items-center justify-center p-2">
    //     <select
    //       className="ml-4 px-4 py-2 bg-gray-700 text-white rounded"
    //       value={language}
    //       onChange={handleLanguageChange}
    //     >
    //       {Object.keys(LANGUAGE_VERSIONS).map((lang) => (
    //         <option key={lang} value={lang}>
    //           {lang}
    //         </option>
    //       ))}
    //     </select>
    //     Online Code Compiler
    //     <button className="ml-4 px-4 py-2 bg-blue-500 text-white font-bold rounded cursor-pointer" onClick={handleSubmit}>
    //       Run Code
    //     </button>
    //   </header>

    //   {/* Main Content */}
    //   <main className="flex-1 grid md:grid-cols-5 gap-4 p-4 text-gray-300 overflow-auto">
    //     {/* Left Column */}
    //     <div className="flex flex-col gap-4 md:col-span-3">
    //       <CodeEditor language={language} code={code} setCode={setCode} />
    //     </div>

    //     {/* Right Column */}
    //     <div className="grid grid-rows-3 gap-4 md:col-span-2">
    //       {/* Input Section */}
    //       <div className="flex flex-col gap-2 bg-gray-800 p-4 row-span-1">
    //         <label htmlFor="input-textarea" className="font-bold text-gray-300">Input</label>
    //         <textarea
    //           id="input-textarea"
    //           className="resize-none bg-gray-900 text-gray-300 p-4 rounded outline-none h-[100%]"
    //           placeholder=""
    //           value={input}
    //           onChange={(e) => setInput(e.target.value)}
    //         />
    //       </div>

    //       {/* Output Section */}
    //       <div className="flex flex-col gap-2 bg-gray-800 p-4 row-span-2">
    //         <label htmlFor="output-div" className="flex font-bold text-gray-300 gap-1">
    //           Output {executionTime &&
    //             <span className="text-blue-400">({executionTime})</span>
    //           }
    //         </label>
    //         <textarea
    //           className="resize-none bg-gray-900 text-gray-300 p-4 rounded outline-none h-[100%]"
    //           placeholder=""
    //           value={output || error}
    //           disabled={true}
    //         />
    //       </div>
    //     </div>
    //   </main>
    // </div>
    // <ResizablePanelGroup
    //   direction="horizontal"
    //   className="max-w-md rounded-lg border"
    // >
    //   <ResizablePanel defaultSize={50}>
    //     <div className="flex h-[200px] items-center justify-center p-6">
    //       <span className="font-semibold">One</span>
    //     </div>
    //   </ResizablePanel>
    //   <ResizableHandle withHandle={true} />
    //   <ResizablePanel defaultSize={50}>
    //     <ResizablePanelGroup direction="vertical">
    //       <ResizablePanel defaultSize={25}>
    //         <div className="flex h-full items-center justify-center p-6">
    //           <span className="font-semibold">Two</span>
    //         </div>
    //       </ResizablePanel>
    //       <ResizableHandle withHandle={true} />
    //       <ResizablePanel defaultSize={75}>
    //         <div className="flex h-full items-center justify-center p-6">
    //           <span className="font-semibold">Three</span>
    //         </div>
    //       </ResizablePanel>
    //     </ResizablePanelGroup>
    //   </ResizablePanel>
    // </ResizablePanelGroup>
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="text-white flex items-center justify-center p-2">
        <select
          className="ml-4 px-4 py-2 bg-gray-700 text-white rounded"
          value={language}
          onChange={handleLanguageChange}
        >
          {Object.keys(LANGUAGE_VERSIONS).map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        Online Code Compiler
        <button className="ml-4 px-4 py-2 bg-blue-500 text-white font-bold rounded cursor-pointer" onClick={handleSubmit}>
          Run Code
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 text-gray-300 overflow-auto">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Column */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="flex flex-col gap-4 h-full">
              <CodeEditor language={language} code={code} setCode={setCode} />
            </div>
          </ResizablePanel>
          <ResizableHandle className='bg-gray-900' withHandle />
          {/* Right Column */}
          <ResizablePanel defaultSize={40} minSize={20}>
            <ResizablePanelGroup direction="vertical" className="h-full gap-[0.1px]">
              {/* Input Section */}
              <ResizablePanel defaultSize={30} minSize={20}>
                <div className="flex flex-col gap-2 bg-gray-800 p-2 h-full">
                  <label htmlFor="input-textarea" className="font-bold text-gray-300">Input</label>
                  <textarea
                    id="input-textarea"
                    className="resize-none bg-gray-900 text-gray-300 p-4 rounded outline-none h-full"
                    placeholder=""
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle className='bg-gray-900' withHandle />
              {/* Output Section */}
              <ResizablePanel defaultSize={70} minSize={20}>
                <div className="flex flex-col gap-2 bg-gray-800 p-2 h-full">
                  <label htmlFor="output-textarea" className="font-bold text-gray-300 gap-1">
                    Output {executionTime && (
                      <span className="text-blue-400">({executionTime})</span>
                    )}
                  </label>
                  <textarea
                    id="output-textarea"
                    className="resize-none bg-gray-900 text-gray-300 p-4 rounded outline-none h-full overflow-auto"
                    placeholder=""
                    value={output || error}
                    disabled={true}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>

  );
}

export default App;
