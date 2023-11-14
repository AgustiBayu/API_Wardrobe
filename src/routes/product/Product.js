const express = require('express')
const { mysqlDB, getConnection } = require('../../../db.js')
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        // const extName = path.extname(file.originalname);
        // const oriName = Date.now();
        cb(null, file.originalname);
    }
})
const upload = multer({ storage })

router.get('/product', async (req, res) => {
    try {
        const conn = await getConnection()
        const data = await conn.execute(`
        SELECT 
            a.product_id,
            a.product_name,
            a.category_id,
            b.category_name,
            a.price,
            a.image,
            a.description,
            a.created_at,
            a.product_stock
            from products a
        LEFT JOIN product_categories b 
        on a.category_id = b.category_id`)
        res.status(200).json(data[0])
    } catch (e) {
        res.status(400), json({
            statusCode: 400,
            message: 'Have an error :' + e
        });
    }
});

router.post('/imgUp', upload.single('image'), (req, res) => {
    console.log(req.body);
    console.log(req.file);
});

router.post('/product', async (req, res) => {
    try {
        const conn = await getConnection()
        const { productName, categoryId, price, description, createdAt, imgProd } = req.body;

        const data = await conn.execute(`INSERT INTO products VALUES(DEFAULT,?,?,?,?,?,?,DEFAULT)`, [productName,
            categoryId, price, imgProd, description, createdAt])
        statusCode = 200, message = 'success'
        if (data[0] == 0) {
            statusCode = 400;
            message = 'failed';
        }
        res.status(statusCode).json({
            statusCode,
            message,
        });
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error :' + e,
        });
    }
})

router.put('/product/:id', async (req, res) => {
    try {
        const conn = await getConnection()
        const { productName, categoryId, price, description, createdAt, imgProd, prodStock } = req.body;
        const id = parseInt(req.params.id, 10);
        
        const data = await conn.execute(`UPDATE products SET product_name =?, category_id=?, price=?,image=?, description=?, created_at=?, product_Stock=? WHERE product_id = ?`,
            [productName, categoryId, price, imgProd, description, createdAt, prodStock, id]);
        statusCode = 200, message = 'success'
        if (data[0] == 0) {
            statusCode = 400;
            message = 'failed';
        }
        res.status(statusCode).json({
            statusCode,
            message,
        });
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error ' + e,
        });
    }
})

router.delete('/product/:id', async (req, res) => {
    try {
        const conn = await getConnection()
        const id = parseInt(req.params.id, 10);
        const dataImage = await conn.execute(`SELECT image from products WHERE product_id = ?`, [id])
        const data = await conn.execute(`DELETE FROM products WHERE product_id = ?`, [id])
        var statusCode = 200, message = 'success';
        // if (data[0] > 0) {
        //     fs.unlink('./uploads/' + dataImage[0][0].image, (err) => {
        //         if (err) {
        //             console.log('image e ', err)
        //         }
        //     })
        //     const tableName = 'products';
        //     const columnName = 'product_id';
        //     const resetQuery = `SELECT setval('${tableName}_${columnName}_seq', (SELECT COALESCE(MAX(${columnName}), 0) + 1 FROM ${tableName}), false)`;
        //     await conn.execute(resetQuery);
        // } else {
        //     statusCode = 400,
        //         message = 'failed'
        //     console.log(data[0].affectedRows);
        // }
        res.status(statusCode).json({
            statusCode,
            message
        })
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error ' + e
        });
    }
})

router.get('/products/:id', async (req, res) => {
    try {
        const conn = await getConnection()
        const id = parseInt(req.params.id);
        const data = await conn.execute(`SELECT * FROM products WHERE product_id = ?`, [id]);
        res.status(200).send(data[0]);
        // res.status(200).json({
        //     data: data.rows,
        //     statusCode: 200,
        //     message: 'success'
        // })
    } catch (e) {
        res.status(400), json({
            statusCode: 400,
            message: 'Have an error :' + e
        });
    }
});

module.exports = router