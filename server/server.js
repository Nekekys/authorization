const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken")
const secretKey = "SECRET_KEY"

const app = express();

let users = [
    {login: "admin",password: "admin",id: "123456789"}
]
let sessionId = [
    {session: "2135435345",id: "123456789"}
]

app.use(cors({
    origin: true,//'http://localhost:3000', //'http://localhost:3002' //https://apepe.surge.sh
    "Access-Control-Allow-Origin": '*',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true
}));
app.use(cookieParser())
app.use(bodyParser.json());
//********************Token************************************************
app.post('/registrationToken',function (req,res)  {
    let newUser = {
        login: req.body.login,password: req.body.password,id: String(Date.now())
    }
    for (let i = 0; i < users.length;i++){
        if (users[i].login == req.body.login){
           return  res.send({error: "такой пользователь уже зарегестрирован", check: false})
        }
    }
    let token = jwt.sign({id: newUser.id},secretKey,{expiresIn: "1h"})
    users.push(newUser)
    res.send({data: newUser, check: true,token})
})
app.post('/loginInToken',function (req,res)  {
    let check = true

    for (let i = 0; i < users.length;i++){
        if(users[i].login == req.body.login){
            if (users[i].password == req.body.password){
                check = false
                let token = jwt.sign({id: users[i].id},secretKey,{expiresIn: "1h"})

                res.send({data: users[i], check: true,token})
            }else{
                res.send({error: "не правильный пароль", check: false})
            }
        }
    }
    if(check) res.send({error: "не правильный логин", check: false})
})
app.post('/checkToken', function (req,res) {

    if(req.body.token){
       let token = jwt.verify(req.body.token,secretKey)
        if(token){
            for (let i = 0; i < users.length;i++) {
                if (users[i].id == token.id) {
                    return res.send({data: users[i], check: true})
                }
            }
        }
    }
    res.send({check: false})
})
//********************************************************************************


//********************Session************************************************
app.post('/registrationSession',function (req,res)  {

    let id = String(Date.now())
    let check = false
    let newUser = {
        login: req.body.login,password: req.body.password,id: id
    }
    let newSession = {
        session: id + String(Math.floor(Math.random()*1000)),id: id
    }
    for (let i = 0; i < users.length;i++){
        if (users[i].login == req.body.login){
            check = true
           // res.send({error: "такой пользователь уже зарегестрирован", check: false})
        }
    }

    if(check){
        res.send({error: "такой пользователь уже зарегестрирован", check: false})
    }else{
        users.push(newUser)
        sessionId.push(newSession)
        res.cookie('sessionId', newSession.session, {secure: true,expires: new Date(Number(new Date()) + 315360000000)})
        res.send({data: newUser, check: true})
    }

})
app.post('/loginInSession',function (req,res)  {
    let check = true
    let newSession
    for (let i = 0; i < users.length;i++){
        if(users[i].login == req.body.login){
            if (users[i].password == req.body.password){
                check = false
                newSession = {
                    session: users[i].id + String(Math.floor(Math.random()*1000)),id: users[i].id
                }
                sessionId.push(newSession)
                res.cookie('sessionId', newSession.session, {secure: true,expires: new Date(Number(new Date()) + 315360000000)})
                res.send({data: users[i], check: true})
            }else{
                res.send({error: "не правильный пароль", check: false})
            }
        }
    }
   if(check) res.send({error: "не правильный логин", check: false})
})

app.get('/checkSession', function (req,res) {
    let check = true

    for(let i = 0; i < sessionId.length;i++){
        if(sessionId[i].session == req.cookies.sessionId){
            for(let j = 0; j < users.length;j++){
                if(users[j].id == sessionId[i].id){
                    check = false
                    res.send({check: true,user: users[j]})
                }
            }
        }
    }
    if(check) res.send({check: false})
})

app.post('/outAccount',function (req,res)  {
    for(let i = 0; i < sessionId.length;i++){
        if(sessionId[i].id == req.body.id){
            sessionId.splice(i,1)
            res.clearCookie('sessionId')
        }
    }
    res.send("clear cookie")
})
//********************************************************************************

app.listen(3005, ()=>{
    console.log("server start")
});