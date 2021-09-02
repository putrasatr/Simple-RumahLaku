const express = require("express");
const router = express.Router();

module.exports = (pool) => {
    router.get('/:id', (req, res) => {
        let { id } = req.params;
        let rep = id.split('+').join(',')
        let sql = `SELECT * FROM iklan WHERE id IN (${rep})`;
        pool.query(sql, (err, result) => {
            if (err) {
                res.send('Gagal memuat data iklan')
            } else {
                res.json(result.rows)
            }
        })
    })
    return router
}