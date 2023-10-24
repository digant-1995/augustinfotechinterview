const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios');
const redis = require('redis');
const app = express()
// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const port = 4000

const client = redis.createClient(6379);

client.connect()



 app.get('/get-cached-data/:id', (req, res) => {
  try {
   console.log('API Called')
    const id = req.params.id;
  
    // Check the redis store for the data first
    client.get(id, async (err, custData) => {
      if (custData) {
           return res.status(200).send({
          error: false,
          message: `Customer data ${id} from the cache`,
          data: JSON.parse(custData)
        })
      } else { // When the data is not found in the cache then we can make request to the server
        console.log('Else Condition')
  
          const custData = await axios.get(`http://localhost:3000/get-single-customer-data/1`);
  
          // save the record in the cache for subsequent request
          client.setex(id, 1440, JSON.stringify(custData.data.results));
  
          // return the result to the client
          return res.status(200).send({
            error: false,
            message: `Customer data ${id} from the server`,
            data: custData.data.results
          });
      }
    }) 
  } catch (error) {
      console.log(error)
  }
 });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})