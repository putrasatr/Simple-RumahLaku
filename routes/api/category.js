const express = require("express");
const router = express.Router();

module.exports = (pool) => {
    router.get('/:page/kategori=sewa', function (req, res, next) {
        const search = req.query.search
        pool.query('SELECT lokasi FROM iklan WHERE isjual = false', (err, lok_sewa) => {
            const result_sewa = lok_sewa.rows
            console.log(result_sewa)
            let lokasi_sewa = []
            let isLok_sewa = false
            result_sewa.forEach(item => {
                if (search && item.lokasi.toLowerCase().includes(search.toLowerCase())) {
                    lokasi_sewa.push(item.lokasi)
                    isLok_sewa = true
                }
            });

            const per_page = 3;
            const page = req.params.page || 1;
            const queryObject = url.parse(req.url, true).search;
            let params_sewa = [];
            if (search && Number(search)) {
                params_sewa.push(`harga = '${search}'`)
            }
            if (search && Number(search)) {
                params_sewa.push(`harga = '${search}'`)
            }
            if (search && Number(search)) {
                params_sewa.push(`id = '${search}'`)
            }
            if (search && isLok_sewa) {
                if (lokasi_sewa.length > 0) {
                    let locs = ''
                    for (let i = 0; i < lokasi_sewa.length; i++) {
                        locs += ` lokasi = '${lokasi_sewa[i]}' ${i == lokasi_sewa.length - 1 ? "" : "OR"}`
                    }
                    params_sewa.push(`${locs}`)
                } else {
                    params_sewa.push(lokasi_sewa)
                }

            }
            let sql = `SELECT * FROM iklan WHERE isJual = false `;
            if (params_sewa.length > 0) {
                sql += ` WHERE `;
                for (let i = 0; i < params_sewa.length; i++) {
                    sql += `${params_sewa[i]}`;
                    if (params_sewa.length != i + 1) {
                        sql += ` OR `;
                    }
                }
            }
            pool.query(sql, (err, data) => {
                if (err) return err
                sql += `ORDER BY id ASC LIMIT 3 OFFSET ${(page - 1) * per_page} `
                pool.query(sql, (err, rows) => {
                    if (err) { res.status(400).json({ "error": err.message }); return; }
                    // res.json(rowsFilt.rows);
                    res.status(200).json({
                        data: rows.rows,
                        current: page,
                        filter: queryObject,
                        next_page: parseInt(page) + 1,
                        previous_page: parseInt(page) - 1,
                        pages: Math.ceil(data.rows.length / per_page)
                    });
                });
            })
        });
    })

    router.get('/:page/kategori=jual', function (req, res, next) {
        const search = req.query.search
        pool.query('SELECT lokasi FROM iklan WHERE isjual = true', (err, lok_jual) => {
            const result_jual = lok_jual.rows
            let lokasi_jual = []
            let isLok_jual = false
            result_jual.forEach(item => {
                if (search && item.lokasi.toLowerCase().includes(search.toLowerCase())) {
                    lokasi_jual.push(item.lokasi)
                    isLok_jual = true
                }
            });
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
            if (search && isLok_jual) {
                if (lokasi_jual.length > 0) {
                    let locs = ''
                    for (let i = 0; i < lokasi_jual.length; i++) {
                        locs += ` lokasi = '${lokasi_jual[i]}' ${i == lokasi_jual.length - 1 ? "" : "OR"}`
                    }
                    params.push(`${locs}`)
                } else {
                    params.push(lokasi_jual)
                }

            }
            if (search) {
                params.push(`foto = '${search}'`)
            }
            let sql = `SELECT * FROM iklan WHERE isJual = true `;
            if (params.length > 0) {
                sql += ` WHERE `;
                for (let i = 0; i < params.length; i++) {
                    sql += `${params[i]}`;
                    if (params.length != i + 1) {
                        sql += ` OR `;
                    }
                }
            }
            pool.query(sql, (err, data) => {
                if (err) return err
                sql += `ORDER BY id ASC LIMIT 3 OFFSET ${(page - 1) * per_page} `
                pool.query(sql, (err, rows) => {
                    if (err) { res.status(400).json({ "error": err.message }); return; }
                    // res.json(rowsFilt.rows);
                    res.status(200).json({
                        data: rows.rows,
                        current: page,
                        filter: queryObject,
                        next_page: parseInt(page) + 1,
                        previous_page: parseInt(page) - 1,
                        pages: Math.ceil(data.rows.length / per_page)
                    });
                });
            })
        });
    })
    return router
}