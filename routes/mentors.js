const express = require("express")
const fs = require("fs")
const path = require("path")

const router = express.Router()

const port = process.env.PORT || 5000
const file = path.join(__dirname,"../static-data/mentors.json")

let mentorsList = JSON.parse(fs.readFileSync(file,"utf8"))

router.get("/mentors",(req,res)=>{
    res.json(mentorsList)
})

router.get('/mentor/:id',(req,res)=>{
    if(mentorsList[req.params.id-1]){
        res.json(mentorsList[req.params.id-1])
    }
    else{
        res.send({
            message: "Error: ID not found"
        })
    }
})

router.post("/mentor",(req,res)=>{
    mentorsList.push({...req.body,...{"id":`ment-${mentorsList.length+1}`}})
    fs.writeFileSync(file,JSON.stringify(mentorsList))
    res.send({
        message: "Added 1 entry"
    })
})

router.put("/mentor/:id",(req,res)=>{
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
    fs.writeFileSync(file,JSON.stringify(mentorsList))
})

router.patch("/mentor/:id",(req,res)=>{
    if(mentorsList[req.params.id-1]){
        if(!mentorsList[req.params.id-1].studsId){
            mentorsList[req.params.id-1] = {...mentorsList[req.params.id-1],...{"studsId":[]}}
        }
        req.body.studsId.forEach((studId,idx)=>{
            if(mentorsList[req.params.id-1].studsId.indexOf(studId)===-1)
                mentorsList[req.params.id-1].studsId.push(studId)
        }) 
        res.send({
            message: "Patch Success"
        })
        fs.writeFileSync(file,JSON.stringify(mentorsList))
    }
    else{
        res.send({
            message: "Error: ID not found"
        })
    }
})

router.delete("/mentor/:id",(req,res)=>{
    if(mentorsList[req.params.id-1]){
        mentorsList.splice(req.params.id-1,1)
        res.send({
            message: "Delete Success"
        })
        fs.writeFileSync(file,JSON.stringify(mentorsList))
    }
    else{
        res.send({
            message: "Error: ID not found"
        })
    }
})

module.exports = router