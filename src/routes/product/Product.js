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
			IFNULL(
            (SELECT SUM(c.stock_quantity) FROM product_stocks c WHERE c.product_id = a.product_id),0) asstock_product,
            a.created_at
            from products a
        LEFT JOIN product_categories b 
        on a.category_id = b.category_id`)
        res.status(200).json({
            data: data[0],
            statusCode: 200,
            message: 'success'
        })
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
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
        if (data[0].affectedRows == 0) {
            statusCode = 400,
                message = 'failed'
        }
        res.status(statusCode).json({
            statusCode,
            message
        })
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: 'Have an error :' + e
        })
    }
})

router.put('/product/:id', upload.single('image'), async (req, res) => {
    const conn = await getConnection();
    try {
        const { productName, categoryId, price, description, createdAt } = req.body;
        const { id } = req.params;
        const [dataImage] = await conn.execute('SELECT image from products WHERE product_id = ?', [id]);

        let imagePath = dataImage[0].image;

        if (req.file) {
            imagePath = req.file.filename;
            const imageFilePath = './uploads/' + dataImage[0].image;
            fs.unlink(imageFilePath, (err) => {
                if (err) {
                    console.log('Error deleting image:', err);
                }
            });
        }
        const data = await conn.execute('UPDATE products SET product_name = ?, category_id = ?, price = ?, image = ?, description = ?, created_at = ? WHERE product_id = ?',
            [productName, categoryId, price, imagePath, description, createdAt, id]);
        let statusCode = 200, message = 'success';
        if (data[0].affectedRows === 0) {
            statusCode = 400;
            message = 'failed';
        }
        res.status(statusCode).json({
            statusCode,
            message
        });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: 'An error occurred: ' + e.message
        });
    }
});

router.delete('/product/:id', async (req, res) => {
    const conn = await getConnection();
    try {
        const { id } = req.params;
        const [dataImage] = await conn.execute('SELECT image from products WHERE product_id = ?', [id]);

        if (dataImage.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Product not found',
            });
        }

        const imageFilePath = './uploads/' + dataImage[0].image;
        fs.unlink(imageFilePath, (err) => {
            if (err) {
                console.log('Error deleting image:', err);
            }
        });

        const [data] = await conn.execute('DELETE FROM products WHERE product_id = ?', [id]);

        if (data.affectedRows > 0) {
            const tableName = 'products';
            const columnName = 'product_id';
            const maxIdQuery = `SELECT COALESCE(MAX(${columnName}), 0) + 1 AS max_id FROM ${tableName}`;
            const [maxIdData] = await conn.execute(maxIdQuery);
            const maxId = maxIdData[0].max_id;

            const resetQuery = `ALTER TABLE ${tableName} AUTO_INCREMENT = ${maxId}`;
            await conn.execute(resetQuery);

            res.status(200).json({
                statusCode: 200,
                message: 'Success',
            });
        } else {
            res.status(400).json({
                statusCode: 400,
                message: 'Deletion failed',
            });
        }
    } catch (e) {
        console.error('Error:', e);
        res.status(500).json({
            statusCode: 500,
            message: 'An error occurred: ' + e.message,
        });
    }
});

module.exports = router