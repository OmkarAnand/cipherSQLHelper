# CipherSQLStudio

A browser-based SQL learning platform where students can practice SQL queries against pre-configured assignments with real-time execution and intelligent hints.

## Features

- **Assignment Listing Page**: Browse available SQL assignments with difficulty levels
- **Assignment Attempt Interface**: 
  - Question Panel displaying assignment requirements
  - Sample Data Viewer showing table schemas and sample data
  - SQL Editor with Monaco Editor for writing queries
  - Results Panel displaying query execution results
  - LLM Hint Integration for getting guidance (not solutions)

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
  ├── components/
  │   ├── AssignmentList.jsx      # Assignment listing page
  │   ├── AssignmentAttempt.jsx   # Main attempt interface
  │   ├── QuestionPanel.jsx       # Question display
  │   ├── SampleDataViewer.jsx    # Table schema and data viewer
  │   └── ResultsPanel.jsx        # Query results display
  ├── data/
  │   └── assignments.js          # Sample assignments and data
  ├── utils/
  │   ├── sqlExecutor.js          # SQL query execution engine
  │   └── llmService.js           # LLM hint integration
  ├── App.jsx                     # Main app component
  └── main.jsx                    # Entry point
```

## Customization

### Adding New Assignments

Edit `src/data/assignments.js` to add new assignments with their questions and sample data.

### Integrating Real LLM API

Edit `src/utils/llmService.js` and replace the mock implementation with your actual LLM API call. The file includes commented examples for API integration.

## Technologies Used

- React 18
- Vite
- Monaco Editor (VS Code editor)
- SQL.js (for client-side SQL execution)

## Notes

- This is a simplified implementation focused on the user experience
- The SQL executor handles basic SELECT queries with WHERE, JOIN, GROUP BY, and ORDER BY
- For production use, you may want to integrate a more robust SQL parser or backend service
- The LLM hint service includes a placeholder that can be easily replaced with actual API integration

