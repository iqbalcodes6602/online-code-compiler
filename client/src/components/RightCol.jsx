import React from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable'


function RightCol({ input, setInput, output, error, executionTime }) {
    return (
        <>
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

                <ResizableHandle className='bg-gray-900 text-gray-900' withHandle />

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
        </>
    )
}

export default RightCol