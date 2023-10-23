const express = require('express')
const { pgDB } = require('../../../db.js')
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
        const data = await pgDB.query(`
        SELECT 
            a.product_id,
            a.product_name,
            a.category_id,
            b.category_name,
            a.price,
            a.image,
            a.description,
            a.created_at
            from products a
        LEFT JOIN product_categories b 
        on a.category_id = b.category_id`)
        res.status(200).json(data.rows)
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
        const { productName, categoryId, price, description, createdAt, imgProd } = req.body;

        const data = await pgDB.query(`INSERT INTO products VALUES(DEFAULT,$1,$2,$3,$4,$5,$6)`, [productName,
            categoryId, price, imgProd, description, createdAt])
        statusCode = 200, message = 'success'
        if (data.rowCount == 0) {
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
        const { productName, categoryId, price, description, createdAt, imgProd } = req.body;
        const id = parseInt(req.params.id, 10);

        const data = await pgDB.query(`UPDATE products SET product_name =$1, category_id=$2, price=$3, image=$4, description=$5, created_at=$6 WHERE product_id = $7`,
            [productName, categoryId, price, imgProd, description, createdAt, id]);
        statusCode = 200, message = 'success'
        if (data.rowCount == 0) {
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
        const { id } = req.params
        const dataImage = await pgDB.query(`SELECT image from products WHERE product_id = $1`, [id])
        const data = await pgDB.query(`DELETE FROM products WHERE product_id = $1`, [id])
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
        });
    }
})

router.get('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = await pgDB.query(`SELECT * FROM products WHERE product_id = $1`, [id]);
        res.status(200).send(data.rows);
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