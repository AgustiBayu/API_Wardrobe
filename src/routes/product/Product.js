const express = require('express')
const { pgDB } = require('../../../db.js')
const router = express.Router();

router.get('/product', async (req, res) => {
    try {
        const data = await pgDB.query(`SELECT * FROM products`)
        res.status(200).json({
            data: data.rows,
            statusCode: 200,
            message: 'success'
        })
    } catch (e) {
        res.status(400), json({
            statusCode: 400,
            message: 'Have an error :' + e
        })
    }
})

router.post('/product', async (req, res) => {
    try {
        const { productName, categoryId, price, dekscription, createdAt } = req.body
        const data = await pgDB.query(`INSERT INTO products VALUES(DEFAULT,$1,$2,$3,$4,$5)`, [productName,
            categoryId, price, dekscription, createdAt])
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
            message: 'Have an error :' + e
        })
    }
})

router.put('/product/:id', async (req, res) => {
    try {
        const { productName, categoryId, price, dekscription, createdAt } = req.body
        const { id } = req.params
        const data = await pgDB.query(`UPDATE products SET product_name =$1, category_id=$2, price=$3, description=$4, created_at=$5 WHERE product_id = $6`,
            [productName, categoryId, price, dekscription, createdAt, id])
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

router.delete('/product/:id', async (req, res) => {
    try {
        const { id } = req.params
        const data = await pgDB.query(`DELETE FROM products WHERE product_id = $1`, [id])
        var statusCode = 200, message = 'success';
        if (data.rowCount == 0) {
            statusCode = 400,
                message = 'failed'
        } else {
            res.status(statusCode).json({
                statusCode,
                message
            })
        }
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error ' + e
        })
    }
})

module.exports = router