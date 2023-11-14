const express = require('express')
const {mysqlDB, getConnection} = require('../../../db.js')
const router = express.Router()

router.post('/orderDetail', async(req, res)=> {
    const conn = await getConnection()
    try {
        const {orderId, productId, quantity, unitPrice} = req.body
        const data = await conn.execute(`INSERT INTO order_details VALUES(DEFAULT, ?,?,?,?)`, [orderId, productId, quantity, unitPrice])
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

router.get('/orderDetail', async (req, res) =>{
    const conn = await getConnection()
    try {
        const data = await conn.execute(`SELECT
        a.detail_id,
        a.product_id,
        b.product_name,
        a.quantity,
        a.unit_price,
        a.status,
        b.created_at as tanggal FROM order_details a
    INNER JOIN products b
    ON a.product_id = b.product_id`)
    res.status(200).json(data[0]);
    // res.status(200).json({
    //     data: data[0],
    //     statusCode: 200,
    //     message: 'success'
    // })
    } catch(e) {
        res.status(500).json({
            statusCode: 500,
            message: 'Have an error :' + e
        })
    }
})
module.exports = router