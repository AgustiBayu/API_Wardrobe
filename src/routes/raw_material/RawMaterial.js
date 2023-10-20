const express = require('express')
const { pgDB } = require('../../../db.js')
const router = express.Router()

router.post('/material', async (req, res) => {
    try {
        const { materialName, supplierId, price, quantityInStock } = req.body
        const data = await pgDB.query(`INSERT INTO materials VALUES(DEFAULT, $1, $2, $3, $4)`, [materialName, supplierId, price, quantityInStock])
        statuCode = 200, message = 'success'
        if (data.rowCount == 0) {
            statuCode = 400,
                message = 'failed'
        }
        res.status(statuCode).json({
            statuCode,
            message
        })
    } catch (e) {
        res.status(400).json({
            statuCode: 400,
            message: "Have an error :" + e
        })
    }
})

router.get('/material', async (req, res) => {
    try {
        const data = await pgDB.query(`select
        a.material_id,
        a.material_name,
        b.supplier_name,
        a.price,
        a.quantity_in_stock from materials a
    inner join suppliers b
    on a.supplier_id = b.supplier_id`)
        res.status(200).json({
            data: data.rows,
            statuCode: 200,
            message: 'success'
        })
    } catch (e) {
        res.status(400).json({
            statuCode: '400',
            message: 'Have an error :' + e
        })
    }
})

router.put('/material/:id', async (req, res) => {
    try {
        const { materialName, supplierId, price, quantityInStock } = req.body
        const { id } = req.params

        const data = await pgDB.query(`UPDATE materials SET material_name = $1, supplier_id = $2,
        price = $3, quantity_in_stock = $4 WHERE material_id = $5`, [materialName, supplierId, price, quantityInStock, id])
        statuCode = 200, message = 'success'
        if (data.rowCount == 0) {
            statuCode = 400,
                message = 'failed'
        }
        res.status(statuCode).json({
            statuCode,
            message
        })
    } catch (e) {
        res.status(400).json({
            statuCode: 400,
            message: 'Have an error :' + e
        })
    }
})

router.delete('/material/:id', async (req, res) => {
    try {
        const { id } = req.params
        const data = await pgDB.query(`DELETE FROM materials WHERE material_id = $1`, [id])
        statuCode = 200, message = 'success'
        if(data.rowCount > 0) {
            const tableName = 'materials';
            const columnName = 'material_id';
            const resetQuery = `SELECT setval('${tableName}_${columnName}_seq', (SELECT COALESCE(MAX(${columnName}), 0) + 1 FROM ${tableName}), false)`;
            await pgDB.query(resetQuery);
        } else {
            statuCode = 400,
            message = 'failed'
        }
        res.status(statuCode).json({
            statuCode,
            message
        })
    } catch (e) {
        res.status(400).json({
            statuCode: 400,
            message: 'Have an error :' + e
        })
    }
})

module.exports = router