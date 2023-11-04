const express = require("express");
const {mysqlDB, getConnection} = require("../../../db.js");
const router = express.Router();

router.get("/customer", async (req, res) => {
    try {
        const conn = await getConnection()
        const data = await conn.execute(`
        SELECT
        customer_id,
        customer_name,
        email,
        phone_number from customers`);
        console.log(data[0]);
        res.status(200).json({
            data: data[0],
            statusCode: 200,
            message: "success",
        });
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
        const data = await mysqlDB.query(`DELETE FROM customers WHERE customer_id = ?`, [id])
        statusCode = 200, message = 'susccess';
        if (data.rowCount > 0) {
            const tableName = 'customers'
            const columnName = 'customer_id'
            const resetQuery = `SELECT setval('${tableName}_${columnName}_seq', (SELECT COALESCE(MAX(${columnName}), 0) + 1 FROM ${tableName}), false)`
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
            message: 'Have an error ' + e
        })
    }
})

module.exports = router