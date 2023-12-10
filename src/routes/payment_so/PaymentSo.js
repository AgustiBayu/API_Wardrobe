const express = require('express')
const { mysqlDB, getConnection} = require('../../../db.js')
const router = express.Router()

router.post('/paymentSo', async (req, res) => {
    const conn = await getConnection()
    try {
        const { orderSoId, customerId, total, tanggal, paymentStatus} = req.body
        const data = await conn.execute(`INSERT INTO payment_so VALUES(DEFAULT, ?, ?, ?, null, ?, ?)`,
        [ orderSoId, customerId, total, tanggal, paymentStatus])
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

router.get('/paymentSo', async (req, res) => {
    const conn = await getConnection()
    try {
        const data = await conn.execute(`
        SELECT 
        a.paymentSO_id, 
        a.customer_id, 
        c.customer_name,  
        a.order_id, 
        a.total,
        a.bank, 
        a.tanggal, 
        a.payment_status
        FROM payment_so a
        INNER JOIN orders b
        ON a.order_id = b.order_id
        INNER JOIN customers c
        on b.customer_id = c.customer_id
        order by a.paymentSO_id`)
        res.status(200).json(data[0]);
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error ' + e
        })
    }
})

router.put('/paymentSo/:id', async (req, res) => {
    const conn = await getConnection()
    try {
        const { orderSoId, customerId, total, bank, tanggal, paymentStatus} = req.body
        const id = req.params.id
        const data = await conn.execute(`UPDATE payment_so SET order_id = ?, customer_id = ?,
        total = ?, bank = ?, tanggal = ?, payment_status = ? WHERE paymentSO_id = ?`, 
        [orderSoId, customerId, total, bank, tanggal, paymentStatus, id])
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
router.delete('/paymentSo/:id', async (req, res) => {
    const conn = await getConnection()
    try {
        const {id} = req.params
        const data = await conn.execute(`DELETE FROM payment_so WHERE paymentSO_id = ?`, [id])
        statusCode = 200, message = 'success'
        if(data[0].affectedRows > 0) {
            const tableName = 'payment_so'
            const columnName = 'paymentSO_id'
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