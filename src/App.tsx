import * as React from "react";
import { useRef, useEffect, useState } from "react";
import "./App.css";
import Editor, {
  DiffEditor,
  useMonaco,
  loader,
  Monaco,
  EditorProps,
} from "@monaco-editor/react";
import { Box } from "@mui/material";
import { getDirectory } from "./api/repo";
import { Tree, RowRendererProps, NodeRendererProps } from "react-arborist";
import { httpGet } from "./utils/http";
import Folder from "@mui/icons-material/Folder";
import FileCopyIcon from "@mui/icons-material/FileCopy";

const gitToken = process.env.REACT_APP_GIT_TOKEN;

interface TreeComponentProps {
  treeData: Array<any>;
  treeRef: any;
  currentFileId: string;
}

const TreeNode = ({ node, style, dragHandle }: any) => {
  // console.log(node, tree);
  console.log(style);
  return (
    <Box
      className="node-container"
      style={style}
      ref={dragHandle}
      onClick={() => node.toggle()}
    >
      {node.isLeaf ? <FileCopyIcon /> : <Folder sx={{ color: "blue" }} />}
      {node.data.name}
    </Box>
  );
};

const TreeComponent = ({
  treeData,
  treeRef,
  currentFileId,
}: TreeComponentProps) => {
  console.log("tree data", treeData);
  console.log("tree ref", treeRef);
  return (
    <Tree
      childrenAccessor={(d) => d.children}
      openByDefault={false}
      data={treeData}
      ref={treeRef}
      height={1000}
      selection={currentFileId}
    >
      {TreeNode}
    </Tree>
  );
};

const App = () => {
  const editorRef = useRef<any>(null);
  const monacaRef = useRef<any>(null);
  const treeRef = useRef();
  const [treeData, setTreeData] = useState<Array<any>>([]);
  const [currentSelectedFileId, setCurrentSelectedFileId] =
    useState<string>("");

  useEffect(() => {
    const tree: any = treeRef.current;
    // tree.selectAll();
    (async () => {
      try {
        const data = await httpGet("dbt/repo/tree");
        setTreeData(data["tree"]);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleEditorDidMount: (...args: any) => any = (
    editor: EditorProps,
    monaco: Monaco
  ) => {
    console.log("editor", editor.defaultLanguage);
    console.log("monaco", monaco.languages.getLanguages());
    editorRef.current = editor;
    monacaRef.current = monaco;
  };

  const handleEditorWillMount: (...args: any) => any = (monaco: Monaco) => {
    // here is the monaco instance
    // do something before editor is mounted
    // monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  };

  function showValue() {
    alert(editorRef.current.getValue());
  }

  return (
    <div className="app">
      <Box className="treecomponent">
        <TreeComponent
          treeData={treeData}
          treeRef={treeRef}
          currentFileId={currentSelectedFileId}
        />
      </Box>
      <Editor
        className="dalgoeditor"
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        onMount={handleEditorDidMount}
        theme="vs-dark"
      />
    </div>
  );
};

export default App;
