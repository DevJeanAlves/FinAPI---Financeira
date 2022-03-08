const express = require('express')
const { v4: uuidv4 } = require('uuid')

const app = express()
app.use(express.json())

const customers = []
/*
cpf - string
name - string
id - uuid
statement - array
*/

//middleware
function verifyIfExistsAccountCpf(request, response, next) {
  const { cpf } = request.headers //request.params

  const customer = customers.find(customer => customer.cpf === cpf)

  if (!customer) {
    return response.status(401).json({ error: 'Customer not found.' })
  }

  request.customer = customer

  return next()
}

app.post('/account', (request, response) => {
  const { cpf, name } = request.body

  const customersAlreadyExists = customers.some(
    customers => customers.cpf === cpf
  )

  if (customersAlreadyExists) {
    return response
      .status(400)
      .json({ error: 'Cpf already registed (custumer already exists)' })
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: []
  })
  return response.status(201).send()
})
// ====='/statement/:cpf'
app.get('/statement', verifyIfExistsAccountCpf, (request, response) => {
  const { customer } = request
  return response.status(200).json(customer.statement)
})

app.post('/deposit', verifyIfExistsAccountCpf, (request, response) => {
  const { description, amount } = request.body

  const { customer } = request

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: 'credito'
  }

  customer.statement.push(statementOperation)

  return response.status(201).send()
})

app.listen(3333)

console.log('rodou liso')
