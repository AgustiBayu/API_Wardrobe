const express = require('express')
const { mysqlDB, getConnection} = require('../../../db.js')
const router = express.Router()

router.post('/material', async (req, res) => {
    const conn = await getConnection()
    try {
        const { materialName, supplierId, price, quantityInStock } = req.body
        const data = await conn.execute(`INSERT INTO materials VALUES(DEFAULT, ?,?,?,?)`, [materialName, supplierId, price, quantityInStock])
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
    const conn = await getConnection()
    try {
        const data = await conn.execute(`select
        a.material_id,
        a.material_name,
        b.supplier_name,
        a.price,
        a.quantity_in_stock from materials a
    inner join suppliers b
    on a.supplier_id = b.supplier_id`)
        res.status(200).json({
            data: data[0],
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
    const conn = await getConnection()
    try {
        const { materialName, supplierId, price, quantityInStock } = req.body
        const { id } = req.params

        const data = await conn.execute(`UPDATE materials SET material_name = ?, supplier_id = ?,
        price = ?, quantity_in_stock = ? WHERE material_id = ?`, [materialName, supplierId, price, quantityInStock, id])
        statuCode = 200, message = 'success'
        if (data[0].affectedRows == 0) {
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
    const conn = await getConnection()
    try {
        const { id } = req.params
        const data = await conn.execute(`DELETE FROM materials WHERE material_id = ?`, [id])
        statuCode = 200, message = 'success'
        if(data[0].affectedRows > 0) {
            const tableName = 'materials';
            const columnName = 'material_id';
            const maxIdQuery = `SELECT COALESCE(MAX(${columnName}), 0) + 1 AS max_id FROM ${tableName}`;
            const [maxIdData] = await conn.execute(maxIdQuery);
            const maxId = maxIdData[0].max_id;
            
            const resetQuery = `ALTER TABLE ${tableName} AUTO_INCREMENT = ${maxId}`;
            await conn.execute(resetQuery);
        } else {
            statusCode = 400;
            message = 'failed';
        }
        res.status(statuCode).json({
            statuCode,
            message
        })
    } catch (e) {
        res.status(500).json({
            statuCode: 500,
            message: 'Have an error :' + e
        })
    }
})

module.exports = router