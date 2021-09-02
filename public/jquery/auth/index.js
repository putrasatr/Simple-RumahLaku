$(document).ready(function () {
    signin();
});
const signin = () => {
    $('#signin-form').on('submit', (e) => {
        e.preventDefault();
        let email = $('#email').val();
        let password = $('#password').val();
        $.ajax({
            url: `${API_URL}/auth/signin`,
            method: 'POST',
            data: {
                email: email,
                password: password
            }
        }).done(function ({ status, msg }) {
            if (status) return window.location.href = "/"
            $("#message").html(`<span class="txt_message">${msg}</span>`)
            setTimeout(() => {
                $("#message").html(``)
            }, 2000);
        }).fail(function (jqXHR, textStatus) {
            alert("Request failed get data: " + textStatus);
        })
    })
}