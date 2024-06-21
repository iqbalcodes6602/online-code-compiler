import Editor from '@monaco-editor/react'
import { customTheme } from './customTheme'


const EditorComponent = ({ language, code, setCode }) => {
    return (
        <Editor
            height='85vh'
            // height={'100%'}
            // width={'100%'}
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            beforeMount={(monaco) => {
                monaco.editor.defineTheme('customTheme', customTheme)
                monaco.editor.setTheme('customTheme')
            }}
            theme="customTheme"
            options={{
                scrollBeyondLastLine: false,
                fontSize: 16,
            }}
        />
    )
}

export default EditorComponent