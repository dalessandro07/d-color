$(".register").click(function () {
    $(".register-page").fadeIn("fast");
    $(".paletas-guardadas-page").fadeOut("fast");
    $(".index").fadeOut("fast");
    $(".contenedor-paleta").fadeOut("fast");
});

if (!localStorage.getItem("password")) {
    /* DATOS */

    $("#exampleInputEmail1").on("change", function () {
        if ($(this).val().includes("@")) {
            localStorage.setItem("email", $(this).val());
        } else {
            return;
        }
    });

    $("#exampleInputPassword1").on("change", function () {
        if ($(this).val().length > 6 && $(this).val().length < 28) {
            localStorage.setItem("password", $(this).val());
        } else {
            return;
        }
    });

    $("#exampleCheck1").on("change", function () {
        if ($(this).val() === "on") {
            localStorage.setItem("check", $(this).val());
            $("#exampleCheck1").attr("disabled", "disabled");
        }
    });

    /* REGISTRARSE */

    $("#submit-reg").click(function () {
        if (localStorage.getItem("email") && localStorage.getItem("password") && localStorage.getItem("check")) {
            window.location.href = "index.html";
        } else {
            return;
        }
    });
} else {
    /* REGISTRARSE */

    $("#submit-reg").click(function (e) {
        e.preventDefault();
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
        });
        Toast.fire({
            icon: "info",
            title: "¡Ya estás registrado!",
        });
        setTimeout(() => window.location.reload(), 2000);
    });
}
