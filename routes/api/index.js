let express = require('express');
let path = require('path');
let router = express.Router();
const url = require('url');
let bcrypt = require('bcrypt');
const saltRounds = 10;
const fileUpload = require('express-fileupload');

module.exports = (pool) => {
    router.get('/:page', async (req, res, next) => {
        try {
            let lokasi = []
            let isLok = false
            const search = req.query.search
            const result = await pool.query('SELECT lokasi FROM iklan').rows;
            if (result) {
                result.forEach(item => {
                    if (search && item.lokasi.toLowerCase().includes(search.toLowerCase())) {
                        lokasi.push(item.lokasi)
                        isLok = true
                    }
                });
            }
            const per_page = 3;
            const page = req.params.page || 1;
            const queryObject = url.parse(req.url, true).search;
            let params = [];
            if (search && Number(search)) {
                params.push(`harga = '${search}'`)
            }
            if (search && Number(search)) {
                params.push(`harga = '${search}'`)
            }
            if (search && Number(search)) {
                params.push(`id = '${search}'`)
            }
            if (search && isLok) {
                if (lokasi.length > 0) {
                    let locs = ''
                    for (let i = 0; i < lokasi.length; i++) {
                        locs += ` lokasi = '${lokasi[i]}' ${i == lokasi.length - 1 ? "" : "OR"}`
                    }
                    params.push(`${locs}`)
                } else {
                    params.push(lokasi)
                }

            }
            if (search) {
                params.push(`foto = '${search}'`)
            }
            let sql = `SELECT * FROM iklan`;
            if (params.length > 0) {
                sql += ` WHERE `;
                for (let i = 0; i < params.length; i++) {
                    sql += `${params[i]}`;
                    if (params.length != i + 1) {
                        sql += ` OR `;
                    }
                }
            }

            const rows = await pool.query(sql)
            sql += ` ORDER BY id DESC `;
            const data = await pool.query(sql)
            res.status(200).json({
                data: data.rows,
                current: page,
                filter: queryObject,
                next_page: parseInt(page) + 1,
                previous_page: parseInt(page) - 1,
                pages: Math.ceil(rows.rows.length / per_page)
            });
        } catch (error) {
            console.log(error)
            res.status(400).json({
                "error": error
            });
        }
    })
    router.get('/coordinate', async (req, res) => {
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