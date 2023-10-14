const express = require('express')
const { pgDB } = require('../../../db.js')
const router = express.Router()

router.get('/materialProduct', async (req, res) => {
    try {
        const data = await pgDB.query(`select 
        a.material_products_id,
        b.product_name,
        c.material_name,
        c.price,
        c.quantity_in_stock,
        a.satuan 
        from material_products a
    inner join products b
    on a.product_id = b.product_id
    inner join materials c
    on a.material_id = c.material_id`)
        res.status(200).json({
            data: data.rows,
            statusCode: 200,
            message: 'success'
        })
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error: ' + e
        })
    }
})

router.post('/materialProduct', async (req, res) => {
    try {
        const { materialId, productId, satuan } = req.body
        const data = await pgDB.query(`INSERT INTO material_products VALUES(DEFAULT, $1,$2,$3)`, [materialId, productId, satuan])
        statusCode = 200, message = 'success'
        if(data.rowCount == 0) {
            res.status(400).json({
                statusCode: 400,
                message: 'failed'
            })
        } else {
            res.status(statusCode).json({
                statusCode,
                message
            })
        }
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error :' + e
        })
    }
})

module.exports = router