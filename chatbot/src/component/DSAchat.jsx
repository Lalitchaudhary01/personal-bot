import { useState } from "react";

export default function DSAChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setAnswer(data.answer || "No answer from AI");
    } catch (err) {
      console.error(err);
      setAnswer("Error fetching answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-black rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">💬 DSA Chatbot</h2>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a DSA question..."
        rows={4}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />

      <button
        onClick={askQuestion}
        disabled={loading}
        className={`mt-4 px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      {answer && (
        <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
          <strong className="text-gray-700">Answer:</strong>
          <p className="mt-2 text-gray-800">{answer}</p>
        </div>
      )}
    </div>
  );
}
