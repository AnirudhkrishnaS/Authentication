//jshint esversion:6
require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require('mongoose')
const md5 = require('md5')


const app = express()
// console.log(process.env.SECRET);
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB")
const userSchema = new mongoose.Schema({
    email: String,
    password: String
})



const USER = new mongoose.model("User", userSchema)

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/register", (req, res) => {
    res.render("register")
})


app.post("/register", (req, res) => {
    const newUser = new USER({
        email: req.body.username,
        password: md5(req.body.password)
    })

    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets")
        }
    })
})


app.post("/login", (req, res) => {
    const username = req.body.username;
    const password =md5(req.body.password)
    // console.log(username);


    USER.findOne({ email: username }, (err, foundUser) => {
        // console.log(foundUser);
        if (err) {
            console.log(err);
        } else {
            // console.log(foundUser);
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets")
                }
            }
        }
    })
})





app.listen(3000, () => {
    console.log('server started');
})
