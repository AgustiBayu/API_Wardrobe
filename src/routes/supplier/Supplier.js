const express = require('express')
const { pgDB } = require('../../../db.js')
const router = express.Router()

router.post('/supplier', async (req, res) => {
    try {
        const { supplierName, supplierContact, email, phoneNumber } = req.body
        const data = await pgDB.query(`INSERT INTO suppliers VALUES(DEFAULT, $1,$2,$3,$4)`, [supplierName, supplierContact, email, phoneNumber])
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
        const data = await pgDB.query(`SELECT * FROM suppliers`)
        res.status(200).json({
            data: data.rows,
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

router.put('/supplier/:id', async (req, res) => {
    try {
        const { supplierName, supplierContact, email, phoneNumber } = req.body
        const { id } = req.params
        const data = await pgDB.query(`UPDATE suppliers SET supplier_name = $1, contact_name = $2,
        email = $3, phone_number = $4 WHERE supplier_id = $5`, [supplierName, supplierContact, email, phoneNumber, id])
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
        const { id } = req.params
        const data = await pgDB.query(`DELETE FROM suppliers WHERE supplier_id = $1`, [id])
        var statusCode = 200, message = 'success';
        if (data.rowCount > 0) {
            const tableName = 'suppliers';
            const columnName = 'supplier_id';
            const resetQuery = `SELECT setval('${tableName}_${columnName}_seq', (SELECT COALESCE(MAX(${columnName}), 0) + 1 FROM ${tableName}), false)`;
            await pgDB.query(resetQuery);
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
