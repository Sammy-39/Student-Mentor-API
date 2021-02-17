const { EROFS } = require("constants")
const express = require("express")
const fs = require("fs")
const path = require("path")

const router = express.Router()

const file = path.join(__dirname,"../static-data/mentors.json")

let mentorsList = JSON.parse(fs.readFileSync(file,"utf8"))

router.get("/mentors",(req,res)=>{
    try{
        mentorsList = JSON.parse(fs.readFileSync(file,"utf8"))
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
        mentorsList = JSON.parse(fs.readFileSync(file,"utf8"))
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
        mentorsList = JSON.parse(fs.readFileSync(file,"utf8"))
        mentorsList.push({...req.body,...{"id":`ment-${mentorsList.length+1}`}})
        fs.writeFileSync(file,JSON.stringify(mentorsList))
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
        mentorsList = JSON.parse(fs.readFileSync(file,"utf8"))
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
    }
    catch(err){
        res.send({
            message: err.message
        })
    }
})

router.patch("/mentor/:id",(req,res)=>{
    try{
        mentorsList = JSON.parse(fs.readFileSync(file,"utf8"))
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
        mentorsList = JSON.parse(fs.readFileSync(file,"utf8"))
        if(mentorsList[req.params.id-1]){
            mentorsList.splice(req.params.id-1,1)
            res.send({
                message: "Delete Success"
            })
            fs.writeFileSync(file,JSON.stringify(mentorsList))
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