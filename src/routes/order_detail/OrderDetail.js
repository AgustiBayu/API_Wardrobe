const express = require('express')
const {pgDB} = require('../../../db.js')
const router = express.Router()

router.post('/orderDetail', async(req, res)=> {
    try {
        const {orderId, productId, quantity, unitPrice} = req.body
        const data = await pgDB.query(`INSERT INTO order_details VALUES(DEFAULT, $1, $2, $3, $4)`, [orderId, productId, quantity, unitPrice])
        statusCode = 200, message = 'success'
        if(data.rowCount == 0) {
            statusCode = 400,
            message = 'failed'
        } 
        res.status(statusCode).json({
            statusCode,
            message
        })
    } catch(e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error :' + e
        })
    }
})
module.exports = router