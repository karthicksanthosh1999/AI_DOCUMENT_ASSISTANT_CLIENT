
"use client";

import { useState } from "react";
import {
  FileText,
  Upload,
  MessageSquare,
  Trash2,
  Send,
  Bot,
  User,
  Sparkles,
  Paperclip,
  X,
  Loader2,
  Search,
  MoreHorizontal,
} from "lucide-react";
import HighlightedMarkdown from "../HighlightedMarkdown";

interface Document {
  id: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  fileType: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

const API_URL = import.meta.env.BACKEND_URL ?? "http://localhost:5000/api";

const DocumentAssistant = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] =
    useState<Document | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");

  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [dragging, setDragging] = useState(false);

  const [search, setSearch] = useState("");

  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  // Upload document
  const handleUpload = async (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload PDF, TXT or DOCX files.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      setUploading(true);

      const response = await fetch(`${API_URL}/document`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Document upload failed");
      }

      const result = await response.json();
      const uploaded = result.data;

      setDocuments((prev) => [uploaded, ...prev]);
      setSelectedDocument(uploaded);
      setMessages([]);
    } catch (error) {
      console.error(error);
      alert("Unable to upload document.");
    } finally {
      setUploading(false);
    }
  };

  // Delete document
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/document/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Document deletion failed");
      }

      setDocuments((prev) => prev.filter((doc) => doc.id !== id));

      if (selectedDocument?.id === id) {
        setSelectedDocument(null);
        setMessages([]);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to delete document.");
    }
  };

  // Send message to AI
  const handleSendMessage = async () => {
    if (!question.trim() || !selectedDocument || sending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question.trim(),
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");

    try {
      setSending(true);

      const response = await fetch(`${API_URL}/rag/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: selectedDocument.id,
          question: userMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error("AI response failed");
      }

      const result = await response.json();

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          typeof result.data === "string"
            ? result.data
            : result.data?.answer ?? "No answer received.",
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.originalName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">

      {/* SIDEBAR */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">

        <div className="flex h-16 items-center gap-3 border-b px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Sparkles size={21} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">JK Bots</h4>
            <p className="text-xs text-slate-500">Document Intelligence</p>
          </div>
        </div>

        <div className="px-4 pt-2">
          <div className="relative mb-3">
            <Search
              size={16}
              className="absolute left-3 top-3 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto px-3 pb-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => {
                setSelectedDocument(doc);
                setMessages([]);
              }}
              className={`group flex cursor-pointer items-center gap-3 rounded-xl p-3 transition ${
                selectedDocument?.id === doc.id
                  ? "bg-indigo-50 ring-1 ring-indigo-200"
                  : "hover:bg-slate-50"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                <FileText size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {doc.originalName}
                </p>
                <p className="text-xs text-slate-400">
                  {formatSize(doc.fileSize)}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(doc.id);
                }}
                className="rounded-lg p-2 text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                title="Delete document"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {documents.length === 0 && (
            <p className="py-8 text-center text-xs text-slate-400">
              No documents uploaded yet.
            </p>
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <User size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">Workspace</p>
              <p className="text-xs text-slate-500">AI Assistant</p>
            </div>
            <MoreHorizontal className="ml-auto text-slate-400" size={18} />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex min-w-0 flex-1 flex-col">

        {/* HEADER */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8">
          <div>
            <h2 className="font-semibold" style={{ color: "black"}}>AI Document Assistant</h2>
            <p className="text-xs text-slate-500">
              Upload, analyze and chat with your documents
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            AI Ready
          </div>
        </header>

        {/* CHAT AREA */}
        <div className="flex flex-1 flex-col overflow-y-auto">

          {!selectedDocument ? (
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-10">

              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <Sparkles size={32} />
              </div>

              <h1 className="text-center text-3xl font-bold tracking-tight" style={{ color : 'blue' }}>
                Chat with your documents
              </h1>

              <p className="mt-3 max-w-lg text-center text-sm leading-6 text-slate-500">
                Upload your PDF, Word or text documents. Ask questions and
                get intelligent answers powered by AI.
              </p>

              {/* UPLOAD BOX */}
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleUpload(file);
                }}
                className={`mt-10 flex w-full cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed p-10 text-center transition ${
                  dragging
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/30"
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.txt,.docx"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                    e.currentTarget.value = "";
                  }}
                />

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  {uploading ? (
                    <Loader2 className="animate-spin" size={26} />
                  ) : (
                    <Upload size={26} />
                  )}
                </div>

                <h3 className="font-semibold">
                  {uploading ? "Uploading document..." : "Drop your document here"}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  or click to browse files
                </p>

                <span className="mt-4 rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-500">
                  PDF, DOCX, TXT
                </span>
              </label>

              <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  {
                    icon: FileText,
                    title: "Upload",
                    desc: "Upload your documents",
                  },
                  {
                    icon: MessageSquare,
                    title: "Ask",
                    desc: "Ask questions naturally",
                  },
                  {
                    icon: Sparkles,
                    title: "Understand",
                    desc: "Get AI-powered answers",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <item.icon className="mb-3 text-indigo-600" size={21} />
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* SELECTED DOCUMENT */}
              <div className="border-b border-slate-200 bg-white px-5 py-3 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-50 p-2 text-red-500">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {selectedDocument.originalName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatSize(selectedDocument.fileSize)} · Active document
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDocument(null);
                      setMessages([]);
                    }}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                    title="Close document"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* MESSAGES */}
              <div className="mx-auto w-full max-w-4xl flex-1 space-y-6 px-5 py-8">

                {messages.length === 0 && (
                  <div className="flex min-h-87.5 flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                      <Bot size={28} />
                    </div>
                    <h2 className="text-xl font-bold">
                      Your document is ready!
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      What would you like to know about this document?
                    </p>

                    <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
                      {[
                        "Summarize this document",
                        "What are the key points?",
                        "Explain this document simply",
                        "What are the important facts?",
                      ].map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => setQuestion(prompt)}
                          className="rounded-xl border border-slate-200 bg-white p-3 text-left text-sm transition hover:border-indigo-300 hover:bg-indigo-50"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        message.role === "assistant"
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <Bot size={19} />
                      ) : (
                        <User size={19} />
                      )}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                        message.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "border border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                       <HighlightedMarkdown content={message.content} />
                    </div>
                  </div>
                ))}

                {sending && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                      <Bot size={19} />
                    </div>
                    <div className="rounded-xl border bg-white px-4 py-3 text-sm text-slate-500">
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={15} />
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* CHAT INPUT */}
        {selectedDocument && (
          <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-5 sm:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="flex items-end gap-3 rounded-2xl border border-slate-300 bg-slate-50 p-3 transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                <button
                  className="rounded-lg p-2 text-slate-400 hover:bg-white"
                  title="Document attached"
                  disabled
                >
                  <Paperclip size={19} />
                </button>

                <textarea
                  rows={1}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask anything about your document..."
                  className="max-h-32 min-h-10 flex-1 resize-y bg-transparent py-2 text-sm outline-none placeholder:text-slate-400"
                />

                <button
                  onClick={handleSendMessage}
                  disabled={!question.trim() || sending}
                  className="rounded-xl bg-indigo-600 p-3 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                  title="Send message"
                >
                  <Send size={18} />
                </button>
              </div>

              <p className="mt-3 text-center text-xs text-slate-400">
                AI can make mistakes. Verify important information.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DocumentAssistant;
