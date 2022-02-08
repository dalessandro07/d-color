/* MOSTRAR PALETAS GUARDADAS */

$(".paletas-guardadas-link").click(function () {
    $(".index").fadeOut("fast");
    $(".contenedor-paleta").fadeOut("fast");
    $(".register-page").fadeOut("fast");
    $(".paletas-guardadas-page").fadeIn("fast");
});

$(".actualizarPaletas").on("click", function () {
    localStorage.setItem("recargado", 1);
    localStorage.removeItem("indice");
    window.location.reload();
});

$(".texto-guardadas").on("click", function () {
    $(".index").fadeIn("fast");
    $(".register-page").fadeOut("fast");
    $(".paletas-guardadas-page").fadeOut("fast");
    window.location.href = "#paleta-container";
});

/* CAPTURAR DATOS DEL LOCAL_STORAGE */

if (localStorage.getItem("paletas-guardadas")) {
    $(".texto-guardadas").fadeOut("fast");

    let paletasGuardadas = JSON.parse(localStorage.getItem("paletas-guardadas"));

    let count = 0;
    let count2 = 1;

    /* MOSTRAR PALETAS EN EL DOM */

    for (let paleta of paletasGuardadas) {
        $(".paletas-guardadas").append(
            `<div class="d-flex flex-column contenedor-paleta-hora">
                <b class="text-center d-flex flex-column">Paleta N°${count2++}<em class="fecha-hora">${paleta.hora}</em></b>
                <div class="paleta-guardada paleta-${count++} d-flex">
                </div>
            </div>`
        );

        if (paleta.hora) {
            let paletaAIterar = paleta.paleta;

            for (const color of paletaAIterar) {
                if (paletaAIterar.length <= 5) {
                    $(".paleta-guardada:last").append(`<div class="paleta-color" style="background-color: ${color.color}"><div class="color-text">${color.color}</div></div>`);
                }
            }
        } else {
            for (const color of paleta) {
                if (paleta.length <= 5) {
                    $(".paleta-guardada:last").append(`<div class="paleta-color" style="background-color: ${color.color}"><div class="color-text">${color.color}</div></div>`);
                }
            }
        }
    }

    /* BORRAR PALETAS */

    $(".borrarPaletas").on("click", function () {
        Swal.fire({
            title: "¿Quieres eliminar todas las paletas? Esta acción no se puede deshacer",
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("paletas-guardadas");
                localStorage.setItem("recargado", 1);
                localStorage.removeItem("hora");
                window.location.reload();
            } else if (result.isDenied) {
                return;
            }
        });
    });

    /* EDITAR y ELIMINAR PALETA */

    $(".paletas-guardadas").on("click", ".paleta-guardada", function () {
        Swal.fire({
            title: "¿Quieres editar o eliminar la paleta? Esta acción no se puede deshacer",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Editar",
            denyButtonText: `Eliminar`,
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                let paleta = JSON.parse(localStorage.getItem("paletas-guardadas"));

                let indice = $(".paleta-guardada").index($(this));

                localStorage.setItem("indice", indice);
                localStorage.setItem("paleta", JSON.stringify(paleta[indice].paleta));

                $(".index").fadeIn("fast");
                $(".contenedor-paleta").fadeIn("fast");
                $(".register-page").fadeOut("fast");
                $(".paletas-guardadas-page").fadeOut("fast");

                respaldarLocalStorage();

                const Toast = Swal.mixin({
                    toast: true,
                    position: "center",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener("mouseenter", Swal.stopTimer);
                        toast.addEventListener("mouseleave", Swal.resumeTimer);
                    },
                });

                Toast.fire({
                    icon: "warning",
                    title: "¡No olvides guardar los cambios! 💾",
                });

                setTimeout(() => {
                    window.location.href = "#paleta-container";
                }, 900);
            } else if (result.isDenied) {
                let paleta = JSON.parse(localStorage.getItem("paletas-guardadas"));
                let indice = $(this).index(".paleta-guardada");

                paleta.splice(indice, 1);
                localStorage.setItem("paletas-guardadas", JSON.stringify(paleta));

                $(this).parents(".contenedor-paleta-hora").remove();

                if ($(".paleta-guardada").length === 0) {
                    $(".texto-guardadas").fadeIn("fast");
                } else {
                    $(".texto-guardadas").fadeOut("fast");
                }
            }
        });
    });

    /* CAMBIAR COLOR DINAMICAMENTE */

    for (let paleta of $(".paleta-guardada")) {
        for (let color of $(paleta).children()) {
            let colorHex = $(color).find(".color-text").text();
            detectaColor(colorHex, $(color).find(".color-text"), $(color).find(".color-text"));
        }
    }
} else {
    $(".texto-guardadas").fadeIn("fast");
}

if ($(".paleta-guardada").length === 0) {
    $(".texto-guardadas").fadeIn("fast");
} else {
    $(".texto-guardadas").fadeOut("fast");
}
