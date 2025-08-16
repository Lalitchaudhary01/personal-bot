import React, { useState, useEffect } from "react";
import {
  FaRobot,
  FaHome,
  FaHistory,
  FaBook,
  FaCode,
  FaCog,
  FaMoon,
  FaUser,
  FaFire,
  FaQuestionCircle,
  FaGraduationCap,
  FaInfoCircle,
  FaTerminal,
  FaPaperPlane,
  FaCodeBranch,
  FaLanguage,
  FaChevronRight,
  FaExclamationCircle,
  FaBug,
  FaBan,
  FaExclamationTriangle,
  FaCrown,
  FaStar,
  FaGem,
  FaLightbulb,
  FaRocket,
  FaBolt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const CodeMasterPro = () => {
  const [question, setQuestion] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get API key from environment variable
  const GEMINI_API_KEY = "AIzaSyDpoqLE6ORAzcEoAQpQv5oE-lTw3chCBKQ";
  const MODEL_NAME = "gemini-1.5-flash";

  const systemInstructionText =
    "You are CodeMaster Pro, an elite AI coding mentor and instructor. You provide detailed, professional explanations for coding problems with examples and best practices. If asked non-coding questions, politely redirect users to coding topics while maintaining your professional demeanor.";

  const menuItems = [
    {
      name: "Dashboard",
      icon: FaHome,
    },
    {
      name: "Code History",
      icon: FaHistory,
    },
    {
      name: "Master Classes",
      icon: FaBook,
    },
    {
      name: "Live Coding",
      icon: FaCode,
    },
    {
      name: "Pro Settings",
      icon: FaCog,
    },
  ];

  const masterTopics = [
    "Advanced JavaScript Patterns",
    "System Design Principles",
    "Algorithm Optimization",
    "Clean Architecture",
    "Performance Engineering",
  ];

  useEffect(() => {
    setTimeout(() => {
      setOutput(`# 🎯 Welcome to CodeMaster Pro!

**Your Elite AI Coding Mentor is Ready**

I'm here to elevate your programming skills with detailed explanations, best practices, and industry-standard solutions.

## 💡 Sample Interaction

**Question:** What are JavaScript closures and their practical applications?

**Professional Answer:** A closure is a powerful JavaScript concept where an inner function retains access to variables from its outer function's scope, even after the outer function has completed execution. This creates a persistent lexical environment.

### Real-World Example:
\`\`\`javascript
// Module Pattern using Closures
const createCounter = (initialValue = 0) => {
  let count = initialValue; // Private variable
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count,
    reset: () => count = initialValue
  };
};

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.getValue());  // 11
// count variable remains private and secure
\`\`\`

### Professional Applications:
- **Data Privacy**: Encapsulating variables
- **Module Patterns**: Creating clean APIs
- **Event Handlers**: Maintaining state
- **Functional Programming**: Creating specialized functions

Ready to master advanced coding concepts? Ask away! 🚀`);
    }, 2000);
  }, []);

  const handleSubmit = async () => {
    if (!question.trim()) {
      setOutput(
        "⚡ Please enter your coding question to unlock elite insights!"
      );
      return;
    }

    if (!GEMINI_API_KEY) {
      setOutput(
        "❌ API Key not found. Please add VITE_GEMINI_API_KEY to your .env file."
      );
      return;
    }

    setIsLoading(true);
    setOutput("");

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: question }],
        },
      ],
      systemInstruction: {
        parts: [{ text: systemInstructionText }],
      },
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let errorMsg = `API Error: ${response.status}`;
        let errorDetails = "Could not retrieve error details.";

        try {
          const errorData = await response.json();
          if (errorData.error?.message) {
            errorDetails = errorData.error.message;
          }
          errorMsg = `${errorMsg} - ${errorDetails}`;

          if (errorData.error?.status) {
            errorMsg += ` (Status: ${errorData.error.status})`;
          }

          if (
            errorDetails.toLowerCase().includes("api key not valid") ||
            errorDetails.toLowerCase().includes("permission denied")
          ) {
            errorMsg +=
              "\n\n**Please verify your API credentials and ensure Gemini API access is properly configured.**";
          }
        } catch (parseError) {
          errorMsg = `${errorMsg} (Could not parse error response: ${response.statusText})`;
        }

        throw new Error(errorMsg);
      }

      const data = await response.json();

      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const answerText = data.candidates[0].content.parts[0].text;
        setOutput(answerText);
      } else if (data.promptFeedback?.blockReason) {
        setOutput(
          `🛡️ Content filtered due to: ${data.promptFeedback.blockReason}. ${
            data.promptFeedback.blockReasonMessage || ""
          }`
        );
      } else {
        setOutput(
          "⚠️ Received unexpected response structure from the AI service."
        );
      }
    } catch (error) {
      setOutput(`💥 System Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatOutput = (text) => {
    if (!text) return "";

    return text.split("\n\n").map((paragraph, index) => {
      if (paragraph.trim() === "") return null;

      // Handle markdown headers
      if (paragraph.startsWith("# ")) {
        return (
          <h1
            key={index}
            className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3"
          >
            <FaCrown className="text-gray-300 text-lg sm:text-xl" />
            {paragraph.substring(2)}
          </h1>
        );
      }

      if (paragraph.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="text-xl sm:text-2xl font-bold text-gray-200 mb-3 sm:mb-4 flex items-center gap-2"
          >
            <FaStar className="text-gray-300 text-sm sm:text-base" />
            {paragraph.substring(3)}
          </h2>
        );
      }

      if (paragraph.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="text-lg sm:text-xl font-semibold text-gray-300 mb-2 sm:mb-3 flex items-center gap-2"
          >
            <FaGem className="text-gray-400 text-sm" />
            {paragraph.substring(4)}
          </h3>
        );
      }

      // Handle code blocks
      if (paragraph.includes("```")) {
        const parts = paragraph.split("```");
        return (
          <div key={index} className="mb-4 sm:mb-6">
            {parts.map((part, partIndex) => {
              if (partIndex % 2 === 1) {
                return (
                  <div key={partIndex} className="relative">
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1 sm:gap-2 text-xs text-gray-400 font-semibold">
                      <FaCode className="text-xs" />
                      <span className="hidden sm:inline">PRO CODE</span>
                    </div>
                    <pre className="bg-black text-gray-300 p-3 sm:p-6 rounded-xl overflow-x-auto font-mono text-xs sm:text-sm my-4 border border-gray-600 shadow-2xl">
                      <code>{part.trim()}</code>
                    </pre>
                  </div>
                );
              } else {
                return part.trim() ? (
                  <div
                    key={partIndex}
                    className="mb-3 sm:mb-4 leading-6 sm:leading-8 text-sm sm:text-base text-gray-300"
                  >
                    {part.split("`").map((textPart, textIndex) => {
                      if (textIndex % 2 === 1) {
                        return (
                          <code
                            key={textIndex}
                            className="bg-gray-800 text-gray-200 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-mono border border-gray-600"
                          >
                            {textPart}
                          </code>
                        );
                      }
                      return textPart;
                    })}
                  </div>
                ) : null;
              }
            })}
          </div>
        );
      }

      // Regular paragraph with inline code
      return (
        <div
          key={index}
          className="mb-4 sm:mb-6 leading-6 sm:leading-8 text-sm sm:text-base text-gray-300"
        >
          {paragraph.split("`").map((part, partIndex) => {
            if (partIndex % 2 === 1) {
              return (
                <code
                  key={partIndex}
                  className="bg-gray-800 text-gray-200 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-mono border border-gray-600"
                >
                  {part}
                </code>
              );
            }
            return part;
          })}
        </div>
      );
    });
  };

  return (
    <div className="flex min-h-screen bg-black text-gray-100 overflow-x-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-800 border border-gray-600 p-3 rounded-xl hover:bg-gray-700 transition-all shadow-lg"
      >
        {sidebarOpen ? (
          <FaTimes className="text-white w-5 h-5" />
        ) : (
          <FaBars className="text-white w-5 h-5" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`
        w-full sm:w-80 bg-gray-900 h-screen fixed left-0 top-0 p-4 sm:p-6 border-r border-gray-700 shadow-2xl flex flex-col z-40
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:w-80
      `}
      >
        <div className="flex items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-700 mb-4 sm:mb-6 mt-12 lg:mt-0">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl">
            <FaCrown className="text-lg sm:text-2xl text-black" />
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-bold text-white">
              CodeMaster Pro
            </div>
            <div className="text-xs text-gray-400 font-semibold flex items-center gap-1">
              <FaBolt className="text-xs" />
              Elite AI Mentor
            </div>
          </div>
        </div>

        <div className="flex-grow">
          {menuItems.map((item, index) => (
            <div
              key={item.name}
              onClick={() => {
                setActiveMenu(item.name);
                setSidebarOpen(false);
              }}
              className={`group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl mb-2 sm:mb-3 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                activeMenu === item.name
                  ? "bg-gray-800 text-white shadow-lg border border-gray-600"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white hover:shadow-lg"
              }`}
            >
              <div className="p-2 rounded-lg bg-gray-700 shadow-lg">
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="font-semibold text-sm sm:text-base">
                {item.name}
              </span>
              {activeMenu === item.name && (
                <FaChevronRight className="ml-auto text-gray-300" />
              )}
            </div>
          ))}
        </div>

        <div className="pt-4 sm:pt-6 border-t border-gray-700 text-center">
          <div className="bg-gray-800 border border-gray-600 rounded-xl p-3 sm:p-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaGem className="text-white" />
              <span className="font-bold text-white text-sm sm:text-base">
                PRO VERSION
              </span>
            </div>
            <p className="text-xs text-gray-400">Powered by Gemini AI</p>
            <p className="text-xs text-gray-400">Advanced Coding Mentor</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-80 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div className="ml-12 lg:ml-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
              CodeMaster Pro
            </h1>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg flex items-center gap-2">
              <FaRocket className="text-gray-300" />
              Your Elite AI Coding Mentor
            </p>
          </div>
          <div className="flex gap-2 sm:gap-4 ml-12 lg:ml-0">
            <button className="flex items-center gap-2 bg-gray-800 border border-gray-600 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl hover:bg-gray-700 transition-all shadow-lg">
              <FaMoon className="text-gray-300" />
              <span className="hidden sm:block font-semibold text-sm lg:text-base">
                Dark Mode
              </span>
            </button>
            <button className="flex items-center gap-2 bg-gray-800 border border-gray-600 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl hover:bg-gray-700 transition-all shadow-lg">
              <FaUser className="text-gray-300" />
              <span className="hidden sm:block font-semibold text-sm lg:text-base">
                Profile
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Input Section */}
          <div className="bg-gray-900 rounded-2xl sm:rounded-3xl border border-gray-700 shadow-2xl">
            <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-700">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FaLightbulb className="text-black text-sm sm:text-base" />
                </div>
                Ask Your Coding Question
              </h2>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="bg-gray-800 border-l-4 border-white p-4 sm:p-6 rounded-xl sm:rounded-2xl mb-6 sm:mb-8">
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaInfoCircle className="text-black text-sm sm:text-base" />
                  </div>
                  <div>
                    <p className="mb-2 sm:mb-3 leading-6 sm:leading-7 font-semibold text-gray-200 text-sm sm:text-base">
                      <strong className="text-white">Pro Instructions:</strong>{" "}
                      Ask any advanced coding question across multiple
                      programming languages. Get detailed explanations with
                      industry best practices.
                    </p>
                    <p className="leading-6 sm:leading-7 text-gray-400 text-xs sm:text-sm">
                      For optimal results, include context about your skill
                      level and specific requirements.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4 sm:mb-6">
                  <label className="block mb-3 sm:mb-4 font-bold flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center">
                      <FaTerminal className="text-black text-xs sm:text-sm" />
                    </div>
                    Your Professional Query
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full p-4 sm:p-6 border border-gray-600 rounded-xl sm:rounded-2xl text-sm sm:text-base min-h-[120px] sm:min-h-[180px] resize-y transition-all bg-gray-800 text-gray-100 font-mono focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-400/20 shadow-inner"
                    placeholder="e.g., Explain advanced React patterns like render props and HOCs with performance considerations..."
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold transition-all flex items-center justify-center gap-3 sm:gap-4 ${
                    isLoading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-white text-black hover:-translate-y-1 shadow-2xl hover:bg-gray-200"
                  }`}
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-black/20 rounded-lg flex items-center justify-center">
                    <FaPaperPlane className="text-xs sm:text-sm" />
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg">
                    {isLoading
                      ? "CodeMaster is Analyzing..."
                      : "Get Elite Coding Insights"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-gray-900 rounded-2xl sm:rounded-3xl border border-gray-700 shadow-2xl">
            <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-700">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FaGraduationCap className="text-black text-sm sm:text-base" />
                </div>
                Master's Professional Analysis
              </h2>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
              {isLoading && (
                <div className="text-center p-8 sm:p-12">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin mx-auto mb-4 sm:mb-6"></div>
                  <div className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3">
                    CodeMaster Pro is Analyzing
                  </div>
                  <p className="text-gray-400 text-sm sm:text-base">
                    Crafting the perfect solution with industry best
                    practices...
                  </p>
                </div>
              )}

              <div className="rounded-xl sm:rounded-2xl border border-gray-700 bg-gray-800 shadow-inner">
                <div className="p-4 sm:p-6 lg:p-10 min-h-[200px] sm:min-h-[300px] max-h-[400px] sm:max-h-[600px] overflow-y-auto text-sm sm:text-base">
                  {formatOutput(output)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeMasterPro;
