import React, { useState } from 'react'
import './SampleDataViewer.css'

function SampleDataViewer({ tables }) {
  const [activeTable, setActiveTable] = useState(Object.keys(tables)[0])

  const tableNames = Object.keys(tables)

  return (
    <div className="sample-data-viewer">
      <h3>Sample Data</h3>
      
      <div className="table-tabs">
        {tableNames.map((tableName) => (
          <button
            key={tableName}
            className={`tab-button ${activeTable === tableName ? 'active' : ''}`}
            onClick={() => setActiveTable(tableName)}
          >
            {tableName}
          </button>
        ))}
      </div>

      {activeTable && (
        <div className="table-content">
          <div className="schema-info">
            <strong>Schema:</strong> {tables[activeTable].schema}
          </div>
          
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {tables[activeTable].sampleData[0] &&
                    Object.keys(tables[activeTable].sampleData[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {tables[activeTable].sampleData.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((value, cellIdx) => (
                      <td key={cellIdx}>{String(value)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default SampleDataViewer

