import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import ResultCard from "./ResultCard";

const questions = [
  {
    q: "When learning something new, what helps you the most?",
    options: [
      { id: "A", text: "Diagrams & images (I learn by seeing)" },
      { id: "B", text: "Listening to explanations (I learn by hearing)" },
      { id: "C", text: "Reading notes / texts (I learn by reading/writing)" },
      { id: "D", text: "Hands-on doing (I learn by doing)" }
    ]
  },
  {
    q: "In a classroom, you prefer:",
    options: [
      { id: "A", text: "Slides and charts" },
      { id: "B", text: "Teacher’s voice and discussion" },
      { id: "C", text: "Books and handouts" },
      { id: "D", text: "Experiments or demos" }
    ]
  },
  {
    q: "When remembering something, you:",
    options: [
      { id: "A", text: "Visualize it in your mind" },
      { id: "B", text: "Repeat it out loud" },
      { id: "C", text: "Write it down" },
      { id: "D", text: "Re-enact or try it" }
    ]
  },
  {
    q: "You prefer study material as:",
    options: [
      { id: "A", text: "Mind-maps and infographics" },
      { id: "B", text: "Podcasts or lectures" },
      { id: "C", text: "Articles or PDFs" },
      { id: "D", text: "Interactive apps" }
    ]
  },
  {
    q: "When solving problems, you:",
    options: [
      { id: "A", text: "Sketch or draw solutions" },
      { id: "B", text: "Discuss with someone" },
      { id: "C", text: "Refer to written steps" },
      { id: "D", text: "Try and iterate physically" }
    ]
  },
  {
    q: "If instructions are given, you like:",
    options: [
      { id: "A", text: "Flowcharts and diagrams" },
      { id: "B", text: "A verbal walkthrough" },
      { id: "C", text: "Detailed written steps" },
      { id: "D", text: "To try it myself" }
    ]
  },
  {
    q: "In free time, you enjoy:",
    options: [
      { id: "A", text: "Watching videos or art" },
      { id: "B", text: "Listening to music or podcasts" },
      { id: "C", text: "Reading blogs or writing" },
      { id: "D", text: "DIY and hands-on projects" }
    ]
  },
  {
    q: "While studying, you prefer:",
    options: [
      { id: "A", text: "Colors & diagrams" },
      { id: "B", text: "Audio explanations" },
      { id: "C", text: "Highlighting & notes" },
      { id: "D", text: "Practicing with tools" }
    ]
  },
  {
    q: "You remember people by:",
    options: [
      { id: "A", text: "Their face (visual)" },
      { id: "B", text: "Their voice (auditory)" },
      { id: "C", text: "Their name or notes" },
      { id: "D", text: "What you did together" }
    ]
  },
  {
    q: "Best learning environment for you:",
    options: [
      { id: "A", text: "Visual boards & slides" },
      { id: "B", text: "Group discussions / lectures" },
      { id: "C", text: "Quiet reading space" },
      { id: "D", text: "Labs and activities" }
    ]
  }
];

export default function LearnStylePredictor() {
  const [idx, setIdx] = useState(0);
  const [selections, setSelections] = useState(Array(questions.length).fill(null));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const selectOption = (qIndex, option) => {
    const copy = [...selections];
    copy[qIndex] = option.text; // send the full option text to backend for Gemini prompt
    setSelections(copy);
  };

  const next = () => setIdx((i) => Math.min(i + 1, questions.length - 1));
  const prev = () => setIdx((i) => Math.max(i - 1, 0));

  const submit = async () => {
    if (selections.some((s) => !s)) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/predict-style", {
        answers: selections
      });
      setResult(res.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("Error calling API. See console.");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="app">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="container">
          <ResultCard data={result} onRetake={() => { setResult(null); setSelections(Array(questions.length).fill(null)); setIdx(0); }} />
        </motion.div>
        <Confetti />
      </div>
    );
  }

  return (
    <div className="app">
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="container">
        <h1 className="title">Discover Your Learning Style</h1>

        <div className="progress">
          Question {idx + 1} / {questions.length}
          <div className="bar">
            <div className="bar-fill" style={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        <div className="card">
          <h3>{questions[idx].q}</h3>
          <div className="options">
            {questions[idx].options.map((opt) => (
              <button
                key={opt.id}
                className={`option ${selections[idx] === opt.text ? "selected" : ""}`}
                onClick={() => selectOption(idx, opt)}
              >
                <span className="opt-id">{opt.id}</span>
                <span>{opt.text}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="controls">
          <button onClick={prev} disabled={idx === 0}>Previous</button>
          {idx < questions.length - 1 ? (
            <button onClick={next}>Next</button>
          ) : (
            <button onClick={submit} className="primary" disabled={loading}>
              {loading ? "Analyzing..." : "Submit"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
