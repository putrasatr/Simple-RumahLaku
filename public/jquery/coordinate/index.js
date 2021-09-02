$(document).ready(function () {
    $.ajax({
        url: `${API_URL}/coordinate`,
        method: 'GET',
        dataType: 'json'
    }).done(function (data) {
        let map;
        let corArray = []

        // console.log(data)
        var coordsArray = data.data;
        for (let i = 0; i < coordsArray.length; i++) {
            var coords = coordsArray[i];
            corArray.push(coords.coordinate.x + ', ' + coords.coordinate.y);
        }

        map = new google.maps.Map(document.getElementById("googleMap"), {
            center: { lat: -6.923735, lng: 107.688739 },
            zoom: 12,
        });
        for (let i = 0; i < corArray.length; i++) {
            let foto = data.data[i].foto.split(',')
            let splitCoord = corArray[i].split(",");
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(parseFloat(splitCoord[0]), parseFloat(splitCoord[1])),
                map: map
            });
            marker.addListener("click", (e) => {
                Swal.fire({
                    imageUrl: `/images/upload/${foto[0]}`,
                    title: `${data.data[i].lokasi}`,
                    text: `Titik Koordinat : ${parseFloat(splitCoord[0])},${parseFloat(splitCoord[1])}`,
                    showCancelButton: true,
                    confirmButtonText: 'Detail',
                    cancelButtonText: 'Cancel'
                }).then(function (result) {
                    if (result.isConfirmed) {
                        window.location.href = `/detail?selectedID=${i + 2}`
                    }
                })
            })
        }

        google.maps.event.addDomListener(window, 'load', $(this));

        // console.log(corArray)
    }).fail(function (textStatus, jqXHR) {
    })
})