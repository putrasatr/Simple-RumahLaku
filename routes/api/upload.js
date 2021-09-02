const express = require("express");
const router = express.Router();
const { isArray } = require('util');
const { makeid } = require("../../helper/util")

module.exports = (pool) => {
    router.post('/upload', async (req, res) => {
        const { alamat, harga, isNego, luasTanah, koordinat, desc, id_users, kmrmandi, kamar, kategori, judul } = req.body;
        let sql = `INSERT INTO iklan (lokasi,coordinate,jml_kamar,isnego,foto,harga,isjual,id_user,luastanah,deskripsi,created_date,kmr_mandi,judul) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,current_timestamp,$11,$12)`
        let { sampleFile } = req.files
        const pathFolder = path.join(__dirname, "../public/images/upload/")
        let images = []
        try {
            if (!(isArray(sampleFile))) sampleFile = [sampleFile]
            sampleFile.forEach((item, i) => {
                images.push(makeid(5, ''))
                item.mv(pathFolder + images[i], (err) => {
                    if (err) console.log(err)
                })
            })
            let params = [alamat, koordinat, kamar, isNego ? true : false, images, harga, kategori == "jual" ? true : false, id_users, luasTanah, desc, kmrmandi, judul]
            await pool.query(sql, params)
            return res.redirect('/')
        } catch (error) {
            console.log(error)
            return res.redirect('/upload')
        }
    });
    return router
}