const express = require("express");
const { pgDB } = require("../../../db.js");
const router = express.Router();

router.get("/customer", async (req, res) => {
  try {
    const data = await pgDB.query(`
        SELECT
        customer_id,
        customer_name,
        email,
        phone_number from customers`);
    res.status(200).json({
      data: data.rows,
      statusCode: 200,
      message: "success",
    });
  } catch (e) {
    res.status(400).
      json({
        statusCode: 400,
        message: "Have an error :" + e,
      });
  }
});

router.post('/customer', async (req,res)=>{
    try{
        const {customerName, email, phoneNumber} = req.body
        const data = await pgDB.query(`INSERT INTO customers VALUES(DEFAULT,$1,$2,$3)`,[customerName, email, phoneNumber])
        statusCode = 200, message = 'success'
        if(data.rowCount==0){
            statusCode = 400,
            message='failed'
        }
        res.status(statusCode).json({
            statusCode,
            message
        })
    } catch(e){
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error :' + e
        })
    }
})

router.put('/customer/:id', async(req,res)=>{
    try{
        const {customerName, email, phoneNumber} = req.body
        const {id} = req.params

        const data = await pgDB.query('UPDATE customers SET customer_name=$1, email=$2, phone_number=$3 WHERE customer_id=$4',
        [customerName, email, phoneNumber, id])
        statusCode = 200, message = 'success'
        if (data.rowCount == 0) {
            statusCode = 400,
                message = 'failed'
        }
        res.status(statusCode).json({
            statusCode,
            message
        })
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error ' + e
        })
    }
})

router.delete('/customer/:id', async (req, res)=>{
    try{
        const { id } = req.params
        const data = await pgDB.query(`DELETE FROM customers WHERE customer_id = $1`, [id])
        statusCode =  200, message = 'susccess';
        if (data.rowCount == 0){
            statusCode = 400,
            message = 'failed'
        } else{
            res.status(statusCode).json({
                statusCode,
                message
            })
        }
    } catch (e){
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error ' + e
        })
    }
})

module.exports = router
