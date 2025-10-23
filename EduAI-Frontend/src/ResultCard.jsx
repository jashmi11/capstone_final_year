import React from "react";
import { motion } from "framer-motion";

export default function ResultCard({ data, onRetake }) {
  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="result-container">
      <div className="result-card">
        <h2>{data.learning_style}</h2>
        <p className="summary">{data.summary}</p>
        <div className="actions">
          <button onClick={onRetake}>Retake Quiz</button>
        </div>
      </div>
    </motion.div>
  );
}
