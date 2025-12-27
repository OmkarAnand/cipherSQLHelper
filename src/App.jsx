import React, { useState } from 'react'
import AssignmentList from './components/AssignmentList'
import AssignmentAttempt from './components/AssignmentAttempt'
import './App.css'

function App() {
  const [selectedAssignment, setSelectedAssignment] = useState(null)

  const handleSelectAssignment = (assignment) => {
    setSelectedAssignment(assignment)
  }

  const handleBackToList = () => {
    setSelectedAssignment(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>CipherSQLStudio</h1>
        <p>Practice SQL queries with real-time execution and intelligent hints</p>
      </header>
      
      {selectedAssignment ? (
        <AssignmentAttempt 
          assignment={selectedAssignment} 
          onBack={handleBackToList}
        />
      ) : (
        <AssignmentList onSelectAssignment={handleSelectAssignment} />
      )}
    </div>
  )
}

export default App

