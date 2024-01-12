import * as React from 'react';
import { useRef } from 'react';
import './App.css';
import Editor, { DiffEditor, useMonaco, loader, Monaco, EditorProps } from '@monaco-editor/react';

const App = () => {
  const editorRef = useRef<any>(null);
  const monacaRef = useRef<any>(null);

  const handleEditorDidMount:  (...args: any) => any = (editor: EditorProps, monaco: Monaco) => {
    console.log("editor", editor.defaultLanguage);
    console.log("monaco", monaco);
    editorRef.current = editor;
    monacaRef.current = monaco
  }

  const handleEditorWillMount:  (...args: any) => any = (monaco: Monaco) => {
    // here is the monaco instance
    // do something before editor is mounted
    // monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  }
  
  function showValue() {
    alert(editorRef.current.getValue());
  }
  return (
    <div className="App">
      <button onClick={showValue}>Show value</button>
      <Editor height="90vh" defaultLanguage="javascript" defaultValue="// some comment" onMount={handleEditorDidMount} />;
    </div>
  );
}

export default App;
