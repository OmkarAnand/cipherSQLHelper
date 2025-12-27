import React from 'react'
import { assignments } from '../data/assignments'
import './AssignmentList.css'

function AssignmentList({ onSelectAssignment }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return '#4caf50'
      case 'Medium':
        return '#ff9800'
      case 'Hard':
        return '#f44336'
      default:
        return '#757575'
    }
  }

  return (
    <div className="assignment-list-container">
      <div className="assignment-list">
        <h2>Available Assignments</h2>
        <div className="assignments-grid">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="assignment-card"
              onClick={() => onSelectAssignment(assignment)}
            >
              <div className="assignment-header">
                <h3>{assignment.title}</h3>
                <span
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(assignment.difficulty) }}
                >
                  {assignment.difficulty}
                </span>
              </div>
              <p className="assignment-description">{assignment.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AssignmentList

