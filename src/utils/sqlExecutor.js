// Simple SQL executor for client-side query execution
// This is a simplified implementation that handles basic SQL operations

let dbCache = null

export function executeSQL(query, tables) {
  if (!query || !query.trim()) {
    return []
  }

  const normalizedQuery = query.trim().toUpperCase()

  // Handle SELECT queries
  if (normalizedQuery.startsWith('SELECT')) {
    return executeSelect(query, tables)
  }

  // Handle other query types (INSERT, UPDATE, DELETE) - return empty for now
  // In a real implementation, you'd want to handle these properly
  throw new Error('Only SELECT queries are supported in this demo')
}

function executeSelect(query, tables) {
  // Simple SQL parser for basic SELECT queries
  // This is a simplified implementation - a real one would use a proper SQL parser

  try {
    // Extract table name from query (simplified)
    const tableMatch = query.match(/FROM\s+(\w+)/i)
    if (!tableMatch) {
      throw new Error('No table specified in FROM clause')
    }

    const tableName = tableMatch[1].toLowerCase()
    if (!tables[tableName]) {
      throw new Error(`Table '${tableName}' does not exist`)
    }

    let data = [...tables[tableName].sampleData]

    // Handle JOIN first (before WHERE)
    if (query.match(/\bJOIN\b/i)) {
      data = applyJoin(query, data, tables)
    }

    // Handle WHERE clause - extract condition more reliably
    const whereIndex = query.toUpperCase().indexOf('WHERE')
    if (whereIndex !== -1) {
      let whereEnd = query.length
      
      // Find where the WHERE clause ends (before ORDER BY, GROUP BY, or end of query)
      const orderByIndex = query.toUpperCase().indexOf('ORDER BY', whereIndex)
      const groupByIndex = query.toUpperCase().indexOf('GROUP BY', whereIndex)
      
      if (orderByIndex !== -1 && orderByIndex < whereEnd) {
        whereEnd = orderByIndex
      }
      if (groupByIndex !== -1 && groupByIndex < whereEnd) {
        whereEnd = groupByIndex
      }
      
      const whereClause = query.substring(whereIndex + 5, whereEnd).trim()
      // Remove any trailing semicolon
      const cleanCondition = whereClause.replace(/;+$/, '').trim()
      
      if (cleanCondition) {
        data = applyWhereClause(data, cleanCondition)
      }
    }

    // Handle GROUP BY
    if (query.match(/\bGROUP\s+BY\b/i)) {
      data = applyGroupBy(query, data)
    }

    // Handle ORDER BY
    if (query.match(/\bORDER\s+BY\b/i)) {
      data = applyOrderBy(query, data)
    }

    // Select columns
    const selectMatch = query.match(/SELECT\s+(.+?)\s+FROM/i)
    if (selectMatch) {
      const columns = selectMatch[1].trim()
      if (columns === '*') {
        return data
      } else {
        return selectColumns(data, columns)
      }
    }

    return data
  } catch (error) {
    throw new Error(`SQL Error: ${error.message}`)
  }
}

function applyWhereClause(data, condition) {
  // Simple WHERE clause parser
  // Handles: column operator value (e.g., salary > 50000)
  
  // Remove any trailing semicolons or whitespace
  condition = condition.trim().replace(/;+$/, '')
  
  // Try to match operators in order of specificity (longer first to avoid matching < in <=)
  const operators = ['>=', '<=', '!=', '>', '<', '=']
  let operator = null
  let parts = null

  for (const op of operators) {
    if (condition.includes(op)) {
      operator = op
      // Find the first occurrence of the operator
      const splitIndex = condition.indexOf(op)
      if (splitIndex > 0) {
        parts = [
          condition.substring(0, splitIndex).trim(),
          condition.substring(splitIndex + op.length).trim()
        ]
        // Only break if we got valid parts
        if (parts.length === 2 && parts[0] && parts[1]) {
          break
        }
      }
    }
  }

  if (!operator || !parts || parts.length !== 2 || !parts[0] || !parts[1]) {
    // If we can't parse, return original data but log for debugging
    console.warn('Could not parse WHERE condition:', condition)
    return data
  }

  const [column, value] = parts
  // Remove quotes if present
  const cleanValue = value.replace(/^['"]|['"]$/g, '').trim()
  const numValue = Number(cleanValue)
  const isNumeric = !isNaN(numValue) && cleanValue !== '' && !isNaN(cleanValue)

  return data.filter(row => {
    if (!row.hasOwnProperty(column)) {
      return false
    }

    const rowValue = row[column]
    const numRowValue = Number(rowValue)
    const rowIsNumeric = !isNaN(numRowValue) && rowValue !== null && rowValue !== undefined && String(rowValue).trim() !== ''

    // Use numeric comparison if both are numeric, otherwise string comparison
    if (isNumeric && rowIsNumeric) {
      switch (operator) {
        case '>':
          return numRowValue > numValue
        case '<':
          return numRowValue < numValue
        case '>=':
          return numRowValue >= numValue
        case '<=':
          return numRowValue <= numValue
        case '=':
          return numRowValue === numValue
        case '!=':
          return numRowValue !== numValue
        default:
          return true
      }
    } else {
      // String comparison
      const strRowValue = String(rowValue).toLowerCase().trim()
      const strValue = String(cleanValue).toLowerCase().trim()
      
      switch (operator) {
        case '=':
          return strRowValue === strValue
        case '!=':
          return strRowValue !== strValue
        case '>':
          return strRowValue > strValue
        case '<':
          return strRowValue < strValue
        case '>=':
          return strRowValue >= strValue
        case '<=':
          return strRowValue <= strValue
        default:
          return true
      }
    }
  })
}

function applyJoin(query, data, tables) {
  // Simplified JOIN implementation
  const joinMatch = query.match(/JOIN\s+(\w+)\s+ON\s+(.+?)(?:\s+WHERE|\s+ORDER|\s+GROUP|$)/i)
  if (!joinMatch) {
    return data
  }

  const joinTableName = joinMatch[1].toLowerCase()
  const joinCondition = joinMatch[2]
  
  if (!tables[joinTableName]) {
    throw new Error(`Table '${joinTableName}' does not exist`)
  }

  const joinTable = tables[joinTableName].sampleData
  const conditionParts = joinCondition.split('=').map(c => c.trim())
  const leftCol = conditionParts[0].split('.').pop()
  const rightCol = conditionParts[1].split('.').pop()

  const result = []
  for (const leftRow of data) {
    for (const rightRow of joinTable) {
      if (leftRow[leftCol] === rightRow[rightCol]) {
        // Handle column name conflicts - rename department.name to department_name
        const mergedRow = { ...leftRow }
        for (const [key, value] of Object.entries(rightRow)) {
          // If column name conflicts and it's from the joined table, rename it
          if (key === 'name' && joinTableName === 'departments') {
            mergedRow['department_name'] = value
          } else if (!mergedRow.hasOwnProperty(key)) {
            mergedRow[key] = value
          }
        }
        result.push(mergedRow)
      }
    }
  }

  return result
}

function applyGroupBy(query, data) {
  // Simplified GROUP BY with aggregate functions
  const groupByMatch = query.match(/GROUP BY\s+(\w+)/i)
  if (!groupByMatch) {
    return data
  }

  const groupColumn = groupByMatch[1]
  const groups = {}

  for (const row of data) {
    const key = row[groupColumn]
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(row)
  }

  const result = []
  for (const [key, rows] of Object.entries(groups)) {
    const firstRow = rows[0]
    
    // Check for aggregate functions in SELECT
    if (query.includes('AVG(') || query.includes('COUNT(') || query.includes('SUM(')) {
      const avgMatch = query.match(/AVG\((\w+)\)/i)
      const countMatch = query.match(/COUNT\((\w+)\)/i)
      const sumMatch = query.match(/SUM\((\w+)\)/i)

      const newRow = { [groupColumn]: key }

      if (avgMatch) {
        const col = avgMatch[1]
        const sum = rows.reduce((acc, r) => acc + Number(r[col]), 0)
        newRow[`avg_${col}`] = (sum / rows.length).toFixed(2)
      }

      if (countMatch) {
        newRow[`count_${countMatch[1]}`] = rows.length
      }

      if (sumMatch) {
        const col = sumMatch[1]
        newRow[`sum_${col}`] = rows.reduce((acc, r) => acc + Number(r[col]), 0)
      }

      result.push(newRow)
    } else {
      result.push(firstRow)
    }
  }

  return result
}

function applyOrderBy(query, data) {
  const orderMatch = query.match(/ORDER BY\s+(\w+)(?:\s+(ASC|DESC))?/i)
  if (!orderMatch) {
    return data
  }

  const column = orderMatch[1]
  const direction = (orderMatch[2] || 'ASC').toUpperCase()

  return [...data].sort((a, b) => {
    const aVal = Number(a[column]) || a[column]
    const bVal = Number(b[column]) || b[column]

    if (direction === 'DESC') {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
    } else {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    }
  })
}

function selectColumns(data, columns) {
  const columnList = columns.split(',').map(c => c.trim().split('.').pop().split(' ').pop())
  
  return data.map(row => {
    const newRow = {}
    for (const col of columnList) {
      if (row.hasOwnProperty(col)) {
        newRow[col] = row[col]
      }
    }
    return newRow
  })
}

