const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const fs = require('fs');
const conn = express();
const port = ;
const cors = require('cors')
const uri = require('./config/key').mongoURI
const appName = "vanshavali dev";

const jwt = require('jsonwebtoken');
const secret = 'supersecret';

//models
const Users = require('./data/model/users')

conn.use(bodyParser.json());
conn.use(bodyParser.urlencoded({ extended: false }));
conn.use(bodyParser.json());
conn.use(express.static('public'));


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connection.once('open', function () {
    console.log(`${appName} is running fine!`);
}).on('error', function (error) {
    console.log('error is:', error);
})



conn.get('/vanshavali', (req, res) => {  
  res.send('Mars vanshavali Backend is Running');
});

conn.set('view engine', 'pug');


conn.get('/', (req, res) => {
  res.render('index');
});

conn.get('/login', (req, res) => {
  res.render('auth/login');
});

conn.get('/register', (req, res) => {
  res.render('auth/register');
});

conn.post('/user-register', (req, res) => {
  let promise = new Promise(async function (resolve, reject) {
    try {
            let getUserName = req.body.username;
            let getEmail = req.body.email;
            let getPassword = req.body.password;
            let getConfirmPassword = req.body.confirm_password;

               if (!getUserName || !getEmail || !getConfirmPassword || !getPassword) {
                  return res.render('auth/register', { error: 'Please fill in all fields' });
               }else if(getConfirmPassword != getPassword){
                  return res.render('auth/register', { error: 'Password is miss match'});
               }else{
                let existingUser = await Users.findOne({
                  $and: [
                    { email_id: getEmail }
                  ]
                });
                if(existingUser){
                  return res.render('auth/register', { error: 'user already'});
                }else{
                    let customer = await Users.create({
                      name:getUserName,
                      email:getEmail,
                      password:getPassword,
                      isActive:1
                  })
                  let user_token = await jwt.sign({ user_data: customer }, secret, { expiresIn: '10d' });
                  res.cookie('token', user_token);
                  res.redirect('/home');

                  // return res.render('auth/login', { success_register : 'User created successfully !'});
                }

               }
    } catch (error) {
          return res.render('auth/register', { error: error});
    }
});});


conn.get('/home', (req, res) => {
  res.render('profile/dashboard');
});




conn.get('/familyTree', (req, res) => {
  fs.readFile('./db.json', 'utf8', (err, json) => {
    if (err) {
      console.log(err);
    } else {
        res.render('familyTree', { json });
    }
  });
});

conn.post('/', (req, res) => {
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let nodes = JSON.parse(data);
      req.body.addNodesData.forEach(node => {
        nodes.push(node);
      });
      req.body.updateNodesData.forEach(node => {
        const index = nodes.findIndex((n) => n.id === node.id);
        nodes[index] = node;
      });
      nodes = nodes.filter((node) => node.id !== req.body.removeNodeId);
      fs.writeFile('./db.json', JSON.stringify(nodes), {flag:'w'}, (err) => {
        if (err) {
          console.log(err);
        } else {
          res.send(nodes);
        }
      });
    }
  });
});

conn.listen(port, () => console.log(`App listening on port ${port}!`));
