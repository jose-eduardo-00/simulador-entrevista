import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

function App() {
  const [jobDescription, setJobDescription] = useState("");
  const [chatIniciado, setChatIniciado] = useState(false);
  const [mensagens, setMensagens] = useState([]);
  const [inputUsuario, setInputUsuario] = useState("");
  const [loading, setLoading] = useState(false);

  const chatSessionRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  async function iniciarEntrevista() {
    if (!jobDescription) return;
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
      });

      const promptInicial = `
        Aja como um Entrevistador Técnico Sênior ranzinza e exigente.
        Estou me candidatando para esta vaga:
        "${jobDescription}"

        Sua missão:
        1. Me faça perguntas técnicas baseadas nessa vaga.
        2. Faça APENAS UMA pergunta por vez.
        3. Aguarde minha resposta.
        4. Quando eu responder, avalie se está certo ou errado, dê uma dica rápida e faça a próxima pergunta.
        5. Comece se apresentando e fazendo a primeira pergunta.
      `;

      const chat = model.startChat({
        history: [],
      });

      chatSessionRef.current = chat;

      const result = await chat.sendMessage(promptInicial);
      const text = result.response.text();

      setMensagens([{ role: "model", text: text }]);

      setChatIniciado(true);
    } catch (error) {
      alert("Erro ao iniciar: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function enviarMensagem() {
    if (!inputUsuario) return;

    const novaMensagemUsuario = { role: "user", text: inputUsuario };
    setMensagens((prev) => [...prev, novaMensagemUsuario]);
    setInputUsuario("");
    setLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage(inputUsuario);
      const text = result.response.text();

      setMensagens((prev) => [...prev, { role: "model", text: text }]);
    } catch (error) {
      console.error(error);
      setMensagens((prev) => [
        ...prev,
        { role: "model", text: "Erro: A conexão caiu. Tente de novo." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 font-sans">
      {!chatIniciado && (
        <div className="w-full max-w-2xl bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 mt-10">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">
            Simulador de Entrevista 🤖
          </h1>
          <p className="text-slate-400 mb-6">
            Cole a descrição da vaga e treine suas respostas técnicas.
          </p>

          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Descrição da Vaga:
          </label>
          <textarea
            className="w-full h-40 bg-slate-900 border border-slate-600 rounded-lg p-4 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Ex: Vaga React Júnior. Requisitos: Hooks, Context API, Tailwind, Git..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <button
            onClick={iniciarEntrevista}
            disabled={loading || !jobDescription}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? "Preparando a sala..." : "Começar Entrevista"}
          </button>
        </div>
      )}

      {chatIniciado && (
        <div className="w-full max-w-3xl flex flex-col h-[85vh] bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
          <div className="bg-slate-950 p-4 border-b border-slate-700 flex justify-between items-center">
            <h2 className="font-bold text-blue-400 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              Entrevistador AI
            </h2>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-slate-500 hover:text-red-400"
            >
              Encerrar
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
            {mensagens.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-700 text-slate-200 rounded-bl-none border border-slate-600"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      code: ({ node, ...props }) => (
                        <code
                          className="bg-black/30 rounded px-1 text-yellow-300 font-mono text-sm"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 p-3 rounded-2xl rounded-bl-none text-slate-400 text-sm italic animate-pulse">
                  Digitando...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 bg-slate-800 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 text-slate-200 focus:outline-none focus:border-blue-500"
              placeholder="Sua resposta..."
              value={inputUsuario}
              onChange={(e) => setInputUsuario(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
              disabled={loading}
            />
            <button
              onClick={enviarMensagem}
              disabled={loading || !inputUsuario}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
