const express = require('express')
const { mysqlDB, getConnection} = require('../../../db.js')
const router = express.Router()

router.post('/supplier', async (req, res) => {
    try {
        const conn = await getConnection()
        const { supplierName, supplierContact, email, phoneNumber } = req.body
        const data = await conn.execute(`INSERT INTO suppliers VALUES(DEFAULT, ?, ?, ?, ?)`, [supplierName, supplierContact, email, phoneNumber])
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

router.get('/supplier', async (req, res) => {
    try {
        const conn = await getConnection()
        const data = await conn.execute(`SELECT * FROM suppliers`)
        res.status(200).json(data[0]);
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error ' + e
        })
    }
})

router.put('/supplier/:id', async (req, res) => {
    try {
        const conn = await getConnection()
        const { supplierName, supplierContact, email, phoneNumber } = req.body
        const { id } = req.params
        const data = await conn.execute(`UPDATE suppliers SET supplier_name = ?, contact_name = ?,
        email = ?, phone_number = ? WHERE supplier_id = ?`, [supplierName, supplierContact, email, phoneNumber, id])
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
router.delete('/supplier/:id', async (req, res) => {
    try {
        const conn = await getConnection()
        const { id } = req.params
        const data = await conn.execute(`DELETE FROM suppliers WHERE supplier_id = ?`, [id])
        var statusCode = 200, message = 'success';
        if (data[0].affectedRows > 0) {
            const tableName = 'suppliers';
            const columnName = 'supplier_id';
            const maxIdQuery = `SELECT COALESCE(MAX(${columnName}), 0) + 1 AS max_id FROM ${tableName}`;
            const [maxIdData] = await conn.execute(maxIdQuery);
            const maxId = maxIdData[0].max_id;
            
            const resetQuery = `ALTER TABLE ${tableName} AUTO_INCREMENT = ${maxId}`;
            await conn.execute(resetQuery);
        } else {
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

module.exports = router
