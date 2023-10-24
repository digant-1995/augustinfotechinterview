const express = require('express')
const Sequelize = require("sequelize");
const bodyParser = require('body-parser')
const mysql = require('mysql2');
//Initializing Sequelize
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'august_infotech'
  });
  // connect to the MySQL database
  connection.connect((error) => {
    if (error) {
      console.error('Error connecting to MySQL database:', error);
    } else {
      console.log('Connected to MySQL database!');
    }
  });
const app = express()
// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const port = 3000

app.post('/get-data',jsonParser, (req, res) => {
   const page=req.body?.page;
   const pageSize=req.body?.pageSize;

   
   const sort=req.body?.sort;
   let query= 'select * from customer_master';
   let sortBy='';

   if(sort!=undefined && sort!=null){
    sortBy=`order by ${Object.keys(req.body.sort)} ${req.body.sort.name}`
    query=`${query} ${sortBy}`
   }
   
   if(page != undefined && pageSize!=undefined){
   const offSet = (page-1)*pageSize;
   query=`${query} limit ${pageSize} offset ${offSet}`
   }

   connection.connect(function(err) {
        if (err) throw err;
        connection.query(query, function (err, result, fields) {
          if (err) throw err;
          res.send(result)
        });
      });
  
    
})

app.get('/get-single-customer-data/:id',jsonParser, (req, res) => {
  const id=req.params.id;
  
  let query= `select * from customer_master where id=${id}`;
  
  
  connection.connect(function(err) {
       if (err) throw err;
       connection.query(query, function (err, result, fields) {
         if (err) throw err;
         res.send(result)
       });
     });
 
   
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})