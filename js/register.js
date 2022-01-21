if (!localStorage.getItem("password")) {
    $("#register").click(function () {
        $(".index").fadeOut("fast");
        $(".register-page").fadeIn("fast");
        $(".paletas-guardadas-page").fadeOut("fast");
    });

    $("#nueva-paleta").click(function () {
        $(".index").fadeIn("slow");
        $(".register-page").fadeOut("fast");
        $(".fondo-wave3").fadeOut("fast");
        $(".paletas-guardadas-page").fadeOut("fast");
    });

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
    $("#register").click(function () {
        $(".index").fadeOut("fast");
        $(".register-page").fadeIn("fast");
        $(".paletas-guardadas-page").fadeOut("fast");
    });

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
