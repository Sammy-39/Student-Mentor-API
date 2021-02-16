const express = require("express")
const fs = require("fs")
const path = require("path")

const router = express.Router()

const port = process.env.PORT || 5000
const file = path.join(__dirname,"../static-data/students.json")

let studentsList = JSON.parse(fs.readFileSync(file,"utf8"))

router.get("/students",(req,res)=>{
    res.json(studentsList)
})

router.get('/student/:id',(req,res)=>{
    if(studentsList[req.params.id-1]){
        res.json(studentsList[req.params.id-1])
    }
    else{
        res.send({
            message: "Error: ID not found"
        })
    }
})

router.post("/student",(req,res)=>{
    studentsList.push({...req.body,...{"id":`stud-${studentsList.length+1}`}})
    fs.writeFileSync(file,JSON.stringify(studentsList))
    res.send({
        message: "Added 1 entry"
    })
})

router.put("/student/:id",(req,res)=>{
    if(studentsList[req.params.id-1]){
        studentsList[req.params.id-1] = {...req.body,...{"id":`stud-${req.params.id}`}}
        res.send({
            message: "Update Success"
        })
    }
    else{
        studentsList.push({...req.body,...{"id":`stud-${studentsList.length+1}`}})
        res.send({
            message: "Added 1 entry"
        })
    }
    fs.writeFileSync(file,JSON.stringify(studentsList))
})

router.patch("/student/:id",(req,res)=>{
    if(studentsList[req.params.id-1]){
        studentsList[req.params.id-1] = {...studentsList[req.params.id-1],...req.body}
        res.send({
            message: "Patch Success"
        })
        fs.writeFileSync(file,JSON.stringify(studentsList))
    }
    else{
        res.send({
            message: "Error: ID not found"
        })
    }
})

router.delete("/student/:id",(req,res)=>{
    if(studentsList[req.params.id-1]){
        studentsList.splice(req.params.id-1,1)
        res.send({
            message: "Delete Success"
        })
        fs.writeFileSync(file,JSON.stringify(studentsList))
    }
    else{
        res.send({
            message: "Error: ID not found"
        })
    }
})

module.exports = router