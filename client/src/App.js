// frontend/src/App.js

import React, { useState } from 'react';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [executionTime, setExecutionTime] = useState(0);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('js');

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
        setExecutionTime(result.executionTime);
        setError('');
      } else {
        setOutput('');
        setExecutionTime(0);
        setError(result.data);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Python Code Executor</h1>
      </header>
      <main>
        <textarea
        cols={30}
        rows={20}
          placeholder="Enter your Python code here"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <textarea
        cols={30}
        rows={20}
          placeholder="Enter input (optional)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSubmit}>Run Code</button>
        {output && (
          <div>
            <h2>Output:</h2>
            <pre>{output}</pre>
            <p>Execution Time: {executionTime} ms</p>
          </div>
        )}
        {error && (
          <div>
            <h2>Error:</h2>
            <pre>{error}</pre>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
