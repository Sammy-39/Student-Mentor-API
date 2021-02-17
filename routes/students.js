const express = require("express")
const fs = require("fs")
const path = require("path")

const router = express.Router()

const port = process.env.PORT || 5000
const studentsFile = path.join(__dirname,"../static-data/students.json")
const mentorsFile = path.join(__dirname,"../static-data/mentors.json")

let studentsList = JSON.parse(fs.readFileSync(studentsFile,"utf8"))
let mentorsList = JSON.parse(fs.readFileSync(mentorsFile,"utf8"))

router.get("/students",(req,res)=>{
    studentsList = JSON.parse(fs.readFileSync(studentsFile,"utf8"))
    res.json(studentsList)
})

router.get('/student/:id',(req,res)=>{
    studentsList = JSON.parse(fs.readFileSync(studentsFile,"utf8"))
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
    studentsList = JSON.parse(fs.readFileSync(studentsFile,"utf8"))
    studentsList.push({...req.body,...{"id":`stud-${studentsList.length+1}`}})
    fs.writeFileSync(studentsFile,JSON.stringify(studentsList))
    res.send({
        message: "Added 1 entry"
    })
})

router.put("/student/:id",(req,res)=>{
    studentsList = JSON.parse(fs.readFileSync(studentsFile,"utf8"))
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
    fs.writeFileSync(studentsFile,JSON.stringify(studentsList))
})

router.patch("/student/:id",(req,res)=>{
    try{
        studentsList = JSON.parse(fs.readFileSync(studentsFile,"utf8"))
        mentorsList = JSON.parse(fs.readFileSync(mentorsFile,"utf8"))
        let mentor = mentorsList.find(mentor=>mentor.id===req.body.mentorId)
        let mentorIdx = mentorsList.indexOf(mentor)
        if(!mentor){
            throw new Error("Mentor Id not found")
        }
        if(!studentsList[req.params.id-1]){
            throw new Error("Student ID not found")
        }
        else{
            if(!mentorsList[mentorIdx].studsId){
                mentorsList[mentorIdx] = {...mentorsList[mentorIdx],...{"studsId":[]}}
            }
            let studId =  studentsList[req.params.id-1].id
            if(mentorsList[mentorIdx].studsId.indexOf(studId)===-1)
                mentorsList[mentorIdx].studsId.push(studId)
            let preMentorId = studentsList[req.params.id-1].mentorId 
            if(preMentorId!==req.body.mentorId){
                mentorsList.forEach(mentor=>{
                    if(mentor.id === preMentorId){ 
                        mentor.studsId.splice(mentor.studsId.indexOf(studId),1)  
                    }
                })
            }
            fs.writeFileSync(mentorsFile,JSON.stringify(mentorsList))
        
            studentsList[req.params.id-1] = {...studentsList[req.params.id-1],...req.body}
            res.send({
                message: "Mentor assigned to Student and Student added to mentor"
            })
            fs.writeFileSync(studentsFile,JSON.stringify(studentsList))
        }
    }
    catch (err){
        res.send({
            message : err.message
        })
    }
})

router.delete("/student/:id",(req,res)=>{
    studentsList = JSON.parse(fs.readFileSync(studentsFile,"utf8"))
    if(studentsList[req.params.id-1]){
        studentsList.splice(req.params.id-1,1)
        res.send({
            message: "Delete Success"
        })
        fs.writeFileSync(studentsFile,JSON.stringify(studentsList))
    }
    else{
        res.send({
            message: "Error: ID not found"
        })
    }
})

module.exports = router