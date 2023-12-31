const express = require('express')
const { mysqlDB, getConnection } = require('../../../db.js')

const router = express.Router();

router.post('/order', async (req, res) => {
    const conn = await getConnection()
    try {
        const { orderDate, totalAmount, customerId } = req.body
        statusCode = 200, message = 'success'
        const data = await conn.execute(`INSERT INTO orders VALUES(DEFAULT, ?,?,?)`, [orderDate, totalAmount, customerId])
        statusCode = 200, message = 'success'
        if (data[0].affectedRows == 0) {
            statusCode = 400,
                message = 'failed'
        }
        res.status(statusCode).json({
            statusCode,
            message
        })
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: 'Have an error ' + e
        })
    }
})

router.get('/order', async (req, res) => {
    const conn = await getConnection()
    try {
        const data = await conn.execute(`SELECT 
        a.order_id,
        b.customer_name,
        a.total_amount,
        b.phone_number,
        a.order_date
        from orders a
    INNER JOIN customers b 
    on a.customer_id = b.customer_id`)
        res.status(200).json({
            data: data[0],
            statusCode: 200,
            message: 'success'
        })
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: 'Have an error :' + e
        })
    }
})

router.put('/order/:id', async (req, res)=> {
    const conn = await getConnection()
    try {
        const {id} = req.params
        const {orderDate, totalAmount, customerId} = req.body
        const data = await conn.execute(`UPDATE orders SET order_date = ?, total_amount = ?, customer_id = ?
        WHERE order_id = ?`, [orderDate, totalAmount, customerId, id])

        statusCode = 200, message = 'success'
        if (data[0].affectedRows == 0) {
            statusCode = 400,
                message = 'failed'
        } else {
            res.status(statusCode).json({
                statusCode,
                message
            })
        } 
    } catch(e) {
        res.status(500).json({
            statusCode: 500,
            message: 'Have an error :' + e
        })
    }
})
router.delete('/order/:id', async (req, res) => {
    const conn = await getConnection()
    try {
        const {id} = req.params
        const data = await conn.execute(`DELETE FROM orders WHERE order_id = ?`, [id])
        statusCode = 200, message = 'success'
        if(data[0].affectedRows > 0) {
            const tableName = 'orders'
            const columnName = 'order_id'
            const maxIdQuery = `SELECT COALESCE(MAX(${columnName}), 0) + 1 AS max_id FROM ${tableName}`;
            const [maxIdData] = await conn.execute(maxIdQuery);
            const maxId = maxIdData[0].max_id;
            
            const resetQuery = `ALTER TABLE ${tableName} AUTO_INCREMENT = ${maxId}`;
            await conn.execute(resetQuery);
        } else {
            statusCode = 400;
            message = 'failed';
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