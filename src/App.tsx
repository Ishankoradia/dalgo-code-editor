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
import { httpGet, httpPost } from "./utils/http";
import Folder from "@mui/icons-material/Folder";
import FileCopyIcon from "@mui/icons-material/FileCopy";

const gitToken = process.env.REACT_APP_GIT_TOKEN;

interface TreeComponentProps {
  treeData: Array<any>;
  treeRef: any;
  currentFileId: string;
  setCurrentFileId: (...args: any) => any;
}

const TreeNode = ({ node, style, tree, dragHandle }: any) => {
  // console.log(node, tree);
  // console.log(style);
  return (
    <Box
      className="node-container"
      style={style}
      ref={dragHandle}
      onClick={() => node.toggle()}
    >
      <Box sx={{ background: "none" }}>
        {node.isLeaf ? <FileCopyIcon /> : <Folder sx={{ color: "blue" }} />}
        {node.data.name}
      </Box>
    </Box>
  );
};

const TreeComponent = ({
  treeData,
  treeRef,
  currentFileId,
  setCurrentFileId,
}: TreeComponentProps) => {
  const handleSelect = (nodeIds: Array<any>) => {
    if (nodeIds.length > 0) setCurrentFileId(nodeIds[0].data.id);
  };
  return (
    <Tree
      childrenAccessor={(d) => d.children}
      openByDefault={false}
      data={treeData}
      ref={treeRef}
      height={1000}
      selection={currentFileId}
      onSelect={handleSelect}
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
  const [currentSelectedFileId, setCurrentSelectedFileId] = useState<string>(
    "/Users/dorjayyolmo/Dev/data/DDP/DBT/old-arch-test123/dbtrepo/models/prod/indicators.sql"
  );
  const [editorContent, setEditorContent] = useState<string>("");

  useEffect(() => {
    const tree: any = treeRef.current;
    (async () => {
      try {
        const data = await httpGet("dbt/repo/tree");
        setTreeData(data["tree"]);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (currentSelectedFileId.length > 0) {
      (async () => {
        try {
          const data = await httpPost("dbt/repo/tree/file", {
            id: currentSelectedFileId,
          });
          setEditorContent(data["content"]);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [currentSelectedFileId]);

  useEffect(() => {
    if (treeData.length > 0) {
      const tree: any = treeRef.current;
      tree.selectContiguous(currentSelectedFileId);
    }
  }, [treeData]);

  const handleEditorDidMount: (...args: any) => any = (
    editor: EditorProps,
    monaco: Monaco
  ) => {
    // console.log("editor", editor.defaultLanguage);
    // console.log("monaco", monaco.languages.getLanguages());
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
          setCurrentFileId={setCurrentSelectedFileId}
        />
      </Box>
      <Editor
        className="dalgoeditor"
        height="90vh"
        defaultLanguage="python"
        defaultValue="// some comment"
        value={editorContent}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        path={currentSelectedFileId}
      />
    </div>
  );
};

export default App;
