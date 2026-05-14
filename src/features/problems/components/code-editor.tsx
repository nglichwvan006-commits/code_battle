"use client";

import { useEffect, useRef } from "react";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<unknown>(null);
  const editorInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    let mounted = true;

    async function initMonaco() {
      const monaco = await import("monaco-editor");

      if (!mounted || !editorRef.current) return;

      monaco.editor.defineTheme("rpg-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "6b7280", fontStyle: "italic" },
          { token: "keyword", foreground: "a78bfa" },
          { token: "string", foreground: "34d399" },
          { token: "number", foreground: "fbbf24" },
          { token: "type", foreground: "60a5fa" },
        ],
        colors: {
          "editor.background": "#0f0f1a",
          "editor.foreground": "#e5e7eb",
          "editor.lineHighlightBackground": "#1a1a2e",
          "editorCursor.foreground": "#a78bfa",
          "editor.selectionBackground": "#a78bfa33",
        },
      });

      const editor = monaco.editor.create(editorRef.current!, {
        value,
        language,
        theme: "rpg-dark",
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "var(--font-geist-mono), 'Fira Code', monospace",
        fontLigatures: true,
        padding: { top: 16, bottom: 16 },
        scrollBeyondLastLine: false,
        lineNumbers: "on",
        renderLineHighlight: "all",
        bracketPairColorization: { enabled: true },
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
      });

      editor.onDidChangeModelContent(() => {
        onChange(editor.getValue());
      });

      monacoRef.current = monaco;
      editorInstanceRef.current = editor;
    }

    initMonaco();

    return () => {
      mounted = false;
      if (editorInstanceRef.current) {
        (editorInstanceRef.current as { dispose: () => void }).dispose();
      }
    };
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editorInstanceRef.current && monacoRef.current) {
      const editor = editorInstanceRef.current as { getModel: () => unknown };
      const monaco = monacoRef.current as { editor: { setModelLanguage: (model: unknown, lang: string) => void } };
      const model = editor.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  useEffect(() => {
    if (editorInstanceRef.current) {
      const editor = editorInstanceRef.current as { getValue: () => string; setValue: (v: string) => void };
      if (editor.getValue() !== value) {
        editor.setValue(value);
      }
    }
  }, [value]);

  return <div ref={editorRef} className="h-full w-full min-h-[400px]" />;
}
