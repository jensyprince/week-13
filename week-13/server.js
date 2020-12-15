const express = require('express');
const app = express();
const data = require('./public/database.json')
const nodeBodyParser = require('body-parser')
const fs = require('fs')

app.use(nodeBodyParser.json())

// app.get('/', function (req, res) {
//  return res.send('Hello world');
//  });

app.get('/employees', (req,res) => {
    if(!data) {
        res.status(404).send('could not find information')
    }

    res.send(data)
})

app.get('/employees/:id', (req,res) => {
    const findEmployee = data.workers.find(function(employee){
        return parseInt(req.params.id) === employee.id
    })

    if(!findEmployee) {
        res.status(404).send('could not find information')
    }

    res.send(findEmployee)  
})

app.post('/employees',(req,res) => {
    const { name, salary, department, id } = req.body;
    if (name && salary && department && id) {
      const newEmployee = {
        name,
        salary,
        department,
        id
      };
      data.workers.push(newEmployee);
      fs.writeFileSync("./public/database.json", JSON.stringify(data));
      res.send(newEmployee);
    } else {
      res.status(400).send({error:"One of the fields is missing from the body"})
    } 
})

app.put('/employees/:id',(req,res) => {
    const employeeId = parseInt(req.params.id)
    console.log(req.params)
    const { name, salary, department, id } = req.body;
    const newEmployee = {
        name,
        salary,
        department,
        id
      };

    for(let i = 0; i < data.workers.length; i++) {
        if(data.workers[i].id === employeeId) {
          if (name && salary && department && id) {
            data.workers[i] = newEmployee
            // FileSync updates the local file with the new changes
            fs.writeFileSync('./public/database.json', JSON.stringify(data))
            return res.send(data.workers[i])
          } else {
            res.status(400).send({error:"couldnt update the user"})
          }
        } 
    }   
    res.status(400).send({error:"Employee with this ID does not exist"})
})
app.delete('/employees/:id',(req,res) => {
    const employeeId = parseInt(req.params.id)

    for(let i = 0; i < data.workers.length; i++) {
        if(data.workers[i].id === employeeId) {
            const employeeData = data.workers[i]
            data.workers.splice(i,1)
            fs.writeFileSync("./public/database.json", JSON.stringify(data));
            res.send(employeeData)
        } 
    } 
    res.status(400).send({error:"Employee with this ID does not exist"})
})  
app.listen(process.env.PORT || 3000);