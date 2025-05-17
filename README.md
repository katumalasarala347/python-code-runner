# 🧠 Online Code Runner

A sleek and powerful code runner built using React + Express that allows users to write, input, and execute code (Python) with real-time output and runtime display. Perfect for coding practice and testing snippets directly in the browser.

## 🔗 Live Demo
👉 [python-code-runner-lac.vercel.app](https://python-code-runner-lac.vercel.app)

---

## 📸 Preview

![App Screenshot](https://user-images.githubusercontent.com/your-screenshot-link.png)

---

## 🚀 Features

- ✅ **Run Python Code Instantly**
- 📥 Input (stdin) support
- 🎯 Clean real-time output view
- ⌛ Runtime indicator
- 🎨 Modern, responsive dark UI
- 📦 Download code button
- ♻️ Reset editor option
- 🎹 Keyboard shortcut: `Ctrl + Enter` to run

---

## 🛠 Tech Stack

### 💻 Frontend
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [@uiw/react-codemirror](https://www.npmjs.com/package/@uiw/react-codemirror)

### 🌐 Backend
- [Express.js](https://expressjs.com/)
- [Piston API](https://github.com/engineer-man/piston) (code execution engine)

### ☁️ Deployment
- Frontend: [Vercel](https://vercel.com/)
- Backend: [Render](https://render.com/)

---

## 📁 Folder Structure

```bash
/online-code-editor
├── client (React frontend)
│   └── main UI & CodeMirror
└── server (Node.js backend)
    └── Executes code via Piston API
