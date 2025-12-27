import React from 'react'
import './ResultsPanel.css'

function ResultsPanel({ results, error }) {
  if (error) {
    return (
      <div className="results-panel error-panel">
        <h3>Error</h3>
        <div className="error-message">{error}</div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="results-panel empty-panel">
        <h3>Results</h3>
        <div className="empty-message">Execute a query to see results here</div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="results-panel">
        <h3>Results</h3>
        <div className="empty-message">Query executed successfully. No rows returned.</div>
      </div>
    )
  }

  const columns = Object.keys(results[0])

  return (
    <div className="results-panel">
      <h3>Results ({results.length} row{results.length !== 1 ? 's' : ''})</h3>
      <div className="results-table-container">
        <table className="results-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col}>{String(row[col] ?? 'NULL')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResultsPanel

