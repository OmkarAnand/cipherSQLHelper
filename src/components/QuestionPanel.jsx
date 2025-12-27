import React from 'react'
import './QuestionPanel.css'

function QuestionPanel({ question }) {
  return (
    <div className="question-panel">
      <h3>Question</h3>
      <div className="question-content">
        <p>{question}</p>
      </div>
    </div>
  )
}

export default QuestionPanel

