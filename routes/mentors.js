const { EROFS } = require("constants")
const express = require("express")
const fs = require("fs")
const path = require("path")

const router = express.Router()

const mentorsFile = path.join(__dirname,"../static-data/mentors.json")
const studentsFile = path.join(__dirname,"../static-data/students.json")

let studentsList = JSON.parse(fs.readFileSync(studentsFile,"utf8"))
let mentorsList = JSON.parse(fs.readFileSync(mentorsFile,"utf8"))

router.get("/mentors",(req,res)=>{
    try{
        mentorsList = JSON.parse(fs.readFileSync(mentorsFile,"utf8"))
        res.json(mentorsList)
    }
    catch(err){
        res.send({
            message: err.message
        })
    }
})

router.get('/mentor/:id',(req,res)=>{
    try{
        mentorsList = JSON.parse(fs.readFileSync(mentorsFile,"utf8"))
        if(mentorsList[req.params.id-1]){
            res.json(mentorsList[req.params.id-1])
        }
        else{
            throw new Error("Id not found")
        }
    }
    catch(err){
        res.send({
            message: err.message
        })
    }
})

router.post("/mentor",(req,res)=>{
    try{
        mentorsList = JSON.parse(fs.readFileSync(mentorsFile,"utf8"))
        mentorsList.push({...req.body,...{"id":`ment-${mentorsList.length+1}`}})
        fs.writeFileSync(mentorsFile,JSON.stringify(mentorsList))
        res.send({
            message: "Added 1 entry"
        })
    }
    catch(err){
        res.send({
            message: err.message
        })
    }
})

router.put("/mentor/:id",(req,res)=>{
    try{
        mentorsList = JSON.parse(fs.readFileSync(mentorsFile,"utf8"))
        if(mentorsList[req.params.id-1]){
            mentorsList[req.params.id-1] = {...req.body,...{"id":`ment-${req.params.id}`}}
            res.send({
                message: "Update Success"
            })
        }
        else{
            mentorsList.push({...req.body,...{"id":`ment-${mentorsList.length+1}`}})
            res.send({
                message: "Added 1 entry"
            })
        }
        fs.writeFileSync(mentorsFile,JSON.stringify(mentorsList))
    }
    catch(err){
        res.send({
            message: err.message
        })
    }
})

router.patch("/mentor/:id",(req,res)=>{
    try{
        mentorsList = JSON.parse(fs.readFileSync(mentorsFile,"utf8"))
        studentsList = JSON.parse(fs.readFileSync(studentsFile,"utf8"))
        
        if(mentorsList[req.params.id-1]){
            if(!mentorsList[req.params.id-1].studsId){
                mentorsList[req.params.id-1] = {...mentorsList[req.params.id-1],...{"studsId":[]}}
            }
            req.body.studsId.forEach((studId,idx)=>{
                if(mentorsList[req.params.id-1].studsId.indexOf(studId)===-1)
                    mentorsList[req.params.id-1].studsId.push(studId)
                studentsList.forEach((stud)=>{
                    if(stud.id===studId){ stud.mentorId = "ment-"+req.params.id }
                })
            }) 
            res.send({
                message: "Patch Success"
            })
            fs.writeFileSync(mentorsFile,JSON.stringify(mentorsList))
            fs.writeFileSync(studentsFile,JSON.stringify(studentsList))
        }
        else{
            throw new Error("Id not found")
        }
    }
    catch(err){
        res.send({
            message: err.message
        })
    }
})

router.delete("/mentor/:id",(req,res)=>{
    try{
        mentorsList = JSON.parse(fs.readFileSync(mentorsFile,"utf8"))
        if(mentorsList[req.params.id-1]){
            mentorsList.splice(req.params.id-1,1)
            res.send({
                message: "Delete Success"
            })
            fs.writeFileSync(mentorsFile,JSON.stringify(mentorsList))
        }
        else{
            throw new Error("Id not found")
        }
    }
    catch(err){
        res.send({
            message: err.message
        })
    }
})

module.exports = router