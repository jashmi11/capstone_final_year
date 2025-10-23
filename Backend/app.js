const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const bcrypt = require('bcrypt')
const cors = require('cors');






const databasePath = path.join(__dirname,'userData.db')
const app = express()
app.use(express.json())
app.use(cors());
let db = null 

const initializeDBAndServer = async()=>{
    try{
        db = await open({
            filename:databasePath,
            driver:sqlite3.Database,
        })
        app.listen(3000,()=>
            console.log('Server Running at http://localhost:3000/')
        )
    }catch(error){
        console.log(`DB Error: ${error.message}`)
        process.exit(1)
    }

}
initializeDBAndServer()

app.post('/register',async(request,response) => {
    const {username,password,gender,schoollevel} = request.body 
    const hashedPassword = await bcrypt.hash(password,10)
    const userQuery = `SELECT * FROM user WHERE username='${username}'`
    const userResponse = await db.get(userQuery)
    if(userResponse === undefined){
        const addUserQuery = `INSERT INTO user(username,password,gender,schoollevel) VALUES('${username}','${hashedPassword}','${gender}','${schoollevel}')`
        if (password.length < 5) {
            response.status(400)
            response.send('Password is too short')
            } 
        else {
            await db.run(addUserQuery)
            response.status(200)
            response.send('User created successfully')
            }

    }else{
        response.status(400)
        response.send('User already exists')
    }
})

app.post('/login', async (request, response) => {
  const {username, password} = request.body
  const checkUserQuery = `SELECT * FROM user WHERE username = '${username}'`
  const userResponse = await db.get(checkUserQuery)
  if (userResponse === undefined) {
    response.status(400)
    response.send('Invalid user')
  } else {
    const result = await bcrypt.compare(password, userResponse.password)
    if (result) {
      response.status(200)
      response.send('Login success!')
    } else {
      response.status(400)
      response.send('Invalid password')
    }
  }
})

app.put('/change-password/', async (request, response) => {
  const {username, oldPassword, newPassword} = request.body
  const hashPassword = await bcrypt.hash(newPassword, 10)
  const checkUserQuery = `SELECT * FROM user WHERE username = '${username}'`
  const dbUser = await db.get(checkUserQuery)
  if (dbUser === undefined) {
    response.status(400)
    response.send('Invalid user')
  } else {
    const passwordResponse = await bcrypt.compare(oldPassword, dbUser.password)
    if (passwordResponse) {
      if (newPassword.length < 5) {
        response.status(400)
        response.send('Password is too short')
      } else {
        const updateUserQuery = `UPDATE user SET password = '${hashPassword}' WHERE username = '${username}'`
        await db.run(updateUserQuery)
        response.send('Password updated')
      }
    } else {
      response.status(400)
      response.send('Invalid current password')
    }
  }
})
module.exports = app