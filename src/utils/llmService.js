// LLM Service for getting hints
// This is a placeholder that can be replaced with actual LLM API integration

export async function getHint(question, currentQuery) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // This is a simple mock implementation
  // In a real application, you would call an actual LLM API here
  // Example: OpenAI API, Anthropic API, or your own backend endpoint

  const hints = generateContextualHints(question, currentQuery)
  return hints

  // Example of how to integrate with an actual API:
  /*
  try {
    const response = await fetch('YOUR_LLM_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({
        question: question,
        currentQuery: currentQuery,
        prompt: `Provide a helpful hint (not the solution) for this SQL question: ${question}. The user has written: ${currentQuery || 'nothing yet'}. Give guidance without revealing the answer.`
      })
    })
    
    const data = await response.json()
    return data.hint || data.message
  } catch (error) {
    throw new Error('Failed to get hint from LLM service')
  }
  */
}

function generateContextualHints(question, currentQuery) {
  // Simple rule-based hint generator as a fallback
  // This provides contextual hints based on the question and current query

  const queryLower = (currentQuery || '').toLowerCase()
  const questionLower = question.toLowerCase()

  if (!currentQuery || currentQuery.trim().length < 5) {
    return "Start by writing a SELECT statement. Think about which columns you need and which table contains the data."
  }

  if (questionLower.includes('where') && !queryLower.includes('where')) {
    return "You need to filter the results. Consider using a WHERE clause to specify your conditions."
  }

  if (questionLower.includes('join') && !queryLower.includes('join')) {
    return "This question requires combining data from multiple tables. Try using a JOIN operation to connect the tables."
  }

  if (questionLower.includes('average') || questionLower.includes('avg')) {
    if (!queryLower.includes('avg') && !queryLower.includes('average')) {
      return "You'll need to use an aggregate function. Consider using AVG() to calculate the average value."
    }
    if (!queryLower.includes('group by')) {
      return "When using aggregate functions, you typically need GROUP BY to group the results by a specific column."
    }
  }

  if (questionLower.includes('count') && !queryLower.includes('count')) {
    return "Consider using the COUNT() function to count rows. You might also need GROUP BY if counting by groups."
  }

  if (questionLower.includes('greater than') || questionLower.includes('>')) {
    if (!queryLower.includes('>') && !queryLower.includes('greater')) {
      return "Use the > operator in your WHERE clause to filter values greater than a certain number."
    }
  }

  if (queryLower.includes('select') && queryLower.includes('from')) {
    return "Good start! Make sure your query matches all the requirements in the question. Check if you need any filters, joins, or aggregations."
  }

  return "Review the question requirements carefully. Make sure your query addresses all parts of the question. Check the sample data to understand the table structure."
}

