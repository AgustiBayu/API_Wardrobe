const express = require('express')
const {mysqlDB, getConnection} = require('../../../db.js')
const router = express.Router()

router.post('/productStock', async(req, res)=>{
    const conn = await getConnection()
    try {
        const {productId, size, color, stockQuantity} = req.body
        const data = await conn.execute(`INSERT INTO product_stocks VALUES(DEFAULT, ?,?,?,?)`, [productId, size, color, stockQuantity])
        statusCode = 200, message = 'success'
        if(data[0].affectedRows == 0) {
            statusCode = 400,
            message = 'failed'
        } else {
            res.status(statusCode).json({
                statusCode: '200',
                message
            })
        }
    } catch(e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error :' + e
        })
    }
})
router.get('/productStock', async(req, res)=>{
    const conn = await getConnection()
    try {
        const data = await conn.execute(`SELECT * FROM product_stocks`)
        statusCode = 200, message = 'success'
            res.status(statusCode).json({
                data: data[0],
                statusCode: '200',
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