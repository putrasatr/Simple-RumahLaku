let express = require('express');
let path = require('path');
let router = express.Router();
const url = require('url');
let bcrypt = require('bcrypt');
const saltRounds = 10;
const fileUpload = require('express-fileupload');

module.exports = (pool) => {
    router.get('/', async (req, res) => {
        try {
            let data = await pool.query("SELECT coordinate,lokasi,foto FROM iklan");
            res.json({
                data: data.rows
            })
        } catch (error) {
            console.log(error)
            res.status(400).send('Gagal')
        }
    })
    return router
}