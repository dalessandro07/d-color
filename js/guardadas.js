/* MOSTRAR PALETAS GUARDADAS */

$("#paletas-guardadas").click(function () {
    $(".index").fadeOut("fast");
    $(".register-page").fadeOut("fast");
    $(".paletas-guardadas-page").fadeIn("fast");
});

$(".actualizarPaletas").on("click", function () {
    localStorage.setItem("recargado", 1);
    window.location.reload();
});

$(".texto-guardadas").on("click", function () {
    $(".index").fadeIn("fast");
    $(".register-page").fadeOut("fast");
    $(".paletas-guardadas-page").fadeOut("fast");
    window.location.href = "index.html#paleta-container";
});

/* CAPTURAR DATOS DEL LOCAL_STORAGE */

if (localStorage.getItem("paletas-guardadas")) {
    $(".texto-guardadas").fadeOut("fast");

    let paletasGuardadas = JSON.parse(localStorage.getItem("paletas-guardadas"));
    let count = 0;

    /* MOSTRAR PALETAS EN EL DOM */

    for (let paleta of paletasGuardadas) {
        $(".paletas-guardadas").append(
            `<div class="paleta-guardada paleta-${count++} d-flex">
                </div>`
        );
        for (const color of paleta) {
            $(".paleta-guardada:last").append(`<div class="paleta-color" style="background-color: ${color.color}"><div class="color-text">${color.color}</div></div>`);
        }
    }

    /* BORRAR PALETAS */

    $(".borrarPaletas").on("click", function () {
        localStorage.removeItem("paletas-guardadas");
        localStorage.setItem("recargado", 1);
        window.location.reload();
    });

    /* EDITAR PALETA */

    $(".paletas-guardadas").on("click", ".paleta-guardada", function () {
        Swal.fire({
            title: "¿Quieres editar o eliminar la paleta? Esta acción no se puede deshacer",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Editar",
            denyButtonText: `Eliminar`,
        }).then((result) => {
            if (result.isConfirmed) {
                let paleta = JSON.parse(localStorage.getItem("paletas-guardadas"));

                let indice = $(this).index();

                localStorage.setItem("indice", indice);
                localStorage.setItem("paleta", JSON.stringify(paleta[indice]));

                $(".index").fadeIn("fast");
                $(".register-page").fadeOut("fast");
                $(".paletas-guardadas-page").fadeOut("fast");

                window.location.href = "index.html#paleta-container";
            } else if (result.isDenied) {
                let paleta = JSON.parse(localStorage.getItem("paletas-guardadas"));
                let indice = $(this).index();

                paleta.splice(indice, 1);
                localStorage.setItem("paletas-guardadas", JSON.stringify(paleta));

                $(this).remove();
            }
        });
    });
} else {
    $(".texto-guardadas").fadeIn("fast");
}
