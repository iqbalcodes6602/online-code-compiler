import React from 'react'
import { LANGUAGE_VERSIONS } from '../utils/constants'

function Header({ language, handleLanguageChange, handleSubmit }) {
    return (
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
    )
}

export default Header