const express = require('express')
const { pgDB } = require('../../../db.js')

const router = express.Router();

router.post('/order', async (req, res) => {
    try {
        const { orderDate, totalAmount, customerId } = req.body
        statusCode = 200, message = 'success'
        const data = await pgDB.query(`INSERT INTO orders VALUES(DEFAULT, $1, $2, $3)`, [orderDate, totalAmount, customerId])
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

router.get('/order', async (req, res) => {
    try {
        const data = await pgDB.query(`SELECT 
        a.order_id,
        b.customer_name,
        a.total_amount,
        b.phone_number,
        a.order_date
        from orders a
    INNER JOIN customers b 
    on a.customer_id = b.customer_id`)
        res.status(200).json({
            data: data.rows,
            statusCode: 200,
            message: 'success'
        })
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error :' + e
        })
    }
})

router.put('/order/:id', async (req, res)=> {
    try {
        const {id} = req.params
        const {orderDate, totalAmount, customerId} = req.body
        const data = await pgDB.query(`UPDATE orders SET order_date = $1, total_amount = $2, customer_id = $3
        WHERE order_id = $4`, [orderDate, totalAmount, customerId, id])

        statusCode = 200, message = 'success'
        if (data.rowCount == 0) {
            statusCode = 400,
                message = 'failed'
        } else {
            res.status(statusCode).json({
                statusCode,
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
router.delete('/order/:id', async (req, res) => {
    try {
        const {id} = req.params
        const data = await pgDB.query(`DELETE FROM orders WHERE order_id = $1`, [id])
        statusCode = 200, message = 'success'
        if(data.rowCount > 0) {
            const tableName = 'orders'
            const columnName = 'order_id'
            const resetQuery = `SELECT setval('${tableName}_${columnName}_seq', (SELECT COALESCE(MAX(${columnName}), 0) + 1 FROM ${tableName}), FALSE)`
            await pgDB.query(resetQuery)
        } else {
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