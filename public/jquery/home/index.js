$(document).ready(function () {
    getData(1)
    compareData()
    detailData()
    handleImageHover(1)

    $('.fixed-bottom').click(function () {
        $('html,body').animate({
            scrollTop: 0
        })
    })
})
const handleImageHover = (n) => {
    $('.img_item').on('click', () => {
        console.log(this)
    })
}
const compareData = () => {
    $("#compare").on("click", function () {
        let idCollect = []
        dropped.forEach(item => {
            idCollect.push(item)
        });
        $.ajax({
            url: `${API_URL}/compare/${idCollect.join('+')}`,
            method: 'GET',
            dataType: 'json'
        }).done(function (data) {
            window.location.href = `/compare?selectedID=${idCollect.join('+')}`
        }).fail(function (jqXHR, textStatus) {
            alert("Iklan Belum Terpasang");
        })
    })
}

const detailData = () => {
    $("#daftar-iklan-list ").on("click", ".detail-button", function () {
        const id = $(this).attr('data-id-detail');
        $.ajax({
            url: `${API_URL}/detail/${id}`,
            method: 'GET',
            dataType: 'json'
        }).done(function (data) {
            window.location.href = `/detail?selectedID=${id}`
        }).fail(function (jqXHR, textStatus) {
            alert("Request Failed Get Data: " + textStatus);
        })
    })
}

const getData = (page) => {
    var url_catch = $(location).attr('search')
    $.ajax({
        url: `${API_URL}/index/${page}${url_catch}`,
        method: 'GET',
        dataType: 'json'
    }).done(function (data) {
        let filter = ''
        if (data.filter !== null) {
            let filterArr = data.filter.slice(8, data.filter.length).split("+")
            for (let j = 0; j < filterArr.length; j++) {
                filter += ` ${filterArr[j]}`
            }
        }
        $("#filter").html(`${data.filter == null ? `<h1>IKLAN TERAKHIR</h1><hr>` : `<h2 class="text-muted">Pencarian Untuk '${filter.trim()}'<br><a href="/"><button class="btn btn-secondary">Clear</button></a></h2><hr>`}`)

        let rows = data.data
        let html = ``
        if (rows.length == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Result not found!',
                showConfirmButton: false
            })
        } else {
            rows.forEach(({ foto, judul, harga, lokasi, id }, index) => {
                html += `
                 <a class="card_ad nav-link detail-button" data-id-detail="${id}">
                    <div class="card_img">
                    <img src="/images/upload/${foto[0]}" class="img_item" alt="">
                    <div class="img_caption">
                        <div class="card_caption">
                            <strong>${judul}</strong>
                        </div>
                    </div>
                    </div>
                    <div class="card_footer">
                    <strong class="txt_title">${judul}</strong>
                    <span class="txt_price">Rp.${harga}</span>
                    <span class="txt_address">${lokasi}</span>
                    </div>
                 </a>
                    `})
        };
        // <a class="nav-link" href="/detail/${id}">
        $('#container #daftar-iklan-list').html(html)

        let pagePrevious = ``;
        if (rows.length == 0) {
            pagePrevious += `<a href="/"><button class="btn btn-secondary">kembali<button></a>`
        }
        else if (data.current == 1) {
            pagePrevious += `
                        `
        } else {
            pagePrevious += `
                            <li id="pagination-butt">
                                <button data-id = "${data.previous_page}" type="button" id="page-btn"  class="btn btn-secondary">
                                    <img src="/images/icon/keyboard_arrow_left-black-18dp.svg" alt="">
                                </button>
                            </li> `
        }
        if (data.current == data.pages) {
            pagePrevious += `
                        `
        } else {
            pagePrevious += `
                            <li id="pagination-butt">
                                <button data-id = "${data.next_page}" type="button" id="page-btn" class="btn btn-secondary" style="border-radius= 100%">
                                    <img src="/images/icon/keyboard_arrow_right-black-18dp.svg" alt="">
                                </button>
                            </li>
                        `
        }
        $('.pagination').html(pagePrevious)

        $("li").on("click", "#page-btn", function () {
            const id = $(this).attr('data-id');
            getData(id);
        })
        //--------------------------------- End Pagination ---------------------------------------
        $('.img_caption').hover(function (e) {
            const { type } = e
            const mouseEnter = /(enter)/.test(type)
            if (mouseEnter) {
                $(this).css("opacity", 1)
                return
            }
            $(this).css("opacity", 0)
        })
    }).fail(function (jqXHR, textStatus) {
        console.log("error", textStatus)
        alert("Error")
    })
}