const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

module.exports = (pool) => {
    router.post('/signin', async (req, res) => {
        let { email, password } = req.body;
        let sql = `SELECT * FROM users WHERE email = $1`;
        try {
            const data = await pool.query(sql, [email])
            if (data.rows.length) {
                const result = await bcrypt.compare(password, data.rows[0].password)
                if (result) {
                    let user = data.rows[0];
                    req.session.user = user;
                    req.session.loggedIn = true;
                    return res.json({
                        msg: 'Success',
                        status: true,
                        session: req.session.users
                    })
                }
                res.json({
                    msg: 'Email or Password incorrect...',
                    status: false,
                })
                return
            }
            res.json({
                msg: 'User not Found...',
                status: false,
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: false,
                msg: "There is something wrong with server"
            })
        }
    })
    router.post('/signup', (req, res) => {
        let { username, no_tlp, email, password, repas } = req.body;
        let sql = `SELECT * FROM users WHERE email = '${email}'`;
        pool.query(sql, (err, result) => {
            if (err) {
                res.json({ err, msg: 'Gagal' });
            } else {
                if (result.rows.length > 0) {
                    res.json({
                        data: result.rows.length,
                        msg: 'emailexist'
                    });
                } else {
                    if (password !== repas) {
                        res.json({
                            data: result.rows.length,
                            msg: 'password not match'
                        })
                    } else {
                        bcrypt.hash(password, saltRounds, function (err, hash) {
                            if (err) {
                                res.send('Gagal ngehash')
                            }
                            let sql_insert = `INSERT INTO users (username,no_tlp, email, password, created_date) VALUES ('${username}', '${no_tlp}', '${email}', '${hash}', current_timestamp)`;
                            pool.query(sql_insert, (err, result) => {
                                if (err) {
                                    console.log(err)
                                    res.json({
                                        err,
                                        msg: 'insertfailed'
                                    })
                                } else {
                                    res.json({
                                        msg: 'success'
                                    });
                                }
                            })
                        });
                    }
                }
            }
        })
    });
    return router
}