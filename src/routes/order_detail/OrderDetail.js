const express = require('express')
const {mysqlDB, getConnection} = require('../../../db.js')
const router = express.Router()

router.post('/orderDetail', async(req, res)=> {
    const conn = await getConnection()
    try {
        const {orderId, productId, quantity, unitPrice, status} = req.body
        const data = await conn.execute(`INSERT INTO order_details VALUES(DEFAULT, ?,?,?,?,?)`, [orderId, productId, quantity, unitPrice,status])
        statusCode = 200, message = 'success'
        if(data[0].affectedRows == 0) {
            statusCode = 400,
            message = 'failed'
        } 
        res.status(statusCode).json({
            statusCode,
            message
        })
    } catch(e) {
        res.status(500).json({
            statusCode: 500,
            message: 'Have an error :' + e
        })
    }
})

module.exports = router