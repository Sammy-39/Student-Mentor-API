const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const studentsRouter = require("./routes/students")
const mentorsRouter = require("./routes/mentors")

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use("/",express.static("public"))

const port = process.env.PORT || 5000

app.use("/api", studentsRouter)
app.use("/api", mentorsRouter)

app.listen(port,()=>{
    console.log("Server running on http://localhost:"+port)
})