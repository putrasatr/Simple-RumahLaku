const express = require("express");
const router = express.Router();

module.exports = (pool) => {
    router.get('/:id', async (req, res) => {
        let { id } = req.params;
        let sql = `SELECT i.*, u.username, u.no_tlp FROM iklan i LEFT JOIN users u ON i.id_user = u.id WHERE i.id = ${id}`;
        try {
            const { rows } = await pool.query(sql)
            res.json({
                data: rows[0],
            })
        } catch (error) {
            console.log(error)
            res.send('Gagal memuat data iklan')
        }
    })
    return router
}