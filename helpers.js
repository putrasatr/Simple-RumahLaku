const filterData = (data,query) => {
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
}

exports.filterData = filterData