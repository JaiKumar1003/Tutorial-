const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const app = express()

const dbPath = path.join(__dirname, 'todoApplication.db')

let db = null

app.use(express.json())

const initialDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initialDBAndServer()

const hasPriorityAndStatusProperties = requestQuery => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  )
}

const hasPriorityProperty = requestQuery => {
  return requestQuery.priority !== undefined
}

const hasStatusPropertry = requestQuery => {
  return requestQuery.status !== undefined
}

app.get('/todos/', async (request, response) => {
  let data = null
  const {search_q, priority, status} = request.query
  console.log(search_q)
  switch (true) {
    case hasPriorityAndStatusProperties(request.query):
      getTodosQuery = `
      SELECT 
        * 
      FROM 
        todo
      WHERE 
        todo LIKE '%${search_q}%' 
        AND priority = '${priority}' 
        AND status = '${status}';`
      break
    case hasPriorityProperty(request.query):
      getTodosQuery = `SELECT 
        * 
      FROM 
        todo
      WHERE 
        todo LIKE '%${search_q}%' 
        AND priority = '${priority}';`
      break
    case hasStatusPropertry(request.query):
      getTodosQuery = `SELECT 
        * 
      FROM 
        todo
      WHERE 
        todo LIKE '%${search_q}%'  
        AND status = '${status}';`
      break
    default:
      getTodosQuery = `SELECT 
        * 
      FROM 
        todo
      WHERE 
        todo LIKE '%${search_q}%';`
  }

  data = await db.all(getTodosQuery)
  response.send(data)
})

module.exports = app
