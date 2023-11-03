const express = require('express')
const { mysqlDB, getConnection } = require('../../../db.js')
const router = express.Router()

router.get('/materialProduct', async (req, res) => {
    const conn = await getConnection()
    try {
        const data = await conn.execute(`select 
        a.material_products_id,
        b.product_name,
        c.material_name,
        c.price,
        c.quantity_in_stock,
        a.satuan,
		a.jumlah
        from material_products a
    inner join products b
    on a.product_id = b.product_id
    inner join materials c
    on a.material_id = c.material_id`)
        res.status(200).json({
            data: data.rows,
            statusCode: 200,
            message: 'success'
        })
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error: ' + e
        })
    }
})

router.post('/materialProduct', async (req, res) => {
    const conn = await getConnection()
    try {
        const { materialId, productId, satuan, jumlah } = req.body
        const data = await conn.execute(`INSERT INTO material_products VALUES(DEFAULT, ?,?,?,?)`, [materialId, productId, satuan, jumlah])
        statusCode = 200, message = 'success'
        if (data.rowCount == 0) {
            res.status(400).json({
                statusCode: 400,
                message: 'failed'
            })
        } else {
            res.status(statusCode).json({
                statusCode,
                message
            })
        }
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error :' + e
        })
    }
})

router.put('/materialProduct/:id', async (req, res) => {
    const conn = await getConnection()
    try {
        const { materialId, productId, satuan, jumlah } = req.body
        const { id } = req.params
        const data = await conn.execute(`UPDATE material_products SET material_id = ?, product_id = ?, satuan = ?,
        jumlah = ? WHERE material_products_id = ?`, [materialId, productId, satuan, jumlah, id])
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
router.delete('/materialProduct/:id', async (req, res) => {
    const conn = await getConnection()
    try {
        const { id } = req.params
        const data = await conn.execute(`DELETE FROM material_products WHERE material_products_id = ?`, [id])
        statusCode = 200, message = 'success'
        if (data.rowCount > 0) {
            const tableName = 'material_products'
            const columnName = 'material_products_id'
            const resetQuery = `SELECT setval('${tableName}_${columnName}_seq', (SELECT COALESCE(MAX(${columnName}), 0) + 1 FROM ${tableName}), FALSE)`
            await mysqlDB.query(resetQuery)
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
            message: 'Have an error :' + e
        })
    }
})
router.get('/materialProductBOM', async (req, res) => {
    const conn = await getConnection()
    try {
        const data = await conn.execute(`select 
        b.product_name,
				b.price cost_product,
				c.quantity_in_stock,
        c.material_name,
        c.price cost_material,
        c.quantity_in_stock * c.price as const_bom,
				SUM(c.quantity_in_stock * c.price) AS total_const_bom
        from material_products a
    inner join products b
    on a.product_id = b.product_id
    inner join materials c
    on a.material_id = c.material_id
		GROUP BY b.product_name, c.material_name, b.price,c.quantity_in_stock, c.price`)
        res.status(200).json({
            data: data.rows,
            statusCode: 200,
            message: 'success'
        })
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error: ' + e
        })
    }
})
module.exports = router