const express = require("express");
const {mysqlDB, getConnection} = require("../../../db.js");
const router = express.Router();

router.get("/customer", async (req, res) => {
    try {
        const conn = await getConnection()
        const data = await conn.execute(`
        SELECT * from customers`);
        res.status(200).json(data[0]);
    } catch (e) {
        res.status(400).
            json({
                statusCode: 400,
                message: "Have an error :" + e,
            });
    }
});

router.post('/customer', async (req, res) => {
    const conn = await getConnection()
    try {
        const { customerName, email, phoneNumber } = req.body
        const data = await conn.execute(`INSERT INTO customers VALUES(DEFAULT,?,?,?)`, [customerName, email, phoneNumber])
        statusCode = 200, message = 'success'
        if (data[0] == 0) {
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

router.put('/customer/:id', async (req, res) => {
    const conn = await getConnection()
    try {
        const { customerName, email, phoneNumber } = req.body
        const { id } = req.params

        const data = await conn.execute('UPDATE customers SET customer_name=?, email=?, phone_number=? WHERE customer_id=?',
            [customerName, email, phoneNumber, id])
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

router.delete('/customer/:id', async (req, res) => {
    const conn = await getConnection()
    try {
        const { id } = req.params
        const data = await conn.execute(`DELETE FROM customers WHERE customer_id = ?`, [id])
        var statusCode = 200, message = 'susccess';
        if (data[0].affectedRows > 0) {
            const tableName = 'customers';
            const columnName = 'customer_id';
            const maxIdQuery = `SELECT COALESCE(MAX(${columnName}), 0) + 1 AS max_id FROM ${tableName}`;
            const [maxIdData] = await conn.execute(maxIdQuery);
            const maxId = maxIdData[0].max_id;
            
            const resetQuery = `ALTER TABLE ${tableName} AUTO_INCREMENT = ${maxId}`;
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