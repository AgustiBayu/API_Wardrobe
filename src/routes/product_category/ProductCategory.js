const express = require('express')
const { pgDB } = require('../../../db.js')
const router = express.Router()

router.post('/productCategory', async (req, res) => {
    try {
        const { name } = req.body
        const data = await pgDB.query(`INSERT INTO product_categories VALUES (DEFAULT, $1)`, [name])
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

router.get('/productCategory', async (req, res) => {
    try {
        const data = await pgDB.query(`SELECT * FROM product_categories`)
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

router.put('/productCategory/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body
        const data = await pgDB.query(`UPDATE product_categories SET category_name = $1 WHERE category_id = $2`, [name, id])
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
router.delete('/productCategory/:id', async (req, res) => {
    try {
        const { id } = req.params
        const data = await pgDB.query(`DELETE FROM product_categories WHERE category_id = $1`, [id])
        var statusCode = 200, message = 'success';
        if(data.rowCount > 0) {
            const tableName = 'product_categories';
            const columnName = 'category_id';
            const resetQuery = `SELECT setval('${tableName}_${columnName}_seq', (SELECT COALESCE(MAX(${columnName}), 0) + 1 FROM ${tableName}), false)`;
            await pgDB.query(resetQuery);
        } else{
            statusCode = '400',
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