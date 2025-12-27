import React, { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { executeSQL } from '../utils/sqlExecutor'
import { getHint } from '../utils/llmService'
import QuestionPanel from './QuestionPanel'
import SampleDataViewer from './SampleDataViewer'
import ResultsPanel from './ResultsPanel'
import './AssignmentAttempt.css'

function AssignmentAttempt({ assignment, onBack }) {
  const [sqlQuery, setSqlQuery] = useState('')
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hint, setHint] = useState(null)
  const [hintLoading, setHintLoading] = useState(false)

  useEffect(() => {
    // Initialize database with sample data when component mounts
    executeSQL('', assignment.tables)
  }, [assignment])

  const handleExecute = async () => {
    if (!sqlQuery.trim()) {
      setError('Please enter a SQL query')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const queryResults = executeSQL(sqlQuery, assignment.tables)
      setResults(queryResults)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGetHint = async () => {
    setHintLoading(true)
    setHint(null)
    
    try {
      const hintText = await getHint(assignment.question, sqlQuery)
      setHint(hintText)
    } catch (err) {
      setError('Failed to get hint. Please try again.')
    } finally {
      setHintLoading(false)
    }
  }

  return (
    <div className="assignment-attempt">
      <div className="attempt-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Assignments
        </button>
        <h2>{assignment.title}</h2>
      </div>

      <div className="attempt-layout">
        <div className="left-panel">
          <QuestionPanel question={assignment.question} />
          <SampleDataViewer tables={assignment.tables} />
        </div>

        <div className="right-panel">
          <div className="editor-section">
            <div className="editor-header">
              <h3>SQL Editor</h3>
              <div className="editor-actions">
                <button 
                  className="hint-button" 
                  onClick={handleGetHint}
                  disabled={hintLoading}
                >
                  {hintLoading ? 'Loading...' : 'Get Hint'}
                </button>
                <button 
                  className="execute-button" 
                  onClick={handleExecute}
                  disabled={loading}
                >
                  {loading ? 'Executing...' : 'Execute Query'}
                </button>
              </div>
            </div>
            
            <div className="editor-container">
              <Editor
                height="300px"
                defaultLanguage="sql"
                value={sqlQuery}
                onChange={(value) => setSqlQuery(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on'
                }}
              />
            </div>

            {hint && (
              <div className="hint-panel">
                <h4>💡 Hint</h4>
                <p>{hint}</p>
              </div>
            )}
          </div>

          <ResultsPanel results={results} error={error} />
        </div>
      </div>
    </div>
  )
}

export default AssignmentAttempt

