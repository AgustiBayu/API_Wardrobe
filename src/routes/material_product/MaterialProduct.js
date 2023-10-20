const express = require('express')
const { pgDB } = require('../../../db.js')
const router = express.Router()

router.get('/materialProduct', async (req, res) => {
    try {
        const data = await pgDB.query(`select 
        a.material_products_id,
        b.product_name,
        c.material_name,
        c.price,
        c.quantity_in_stock,
        a.satuan 
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
    try {
        const { materialId, productId, satuan } = req.body
        const data = await pgDB.query(`INSERT INTO material_products VALUES(DEFAULT, $1,$2,$3)`, [materialId, productId, satuan])
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
    try {
        const { materialId, productId, satuan } = req.body
        const { id } = req.params
        const data = await pgDB.query(`UPDATE material_products SET material_id = $1, product_id = $2, satuan = $3
        WHERE material_products_id = $4`, [materialId, productId, satuan, id])
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
    try {
        const { id } = req.params
        const data = await pgDB.query(`DELETE FROM material_products WHERE material_products_id = $1`, [id])
        statusCode = 200, message = 'success'
        if (data.rowCount > 0) {
            const tableName = 'material_products'
            const columnName = 'material_products_id'
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
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error :' + e
        })
    }
})
router.get('/materialProductBOM', async (req, res) => {
    try {
        const data = await pgDB.query(`select 
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