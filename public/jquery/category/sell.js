$(document).ready(function () {
    getData(1)
    detailData()
    compareData()

    $('.fixed-bottom').click(function () {
        $('html,body').animate({
            scrollTop: 0
        })
    })

    $(".dropdown-toggle").mouseenter(function () {
        $('.dropdown-menu').slideDown().mouseenter(function () {
            $(this).slideDown().mouseleave(function () {
                $(this).slideUp();
            })
        })
    })

})

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
        url: `${API_URL}/${page}/kategori=jual/${url_catch}`,
        method: 'GET',
        dataType: 'json'
    }).done(function (data) {
        let filter = JSON.stringify(data.filter)
        $("#filter").html(`${filter == 'null' ? `<h1>KATEGORI JUAL</h1><hr>` : `<h1>Pencarian Untuk '${filter.slice(9, filter.length - 1)}'</h1><hr>`}`)
        let rows = data.data
        let html = ``
        if (rows.length == 0) {
            html += `<h3 class="text-muted col-7 col-md-12"><img src="/images/icon/search_off-24px.svg"> Tidak ditemukan</h3>`
        } else {
            rows.forEach((item, index) => {
                let foto = item.foto.split(',')
                html += `
                <div class="col">
                    <div class="card h-100" draggable="true" ondragstart="drag(event)"
                        style="float: left;" id="${item.id}">
                        <div class="card-body">
                            <img class="card-img-top" src="/images/upload/${foto[0]}">
                                <p></p>
                            <div>
                            <h5 class="card-title" style="color: #52adf2;">${item.harga} IDR
                        
                            <small class="negotiable">${item.isNego ? "(Nego)" : "(Harga Pas)"}
                               
                            </small>
                    </h5>
                    <p class="card-text">Jumlah Kamar : ${item.jml_kamar}
                        
                    </p>
                    <p class="card-text"><img src="/images/icon/pin_drop-24px.svg"> ${item.lokasi}</p>
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-white detail-button" style="color: black;float: right;" type="button" data-id-detail="${item.id}">
                    Detail<img class="gi gi-arrow-right" src="/images/arrow.png" style="width: 15px;">
                </button>
            </div>
        </div>
    </div>
        `})
        };
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
    }).fail(function (jqXHR, textStatus) {
        alert("Request Failed Get Data: " + textStatus);
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
            alert("Request Failed Get Data: " + textStatus);
        })
    })
}