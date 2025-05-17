import { useState, useMemo, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { githubLight } from "@uiw/codemirror-theme-github";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { keymap } from "@codemirror/view";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const langs = [
  {
    label: "🐍 Python",
    value: "python",
    extension: python(),
    defaultCode: "print('Hello, Python!')",
    ext: "py",
  },
  {
    label: "📜 JavaScript",
    value: "javascript",
    extension: javascript(),
    defaultCode: "console.log('Hello, JavaScript!');",
    ext: "js",
  },
  {
    label: "🖥️ C++",
    value: "cpp",
    extension: cpp(),
    defaultCode:
      "#include <iostream>\nint main() {\n  std::cout << \"Hello C++\";\n  return 0;\n}",
    ext: "cpp",
  },
  {
    label: "🔧 C",
    value: "c",
    extension: cpp(),
    defaultCode:
      "#include <stdio.h>\nint main() {\n  printf(\"Hello C\\n\");\n  return 0;\n}",
    ext: "c",
  },
  {
    label: "☕ Java",
    value: "java",
    extension: java(),
    defaultCode:
      "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello Java\");\n  }\n}",
    ext: "java",
  },
];

export default function App() {
  const [language, setLanguage] = useState("python");
  const selectedLang = langs.find((lang) => lang.value === language);
  const [code, setCode] = useState(selectedLang.defaultCode);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [runtime, setRuntime] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const outputRef = useRef(null);

  const extensions = useMemo(
    () => [
      selectedLang.extension,
      closeBrackets(),
      keymap.of(closeBracketsKeymap),
    ],
    [selectedLang]
  );

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleRun();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const handleLanguageChange = (e) => {
    const lang = langs.find((l) => l.value === e.target.value);
    setLanguage(lang.value);
    setCode(lang.defaultCode);
    setOutput("");
    setRuntime(null);
  };

  const handleRun = async () => {
    setOutput("");
    setRuntime(null);
    setLoading(true);
    const startTime = Date.now();

    try {
      const res = await fetch("${backendUrl}/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code, input }),
      });

      const data = await res.json();
      setOutput(data.output || data.error || "No output.");
      setRuntime(((Date.now() - startTime) / 1000).toFixed(2));
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setOutput("❌ Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `code.${selectedLang.ext}`;
    a.click();
  };

  const handleReset = () => {
    setCode(selectedLang.defaultCode);
    setInput("");
    setOutput("");
    setRuntime(null);
  };

  return (
    <div
      className={`${
        darkMode ? "bg-[#0f0f0f] text-white" : "bg-[#f9fafb] text-black"
      } min-h-screen transition-colors duration-300 font-sans`}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-6 p-6 rounded-xl shadow bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-2">Online Code Runner</h1>
          <div className="flex justify-center gap-3 flex-wrap mt-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-xl hover:scale-110 transition-transform"
              title="Toggle Theme"
            >
              {darkMode ? "🌞" : "🌙"}
            </button>
            <button
              onClick={handleReset}
              className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 text-sm"
            >
              ↻ Reset
            </button>
            <button
              onClick={handleDownload}
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
            >
              ⬇️ Download
            </button>
          </div>
        </header>

        {/* Main Body */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left Panel */}
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-wrap gap-2 items-center text-sm">
              <label className="font-medium">Language:</label>
              <select
                value={language}
                onChange={handleLanguageChange}
                className={`border px-2 py-1 rounded-md focus:outline-none focus:ring-2 ${
                  darkMode
                    ? "bg-[#1e1e1e] text-white border-gray-600"
                    : "bg-white text-black border-gray-300"
                }`}
              >
                {langs.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <span className="ml-auto text-gray-400 text-xs">
                💡 Ctrl+Enter to Run
              </span>
            </div>

            <div className="border rounded-lg overflow-hidden shadow-md">
              <CodeMirror
                value={code}
                height="300px"
                theme={darkMode ? dracula : githubLight}
                extensions={extensions}
                onChange={(val) => setCode(val)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm">📥 Input (stdin)</label>
              <textarea
                className="border rounded-md p-2 resize-y text-sm bg-white text-black focus:outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
              />
            </div>

            <button
              onClick={handleRun}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm self-start transition-all disabled:opacity-60"
            >
              ▶️ {loading ? "Running..." : "Run Code"}
            </button>
          </div>

          {/* Output Panel */}
          <div className="flex flex-col gap-y-4" ref={outputRef}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                ✨ Output
              </h2>
              {runtime !== null && (
                <span className="text-xs px-2 py-1 bg-gray-800 text-white rounded-md">
                  🕒 {runtime}s
                </span>
              )}
            </div>
            <pre className="bg-black text-green-400 font-mono text-sm p-4 rounded-md min-h-[250px] max-h-[300px] overflow-auto whitespace-pre-wrap border border-gray-700">
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
