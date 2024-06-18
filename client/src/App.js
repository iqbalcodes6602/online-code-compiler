import axios from "axios";
import "./App.css";
import React, { useState } from "react";

function App() {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleSubmit = async () => {
    const payload = {
      language: "py",
      code,
      input,
    };
    try {
      const { data } = await axios.post("http://localhost:5000/run", payload);
      setOutput(data.output);
    } catch (err) {
      console.log(err.response);
    }
  };

  return (
    <div className="App">
      <h1>Online Code Compiler</h1>
      <textarea
        rows="20"
        cols="75"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
        }}
      ></textarea>
      <br />
      <textarea
        rows="5"
        cols="75"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        placeholder="Enter input here..."
      ></textarea>
      <br />
      <button onClick={handleSubmit}>Submit</button>
      <p>{output}</p>
    </div>
  );
}

export default App;
