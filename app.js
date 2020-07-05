
 
const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const {
    performance ,
    PerformaceObserver
} = require('perf_hooks');
 
 
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'node_crud'
});
 
connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 


//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




app.get('/',(req, res) => {

    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM users";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('user_index', {
            title : 'table manager',
            users : rows
        });
    });
});



app.get('/add',(req, res) => {
    res.render('user_add', {
        title : 'add user'
    });
});
 


    app.post('/save',(req, res) => { 
        let data = {name: req.body.name, email: req.body.email, phone_no: req.body.phone_no};
        let sql = "INSERT INTO users SET ?";
        let query = connection.query(sql, data,(err, results) => {
          if(err) throw err;
          res.redirect('/');
        });
    });



app.get('/edit/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from users where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('user_edit', {
            title : 'edit',
            user : result[0]
        });
    });
});


app.post('/update',(req, res) => {
    const userId = req.body.id;
    let sql = "update users SET name='"+req.body.name+"',  email='"+req.body.email+"',  phone_no='"+req.body.phone_no+"' where id ="+userId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});


var t0 = performance.now();

app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from users `;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});
var t1 = performance.now();

console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
 
// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});