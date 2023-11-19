const express = require('express')
const { mysqlDB, getConnection} = require('../../../db.js')
const router = express.Router()

router.post('/purchesOrder', async (req, res) => {
    const conn = await getConnection()
    try {
        const { supplierId, materialId, quantityDemand, quantityReceive,
        total, tanggal, orderStatus, paymentStatus } = req.body
        const data = await conn.execute(`INSERT INTO purchase_orders VALUES(DEFAULT, ?,?,?,?,?,?,?,?)`,
        [supplierId, materialId, quantityDemand, quantityReceive, total, tanggal, orderStatus, paymentStatus])
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

router.get('/purchesOrder', async (req, res) => {
    const conn = await getConnection()
    try {
        const data = await conn.execute(`SELECT * FROM purchase_orders`)
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

router.put('/purchesOrder/:id', async (req, res) => {
    const conn = await getConnection()
    try {
        const { supplierId, materialId, quantityDemand, quantityReceive,
            total, tanggal, orderStatus, paymentStatus } = req.body
        const { id } = req.params
        const data = await conn.execute(`UPDATE purchase_orders SET supplier_id = ?, material_id = ?,
        quantity_demand = ?, quantity_receive = ?, total = ?, tanggal = ?, order_status = ?,
        payment_status = ? WHERE orderPO_id = ?`, [supplierId, materialId, quantityDemand, quantityReceive,
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
router.delete('/purchesOrder/:id', async (req, res) => {
    const conn = await getConnection()
    try {
        const {id} = req.params
        const data = await conn.execute(`DELETE FROM purchase_orders WHERE orderPO_id = ?`, [id])
        statusCode = 200, message = 'success'
        if(data[0].affectedRows > 0) {
            const tableName = 'purchase_orders'
            const columnName = 'orderPO_id'
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
