const express = require('express')
const {pgDB} = require('../../../db.js')
const router = express.Router()

router.post('/productStock', async(req, res)=>{
    try {
        const {productId, size, color, stockQuantity} = req.body
        const data = await pgDB.query(`INSERT INTO product_stocks VALUES(DEFAULT, $1, $2, $3, $4)`, [productId, size, color, stockQuantity])
        statusCode = 200, message = 'success'
        if(data.rowCount == 0) {
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
    try {
        const data = await pgDB.query(``)
        statusCode = 200, message = 'success'
            res.status(statusCode).json({
                data: data.rows,
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