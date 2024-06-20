// frontend/src/App.js

import React, { useState } from 'react';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [executionTime, setExecutionTime] = useState(0);
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
    <div className="App">
      <header>
        Online Code Compiler
        <button onClick={handleSubmit}>Run Code</button>
      </header>
      <main>
        <div className="left-column">
          <textarea
            placeholder="Enter your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <div className="right-column">
          <div className="input-section">
            <label htmlFor="input-textarea">Input</label>
            <textarea
              id="input-textarea"
              placeholder=""
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div className="output-section">
            <label htmlFor="output-div">
              Output
              <span className="execution-time">
                {executionTime}
              </span>
            </label>
            <div id="output-div" className="output-content">
            
              {output ? output : error}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
