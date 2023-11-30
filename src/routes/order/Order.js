const express = require('express')
const { mysqlDB, getConnection } = require('../../../db.js')
const router = express.Router();

router.post('/order', async (req, res) => {
    const conn = await getConnection()
    try {
        const { customerId, productId, quantityDemand, total, tanggal, orderStatus, paymentStatus } = req.body
        const data = await conn.execute(`INSERT INTO orders VALUES(DEFAULT, ?, ?, ?, DEFAULT, ?, ?, ?, ?)`,
        [customerId, productId, quantityDemand, total, tanggal, orderStatus, paymentStatus])
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
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error ' + e
        })
    }
})

router.get('/order', async (req, res) => {
    const conn = await getConnection()
    try {
        const data = await conn.execute(`
        SELECT 
        a.order_id, 
        a.customer_id, 
        c.customer_name,  
        a.product_id, 
        b.product_name,
        b.price,
        a.quantity_demand, 
        a.quantity_receive,
        a.total, 
        a.order_date, 
        a.order_status, 
        a.payment_status
        FROM orders a
        INNER JOIN products b
        ON a.product_id = b.product_id
        INNER JOIN customers c
        on a.customer_id = c.customer_id
        order by a.order_id`)
        res.status(200).json(data[0]);
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error ' + e
        })
    }
})

router.put('/order/:id', async (req, res)=> {
    const conn = await getConnection()
    try {
        const { customerId, productId, quantityDemand, quantityReceive,
            total, tanggal, orderStatus, paymentStatus } = req.body
        const id = req.params.id
        const data = await conn.execute(`UPDATE orders SET customer_id = ?, product_id = ?,
        quantity_demand = ?, quantity_receive = ?, total = ?, order_date = ?, order_status = ?,
        payment_status = ? WHERE order_id = ?`, [customerId, productId, quantityDemand, quantityReceive,
            total, tanggal, orderStatus, paymentStatus, id])
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