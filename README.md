# AI Document Assistant – Frontend

A modern, responsive AI-powered document assistant frontend built with **React.js and TypeScript**. The application provides an intuitive interface for uploading documents, asking questions, and interacting with AI-generated answers using Retrieval-Augmented Generation (RAG).

## 🚀 Overview

AI Document Assistant helps users interact with their documents through natural language.

Users can upload documents, ask questions about their content, and receive context-aware answers powered by Large Language Models (LLMs).

The frontend communicates with the AI Document Assistant backend through REST APIs built using FastAPI.

## ✨ Key Features

- **Modern User Interface:** Clean and responsive application design.
- **Document Upload:** Upload documents through an intuitive interface.
- **Document Management:** View and manage uploaded documents.
- **AI Question Answering:** Ask questions about uploaded documents.
- **RAG Integration:** Retrieve relevant document information through the backend.
- **Chat Interface:** Interact with AI using a conversational interface.
- **Type Safety:** TypeScript for reliable and maintainable code.
- **API Integration:** Communicate with the backend using REST APIs.
- **Responsive Design:** Support desktop, tablet, and mobile screens.
- **Error Handling:** Display meaningful API and validation errors.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend library |
| TypeScript | Static type checking |
| JavaScript (ES6+) | Application programming |
| HTML5 | Application structure |
| CSS3 | Styling |
| REST API | Backend communication |
| FastAPI | Backend API integration |

*Add additional libraries such as Axios, React Router, Tailwind CSS, or Redux if they are part of your implementation.*

## 🏗️ Application Architecture

```text
              User
               |
               v
        React Application
               |
       +-------+--------+
       |                |
       v                v
 Document Module    Chat Module
       |                |
       v                v
 Document Upload    User Question
       |                |
       +-------+--------+
               |
               v
          API Service
               |
               v
        FastAPI Backend
               |
               v
          RAG Pipeline
               |
               v
           Groq LLM
               |
               v
        AI Generated Answer
               |
               v
        React Application
               |
               v
             User
```

## 📁 Project Structure

```text
AI_Document_Assistant_Client/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── context/
│   ├── App.tsx
│   └── main.tsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

*Note: Adjust the structure according to your actual project.*

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/AI_Document_Assistant_Client.git

cd AI_Document_Assistant_Client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
VITE_API_BASE_URL=http://localhost:8000
```

Make sure the environment variable name matches your API configuration.

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

### 5. Build for Production

```bash
npm run build
```

### 6. Preview Production Build

```bash
npm run preview
```

## 🔗 Backend Integration

The frontend communicates with the AI Document Assistant backend through REST APIs.

**Backend Technology:**
- Python
- FastAPI
- PostgreSQL
- pgvector
- Groq API

Configure the backend URL through the frontend environment variable:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Ensure that the backend server is running and CORS is configured to allow requests from the frontend.

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL |

**Security Note:** Never expose secret API keys or sensitive credentials in frontend environment variables. Variables prefixed with `VITE_` are included in the client-side application.

## 🧪 Available Scripts

| Command | Description |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build production application |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint, if configured |

## 🔮 Future Enhancements

- User authentication and authorization.
- Document upload progress indicator.
- Multiple document support.
- Chat history and conversation management.
- Markdown rendering for AI responses.
- Code syntax highlighting.
- Streaming AI responses.
- Document preview.
- Dark and light themes.
- Production deployment.

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Submit a pull request.

## 📄 License

This project is available under the MIT License. Add a `LICENSE` file if you intend to distribute it under this license.

---

**Built with React.js and TypeScript.**
