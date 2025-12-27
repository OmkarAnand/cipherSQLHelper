# CipherSQLStudio - Simple Data Flow (Easy to Understand)

## 🎯 Quick Overview

```
START
  ↓
User opens browser
  ↓
App loads (App.jsx)
  ↓
Shows Assignment List
  ↓
User clicks an assignment
  ↓
Shows Assignment Attempt screen
  ↓
User writes SQL query
  ↓
User clicks "Execute"
  ↓
SQL Executor processes query
  ↓
Results displayed
```

---

## 📊 Step-by-Step Data Flow

### Step 1: App Starts

```
1. index.html loads
   └─→ Has <div id="root"> (empty container)

2. main.jsx runs
   └─→ Finds <div id="root">
   └─→ Renders <App /> inside it

3. App.jsx renders
   └─→ State: selectedAssignment = null (nothing selected yet)
   └─→ Shows: <AssignmentList />
```

**Data:** No user data yet, just showing the list

---

### Step 2: Display Assignments

```
AssignmentList component:
  └─→ Reads: src/data/assignments.js
  └─→ Gets: Array of 3 assignments
  └─→ Creates: 3 clickable cards
  └─→ Shows: Title, difficulty, description
```

**Data Flow:**
```
assignments.js (file)
  ↓ (import)
AssignmentList component
  ↓ (map through array)
Display cards in UI
```

---

### Step 3: User Selects Assignment

```
User clicks: "Basic SELECT Queries" card
  ↓
AssignmentList calls: onSelectAssignment(assignment)
  ↓
App.jsx receives: handleSelectAssignment(assignment)
  ↓
App.jsx updates: setSelectedAssignment(assignment)
  ↓
App.jsx re-renders
  ↓
Shows: <AssignmentAttempt assignment={assignment} />
```

**Data Flow:**
```
Assignment object (from assignments.js)
  ↓ (passed as prop)
AssignmentAttempt component
  ↓ (extracted)
  ├─→ assignment.question → QuestionPanel
  ├─→ assignment.tables → SampleDataViewer
  └─→ assignment.tables → Used for SQL execution
```

---

### Step 4: User Writes SQL Query

```
User types in Monaco Editor:
  "SELECT * FROM employees WHERE salary > 50000"
  ↓
Editor onChange event fires
  ↓
AssignmentAttempt updates: setSqlQuery("SELECT * FROM...")
  ↓
State stored in: sqlQuery variable
```

**Data:** SQL query string stored in component state

---

### Step 5: User Executes Query

```
User clicks "Execute Query" button
  ↓
handleExecute() function runs
  ↓
Calls: executeSQL(sqlQuery, assignment.tables)
  ↓
sqlExecutor.js processes:
  ├─→ Input: Query string + Table data
  ├─→ Parse query (find table, WHERE condition, etc.)
  ├─→ Get data from: assignment.tables.employees.sampleData
  ├─→ Apply WHERE filter: salary > 50000
  └─→ Return: Filtered results array
  ↓
Results stored: setResults([...filtered rows...])
  ↓
ResultsPanel displays: Table with results
```

**Data Transformation:**
```
Input:
  Query: "SELECT * FROM employees WHERE salary > 50000"
  Data: All 5 employee records

Process:
  Filter: Keep only records where salary > 50000

Output:
  Results: 4 employee records (salaries > 50000)
  Displayed as table
```

---

### Step 6: User Requests Hint

```
User clicks "Get Hint" button
  ↓
handleGetHint() function runs
  ↓
Calls: getHint(assignment.question, sqlQuery)
  ↓
llmService.js processes:
  ├─→ Input: Question text + Current query
  ├─→ Analyzes what user has written
  └─→ Returns: Helpful hint text
  ↓
Hint stored: setHint("You need to filter...")
  ↓
Hint panel displays below editor
```

**Data Flow:**
```
Input:
  Question: "Write a SQL query to..."
  Query: "SELECT * FROM employees"

Process:
  Analyze → Generate contextual hint

Output:
  Hint: "You need to filter the results. Consider using a WHERE clause..."
```

---

## 🔄 How Components Share Data

### Parent → Child (Props)

```
App.jsx (Parent)
  │
  ├─→ Passes assignment to:
  │   └─→ AssignmentAttempt (Child)
  │       │
  │       ├─→ Passes question to:
  │       │   └─→ QuestionPanel
  │       │
  │       ├─→ Passes tables to:
  │       │   └─→ SampleDataViewer
  │       │
  │       └─→ Passes results to:
  │           └─→ ResultsPanel
```

**Rule:** Data flows DOWN from parent to child via props

---

### Child → Parent (Callbacks)

```
AssignmentList (Child)
  │
  └─→ Calls: onSelectAssignment(assignment)
      │
      └─→ App.jsx (Parent)
          │
          └─→ Updates state: setSelectedAssignment(assignment)
```

**Rule:** Events flow UP from child to parent via callback functions

---

## 📦 What Data is Stored Where?

### 1. Static Data (Never Changes)
- **Location:** `src/data/assignments.js`
- **Contains:** All assignments, questions, sample data
- **Used by:** AssignmentList, AssignmentAttempt

### 2. App State (Changes When User Selects Assignment)
- **Location:** `App.jsx`
- **State:** `selectedAssignment`
- **Values:** `null` or `{assignment object}`
- **Controls:** Which screen to show

### 3. Assignment Attempt State (Changes as User Works)
- **Location:** `AssignmentAttempt.jsx`
- **States:**
  - `sqlQuery`: What user typed in editor
  - `results`: Query execution results
  - `error`: Error message (if any)
  - `loading`: Is query executing?
  - `hint`: Current hint text

---

## 🎬 Complete Example Flow

Let's trace a complete example:

### Scenario: User executes "SELECT * FROM employees WHERE salary > 50000"

```
1. INITIAL STATE
   App.jsx: selectedAssignment = {id: 1, title: "Basic SELECT...", ...}
   AssignmentAttempt: sqlQuery = "SELECT * FROM employees WHERE salary > 50000"

2. USER CLICKS "EXECUTE"
   ↓
3. handleExecute() runs
   ↓
4. Calls executeSQL("SELECT * FROM...", assignment.tables)
   ↓
5. sqlExecutor.js:
   ├─→ Finds table: "employees"
   ├─→ Gets data: [
   │     {id: 1, name: "John", salary: 75000},
   │     {id: 2, name: "Jane", salary: 60000},
   │     {id: 3, name: "Bob", salary: 45000},
   │     {id: 4, name: "Alice", salary: 55000},
   │     {id: 5, name: "Charlie", salary: 80000}
   │   ]
   ├─→ Applies WHERE: salary > 50000
   └─→ Returns: [
         {id: 1, name: "John", salary: 75000},
         {id: 2, name: "Jane", salary: 60000},
         {id: 4, name: "Alice", salary: 55000},
         {id: 5, name: "Charlie", salary: 80000}
       ]
   ↓
6. AssignmentAttempt: setResults([...filtered array...])
   ↓
7. React re-renders ResultsPanel
   ↓
8. ResultsPanel displays table with 4 rows
```

---

## 🔑 Key Concepts

### 1. Unidirectional Data Flow
```
Data flows in ONE direction:
  Parent → Child → Child
  (via props)
  
Events flow UP:
  Child → Parent → Parent
  (via callbacks)
```

### 2. State vs Props
- **Props**: Data passed FROM parent TO child (read-only)
- **State**: Data managed BY component itself (can change)

### 3. Re-rendering
- When state changes → Component re-renders
- Child components update automatically
- Only affected components re-render (React is smart!)

---

## 💡 Simple Mental Model

Think of it like a **restaurant**:

1. **assignments.js** = Menu (list of all dishes/assignments)
2. **AssignmentList** = Waiter showing you the menu
3. **User** = Customer choosing a dish
4. **AssignmentAttempt** = Kitchen where you cook (work on assignment)
5. **SQL Executor** = Cooking process (processes your query)
6. **ResultsPanel** = Plated dish (your results)
7. **Hint System** = Recipe hints (helps you cook better)

**Flow:**
```
Menu → Choose dish → Go to kitchen → Cook → Serve dish
```

---

## ✅ Quick Checklist

To understand the data flow, make sure you know:

- [ ] Where assignments are stored (assignments.js)
- [ ] How user selection works (App.jsx state)
- [ ] Where SQL query is stored (AssignmentAttempt state)
- [ ] How SQL execution works (sqlExecutor.js processes query)
- [ ] Where results are stored (AssignmentAttempt state → ResultsPanel)
- [ ] How hints work (llmService.js → hint state → UI)

---

**Remember:** Data flows DOWN, Events flow UP! 🎯

