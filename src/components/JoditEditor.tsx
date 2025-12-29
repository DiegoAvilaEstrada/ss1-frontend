import React, { useEffect, useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { useTheme } from "@mui/material/styles";
import "./css/jodit-dark.css";

const JoditEditorComponent = ({
  content,
  setContent,
  height = "400",
}: {
  content: string;
  setContent: (cont: string) => void;
  height?: string;
}) => {
  const editor = useRef<any | null>(null);
  const theme = useTheme();
  const [hasLoadedInitialContent, setHasLoadedInitialContent] = useState(false);

  const isDark = theme.palette.mode === "dark";
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Escribe el contenido...",
      buttons: [
        "bold",
        "italic",
        "underline",
        "paragraph",
        "font",
        "fontsize",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "|",
        "image",
        "link",
        "file",
        "video",
        "|",
        "align",
        "undo",
        "redo",
        "|",
        "table",
        "link",
        "symbols",
        "indent",
        "outdent",
        "left",
        "brush",
        "undo",
        "redo",
      ],
      theme: isDark ? "dark" : "default",
      height: height,
      uploader: {
        insertImageAsBase64URI: true,
      },
    }),
    [theme.palette.mode, height]
  );

  useEffect(() => {
    if (editor.current && content && !hasLoadedInitialContent) {
      editor.current.value = content;
      setHasLoadedInitialContent(true);
    }
  }, [content, hasLoadedInitialContent]);

  const handleChange = (html: string) => {
    setContent(html);
  };

  return (
    <JoditEditor
      ref={editor}
      config={config}
      tabIndex={1}
      onChange={handleChange}
    />
  );
};
export default React.memo(JoditEditorComponent);
