const express = require('express')
const { mysqlDB, getConnection } = require('../../../db.js')
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const extName = path.extname(file.originalname)
        const currDate = Date.now()
        cb(null, currDate + extName)
    }
})
const upload = multer({ storage })

router.get('/product', async (req, res) => {
    const conn = await getConnection()
    try {
        const data = await conn.execute(`
        SELECT 
            a.product_id,
            a.product_name,
            b.category_name,
            a.image,
            a.description,
            a.created_at
            from products a
        LEFT JOIN product_categories b 
        on a.category_id = b.category_id`)
        res.status(200).json({
            data: data.rows,
            statusCode: 200,
            message: 'success'
        })
    } catch (e) {
        res.status(400), json({
            statusCode: 400,
            message: 'Have an error :' + e
        })
    }
})

router.post('/product', upload.single('image'), async (req, res) => {
    const conn = await getConnection()
    try {
        const imagePath = req.file ? req.file.filename : '';
        const { productName, categoryId, price, description, createdAt } = req.body

        const data = await conn.execute(`INSERT INTO products VALUES(DEFAULT,?,?,?,?,?,?)`, [productName,
            categoryId, price, imagePath, description, createdAt])
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
            message: 'Have an error :' + e
        })
    }
})

router.put('/product/:id', upload.single('image'), async (req, res) => {
    const conn = await getConnection()
    try {
        const { productName, categoryId, price, description, createdAt } = req.body
        const imagePath = req.file ? req.file.filename : '';
        const { id } = req.params

        const data = await conn.execute(`UPDATE products SET product_name =?, category_id=?, price=?,image=?, description=?, created_at=? WHERE product_id = ?`,
            [productName, categoryId, price, imagePath, description, createdAt, id])
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

router.delete('/product/:id', async (req, res) => {
    const conn = await getConnection()
    try {
        const { id } = req.params
        const dataImage = await conn.execute(`SELECT image from products WHERE product_id = ?`, [id])
        const data = await conn.execute(`DELETE FROM products WHERE product_id = ?`, [id])
        var statusCode = 200, message = 'success';
        if (data.rowCount > 0) {
            fs.unlink('./uploads/' + dataImage.rows[0].image, (err) => {
                if (err) {
                    console.log('image e ', err)
                }
            })
            const tableName = 'products';
            const columnName = 'product_id';
            const resetQuery = `SELECT setval('${tableName}_${columnName}_seq', (SELECT COALESCE(MAX(${columnName}), 0) + 1 FROM ${tableName}), false)`;
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