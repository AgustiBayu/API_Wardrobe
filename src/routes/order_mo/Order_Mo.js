const express = require('express')
const { mysqlDB, getConnection } = require('../../../db.js')
const router = express.Router();

router.get('/ordermo', async (req, res) => {
    const conn = await getConnection()
    try {
        const data = await conn.execute(`
        SELECT c.category_name, b.product_name , a.quantity, a.total , a.status ,a.tanggal FROM order_mo a
        INNER JOIN products b
        ON a.product_id = b.product_id
        INNER JOIN product_categories c
        on b.category_id = c.category_id`)
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

router.post('/ordermo', async (req, res) => {
    const conn = await getConnection()
    try {
        const { productId, quantity, total, status, tanggal } = req.body
        const data = await conn.execute(`INSERT INTO order_mo VALUES(DEFAULT,?,?,?,?,?)`, [productId, quantity, total, status, tanggal])
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

router.put('/ordermo/:id', async (req, res) => {
    const conn = await getConnection();
    try {
        const { productId, quantity, total, status, tanggal } = req.body;
        const { id } = req.params;
        const data = await conn.execute('UPDATE order_mo SET product_id = ?, quantity = ?, total = ?, status = ?, tanggal = ? WHERE orderMO_id = ?',
            [productId, quantity, total, status, tanggal, id]);
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

router.delete('/ordermo/:id', async (req, res) => {
    const conn = await getConnection();
    try {
        const { id } = req.params;
        const data = await conn.execute('DELETE FROM order_mo WHERE orderMO_id = ?', [id]);
        let statusCode = 200;
        let message = 'success';
        
        if (data[0].affectedRows > 0) {
            const tableName = 'order_mo';
            const columnName = 'orderMO_id';

            const maxIdQuery = `SELECT COALESCE(MAX(${columnName}), 0) + 1 AS max_id FROM ${tableName}`;
            const [maxIdData] = await conn.execute(maxIdQuery);
            const maxId = maxIdData[0].max_id;
            
            const resetQuery = `ALTER TABLE ${tableName} AUTO_INCREMENT = ${maxId}`;
            await conn.execute(resetQuery);
        } else {
            statusCode = 400;
            message = 'failed';
        }

        console.log(data[0]);
        res.status(statusCode).json({
            statusCode,
            message
        });
        
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: 'Have an error ' + e.message
        });
    }
});

module.exports = router