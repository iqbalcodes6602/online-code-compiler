// frontend/src/App.js

import React, { useState } from 'react';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [executionTime, setExecutionTime] = useState();
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('py');

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
        setExecutionTime('Error Occured');
        setError(result.data);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    // <div className="App">
    //   <header>
    //     Online Code Compiler
    //     <button onClick={handleSubmit}>Run Code</button>
    //   </header>
    //   <main>
    //     <div className="left-column">
    //       <textarea
    //         placeholder="Enter your code here..."
    //         value={code}
    //         onChange={(e) => setCode(e.target.value)}
    //       />
    //     </div>
    //     <div className="right-column">
    //       <div className="input-section">
    //         <label htmlFor="input-textarea">Input</label>
    //         <textarea
    //           id="input-textarea"
    //           placeholder=""
    //           value={input}
    //           onChange={(e) => setInput(e.target.value)}
    //         />
    //       </div>

    //       <div className="output-section">
    //         <label htmlFor="output-div">
    //           Output
    //           <span className="execution-time">
    //             {executionTime}
    //           </span>
    //         </label>
    //         <div id="output-div" className="output-content">

    //           {output ? output : error}
    //         </div>
    //       </div>
    //     </div>
    //   </main>
    // </div>
    <div className="grid grid-rows-auto h-screen bg-gray-900">
      {/* Header */}
      <header className=" text-white flex items-center justify-center row-span-1">
        Online Code Compiler
        <button className="ml-4 px-4 py-2 bg-blue-500 text-white font-bold rounded cursor-pointer" onClick={handleSubmit}>
          Run Code
        </button>
      </header>

      {/* Main Content */}
      <main className="grid grid-cols-2 gap-4 p-4 text-gray-300 row-span-9">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          <textarea
            className="flex-1 resize-none bg-gray-800 text-gray-300  p-4 rounded outline-none"
            placeholder="Enter your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        {/* Right Column */}
        <div className="grid grid-rows-3 gap-4">
          {/* Input Section */}
          <div className="flex flex-col gap-2 bg-gray-800 p-4 rounded row-span-1">
            <label htmlFor="input-textarea" className="font-bold text-gray-300">Input</label>
            <textarea
              id="input-textarea"
              className="resize-none bg-gray-900 text-gray-300 p-4 rounded outline-none h-[100%]"
              placeholder=""
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {/* Output Section */}
          <div className="flex flex-col gap-2 bg-gray-800 p-4 rounded row-span-2">
            <label htmlFor="output-div" className="flex justify-between font-bold text-gray-300">
              Output
              <span className="text-blue-500">{executionTime}</span>
            </label>
            <div id="output-div" className="bg-gray-900 text-gray-300 rounded p-4 overflow-auto h-[100%]">
              {output ? output : error}
            </div>
          </div>
        </div>
      </main>
    </div>

  );
}

export default App;
