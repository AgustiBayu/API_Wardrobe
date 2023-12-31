const express = require('express')
const { mysqlDB, getConnection} = require('../../../db.js')
const router = express.Router()

router.post('/paymentPo', async (req, res) => {
    const conn = await getConnection()
    try {
        const {orderPOId, supplierId, total, bank, tanggal, paymentStatus} = req.body
        const data = await conn.execute(`INSERT INTO payment_po VALUES(DEFAULT, ?,?,?,?,?,?)`,
        [orderPOId, supplierId, total, bank, tanggal, paymentStatus])
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

router.get('/paymentPo', async (req, res) => {
    const conn = await getConnection()
    try {
        const data = await conn.execute(`SELECT * FROM payment_po`)
        res.status(200).json({
            data: data[0],
            statusCode: 200,
            message: 'success'
        })
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error ' + e
        })
    }
})

router.put('/paymentPo/:id', async (req, res) => {
    const conn = await getConnection()
    try {
        const { orderPOId, supplierId, total, bank, tanggal, paymentStatus} = req.body
        const { id } = req.params
        const data = await conn.execute(`UPDATE payment_po SET orderPO_id = ?, supplier_id = ?,
        total = ?, bank = ?, tanggal = ?, payment_status = ? WHERE paymentPO_id = ?`, [orderPOId, supplierId, total, bank, tanggal, paymentStatus, id])
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
router.delete('/paymentPo/:id', async (req, res) => {
    const conn = await getConnection()
    try {
        const {id} = req.params
        const data = await conn.execute(`DELETE FROM payment_po WHERE paymentPO_id = ?`, [id])
        statusCode = 200, message = 'success'
        if(data[0].affectedRows > 0) {
            const tableName = 'payment_po'
            const columnName = 'paymentPO_id'
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
