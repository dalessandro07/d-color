/* VARIABLES GLOBALES */

let contenedorColorDefault = $(".contenedor-color");
let arrayPaletaColores = [];

/* INICIANDO FUNCIONES */

$("#nueva-paleta").click(function () {
    $(".index").fadeIn("fast");
    $(".register-page").fadeOut("fast");
    $(".paletas-guardadas-page").fadeOut("fast");
});

/* SCROLL Y CLICK DERECHO */

$(window).scroll(function () {
    let scrollTop = $(window).scrollTop();

    if (scrollTop <= 10) {
        $(".blob").fadeIn("fast");
    } else {
        $(".blob").fadeOut("fast");
    }
});

document.oncontextmenu = function () {
    return false;
};

/* MOSTRAR PALETAS RECARGADAS */

/* FUNCION REGARGAR PALETAS */

function recargarPaletas() {
    if (parseInt(localStorage.getItem("recargado")) === 1) {
        $(".index").fadeOut("fast");
        $(".register-page").fadeOut("fast");
        $(".paletas-guardadas-page").fadeIn("fast");
    } else {
        $(".index").fadeIn("fast");
        $(".register-page").fadeOut("fast");
        $(".paletas-guardadas-page").fadeOut("fast");
    }

    localStorage.setItem("recargado", 0);
    localStorage.removeItem("indice");
}

recargarPaletas();

/* CAMBIANDO COLOR DE TEXTO POR EL FONDO DINÑAMICAMENTE */

function detectaColor(colorAComprobar, texto, iconos) {
    let comprobar = tinycolor(colorAComprobar).isLight();
    if (comprobar === false) {
        texto.css("color", "#ffffff");
        iconos.css("color", "#ffffff");
    } else {
        texto.css("color", "#000000");
        iconos.css("color", "#000000");
    }
}

/* AGREGANDO y RECUPERANDO DEL LOCAL_STORAGE */

function guardarLocalStorage(paleta) {
    localStorage.setItem("paleta", JSON.stringify(paleta));
}

function cambiarLocalStorage(contenedorColor, colorParam) {
    let paleta;

    if (localStorage.getItem("paleta")) {
        paleta = JSON.parse(localStorage.getItem("paleta"));
    }

    if ($(".contenedor-color").length === 1) {
        guardarLocalStorage([{ id: 0, color: colorParam.toUpperCase() }]);
    } else {
        let color = colorParam.toUpperCase();

        let idThis = $(".contenedor-color").index(contenedorColor);

        paleta[idThis].color = color;
        guardarLocalStorage(paleta);
    }
}

function eliminarLocalStorage(indice) {
    if (localStorage.getItem("paleta")) {
        let paleta = JSON.parse(localStorage.getItem("paleta"));
        let count = 0;

        paleta.splice(indice, 1);

        for (const color of paleta) {
            color.id = count++;
            console.log(color);
        }

        localStorage.setItem("paleta", JSON.stringify(paleta));
    }
}

if (localStorage.getItem("paleta")) {
    let paleta = JSON.parse(localStorage.getItem("paleta"));

    $(".contenedor-colores").children().remove();

    for (const color of paleta) {
        $(".contenedor-colores").append(contenedorColorDefault.clone());
        let contenedorColor = $(".contenedor-colores").children();

        let colorHex = contenedorColor.find(".color-hex");
        let iconos = contenedorColor.find(".opciones");

        $(contenedorColor[color.id]).css("background-color", color.color);
        $(colorHex[color.id]).text(color.color);

        detectaColor(color.color, $(colorHex[color.id]), $(iconos[color.id]));

        /* ASIGNANDO DATA-ID */

        $(".contenedor-color:last").attr("data-id", $(".contenedor-color:last").index());
    }
}

/* FUNCIONES MAYORES */

/* AGREGAR COLOR */

$(".fa-plus").on("click", function () {
    arrayPaletaColores = [];

    let contenedorColor = $(".contenedor-colores").children();

    if ($(".contenedor-colores").children().length <= 4) {
        $(".contenedor-colores").append(contenedorColor.last().clone());
    } else {
        return;
    }

    /* ASIGNANDO DATA-ID */

    $(".contenedor-color:last").attr("data-id", $(".contenedor-color:last").index());

    /* CREANDO OBJETO Y SUBIENDO AL LOCAL_STORAGE */

    let coloresHex = $(".contenedor-colores").children().find(".color-hex").text();
    let coloresPaleta = coloresHex.match(/.{1,7}/g);

    for (let i = 0; i < coloresPaleta.length; i++) {
        let paletaObj = { id: i, color: coloresPaleta[i] };
        arrayPaletaColores.push(paletaObj);
    }

    guardarLocalStorage(arrayPaletaColores);
});

/* CREAR PALETA AL AZAR */

$(".fa-palette").on("click", function () {
    /* CREAR PALETA CON 5 COLORES */

    let contenedorColor = $(".contenedor-colores").children().last();

    for (let i = $(".contenedor-color").length; i < 5; i++) {
        $(".contenedor-colores").append(contenedorColor.clone());
        /* ASIGNANDO DATA-ID */

        $(".contenedor-color:last").attr("data-id", $(".contenedor-color:last").index());
    }

    /* ASIGNAR COLORES AL AZAR A CADA ITEM DE LA PALETA */

    let contenedoresColor = $(this).parents(".contenedor-paleta").find(".contenedor-colores").find(".contenedor-color");
    let colorHex = contenedoresColor.find(".color-hex");

    for (let color of colorHex) {
        let colorRandom = tinycolor.random();
        let colorRandomHex = tinycolor(colorRandom).toHexString().toUpperCase();

        let contenedorColor = $(color).parents(".contenedor-color");
        let iconos = contenedorColor.find(".opciones");

        contenedorColor.css("background-color", colorRandomHex);
        $(color).text(colorRandomHex);

        detectaColor(colorRandomHex, $(color), $(iconos));
    }

    /* GUARDAR PALETA EN EL LOCAL_STORAGE */

    let paleta = [];
    let count = 0;

    for (let color of $(".contenedor-color").find(".color-hex")) {
        paleta.push({ id: count++, color: $(color).text() });
    }

    guardarLocalStorage(paleta);
});

/* BORRAR/LIMPIAR PALETA */

$(".fa-trash-alt").on("click", function () {
    contenedorColorDefault.find(".color-hex").text("#FFFFFF");
    contenedorColorDefault.find(".color-hex").css("color", "#000000");
    contenedorColorDefault.find(".opciones").css("color", "#000000");
    contenedorColorDefault.css("background-color", "#FFFFFF");
    $(".contenedor-colores").children().remove();
    $(".contenedor-colores").append(contenedorColorDefault.clone());

    localStorage.removeItem("paleta");
});

/* GUARDAR PALETA */

let paletasGuardadas = [];

/* RECUPERAR PALETA GUARDADA DEL LOCAL_STORAGE */

if (localStorage.getItem("paletas-guardadas")) {
    paletasGuardadas = JSON.parse(localStorage.getItem("paletas-guardadas"));
}

/* FUNCIONES Y EVENTOS DE GUARDAR PALETA */

$(".fa-save").on("click", function () {
    let paleta = JSON.parse(localStorage.getItem("paleta"));

    if (localStorage.getItem("paleta")) {
        if (localStorage.getItem("email") && localStorage.getItem("password") && localStorage.getItem("check")) {
            if (paletasGuardadas.length < 10) {
                if (localStorage.getItem("indice")) {
                    paletasGuardadas[localStorage.getItem("indice")] = paleta;
                    localStorage.setItem("paletas-guardadas", JSON.stringify(paletasGuardadas));

                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener("mouseenter", Swal.stopTimer);
                            toast.addEventListener("mouseleave", Swal.resumeTimer);
                        },
                    });
                    Toast.fire({
                        icon: "success",
                        title: "Paleta editada con éxito!",
                    });
                } else {
                    let comprobar = paletasGuardadas.find((col) => col[0].color === paleta[0].color);

                    if (comprobar === undefined) {
                        paletasGuardadas.push(paleta);
                        localStorage.setItem("paletas-guardadas", JSON.stringify(paletasGuardadas));

                        const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 1500,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener("mouseenter", Swal.stopTimer);
                                toast.addEventListener("mouseleave", Swal.resumeTimer);
                            },
                        });
                        Toast.fire({
                            icon: "success",
                            title: "¡Paleta guardada con éxito!",
                        });
                    } else {
                        const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 1500,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener("mouseenter", Swal.stopTimer);
                                toast.addEventListener("mouseleave", Swal.resumeTimer);
                            },
                        });
                        Toast.fire({
                            icon: "error",
                            title: "¡No puedes guardar la misma paleta 2 veces!",
                        });
                    }
                }
            } else {
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener("mouseenter", Swal.stopTimer);
                        toast.addEventListener("mouseleave", Swal.resumeTimer);
                    },
                });
                Toast.fire({
                    icon: "error",
                    title: "¡Sólo puedes guardar 10 paletas!",
                });
            }
        } else {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener("mouseenter", Swal.stopTimer);
                    toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
            });
            Toast.fire({
                icon: "error",
                title: "¡Regístrate para guardar paletas!",
            });
            setTimeout(() => {
                $(".index").fadeOut("fast");
                $(".register-page").fadeIn("fast");
                $(".paletas-guardadas-page").fadeOut("fast");
            }, 2000);
        }
    } else {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
        });
        Toast.fire({
            icon: "info",
            title: "¡Empieza a crear una hermosa paleta!",
        });
    }
});

/* FUNCIONES INDIVIDUALES */

/* CAMBIAR COLOR */

$(".contenedor-colores").on("click", ".color-hex", function () {
    /* ESCOGER LOS ELEMENTOS DE CADA CONTENEDOR DE COLOR */

    let contenedorColor = $(this).parents(".contenedor-color");
    let picker = $(contenedorColor).find(".picker");
    let colorHex = $(this);
    let iconos = contenedorColor.find(".opciones");

    // OCULTAR H4 Y MOSTRAR INPUT

    colorHex.fadeOut("fast");
    picker.fadeIn("fast");

    // OBTENER Y MOSTRAR COLOR

    picker.on("input", function () {
        contenedorColor.css("background-color", $(this).val());
        colorHex.text($(this).val().toUpperCase());
        /* CAMBIAR TEXTO DETECTANDO COLOR */
        detectaColor(colorHex.text(), colorHex, iconos);
    });

    picker.on("change", function () {
        if (!$(this).val() === "#000000") {
            colorHex.fadeIn("fast");
            picker.fadeOut("fast");
        } else {
            colorHex.fadeIn("fast");
            picker.fadeOut("fast");
        }

        /* ENCONTRAR EN EL LOCAL_STORAGE */

        cambiarLocalStorage(contenedorColor, picker.val());
    });
});

/* FUNCIONES MENORES INDIVIDUALES */

$(".contenedor-color").on("click", ".opciones", function () {
    let colorHex = $(this).parents(".contenedor-color").find(".color-hex");
    let inputs = $(this).parents(".contenedor-color").find("input");

    colorHex.fadeIn("fast");
    inputs.fadeOut("fast");
});

/* COPIAR COLOR */

$(".contenedor-colores").on("click", ".fa-clone", function () {
    let contenedorColor = $(this).parents(".contenedor-color");
    let colorHex = contenedorColor.find(".color-hex");

    let texto = colorHex.text();

    navigator.clipboard.writeText(texto);

    colorHex.addClass("animate__animated animate__headShake");
    colorHex.text("¡Copiado!");

    colorHex.on("animationend", function () {
        $(this).parents(".contenedor-color").find(".color-hex").removeClass("animate__animated animate__headShake");
        colorHex.text(texto);
    });
});

/* CAMBIAR A UN COLOR RANDOM */

$(".contenedor-colores").on("click", ".fa-dice", function () {
    /* CREAR COLOR RANDOM */

    let colorRandom = tinycolor.random();
    let colorRandomHex = tinycolor(colorRandom).toHexString().toUpperCase();

    /* MOSTRAR COLOR EN PALETA */

    let contenedorColor = $(this).parents(".contenedor-color");
    let colorHex = contenedorColor.find(".color-hex");
    let iconos = contenedorColor.find(".opciones");

    colorHex.text(colorRandomHex);
    contenedorColor.css("background-color", colorRandomHex);

    /* OCULTANDO INPUTS */

    let inputs = contenedorColor.find("input");
    inputs.fadeOut("fast");
    colorHex.fadeIn("fast");

    /* AGREGANDO AL LOCAL_STORAGE */

    if (localStorage.getItem("paleta")) {
        cambiarLocalStorage(contenedorColor, colorRandomHex);
    }

    /* CAMBIAR TEXTO DETECTANDO COLOR */
    detectaColor(colorHex.text(), colorHex, iconos);
});

/* ELIMINAR COLOR */

$(".contenedor-colores").on("click", ".fa-times", function () {
    let contenedorColor = $(this).parents(".contenedor-color");
    let colorHex = contenedorColor.find(".color-hex");
    let iconos = contenedorColor.find(".opciones");
    let contenedoresTotales = $(".contenedor-colores").find(".contenedor-color");

    if (contenedoresTotales.length > 1) {
        contenedorColor.remove();
    } else {
        contenedorColor.css("background-color", "#FFFFFF");
        colorHex.css("color", "#000000");
        iconos.css("color", "#000000");
        colorHex.text("#FFFFFF");
    }

    let idThis = contenedoresTotales.index(contenedorColor);
    eliminarLocalStorage(idThis);
});

/* COMBINAR COLORES */

$(".contenedor-colores").on("click", ".fa-blender", function () {
    /* VARIABLES */

    let coloresACombinar = [];

    let contenedorColor = $(this).parents(".contenedor-color");
    let iconos = contenedorColor.find(".opciones");

    let mixing = contenedorColor.find(".mixing");
    let pencilEdit = contenedorColor.find(".fa-pencil-alt");

    /* MOSTRAR Y ESCONDER */

    contenedorColor.find(".color-hex").fadeOut();
    mixing.fadeIn("fast");

    /* EVENTOS */

    /* CAPTURAR DATOS Y EDITARLOS */

    mixing.on("input", function () {
        if ($(this).val().length === 7) {
            let colorNuevo = tinycolor($(this).val());
            let esValido = colorNuevo.isValid();

            if (esValido) {
                coloresACombinar.push($(this).val().toUpperCase());
            } else return;

            $(this).attr("disabled", "disabled");
            pencilEdit.fadeIn("fast");

            /* COMBINAR COLORES */

            if (coloresACombinar.length === 2) {
                let colorCombinado = tinycolor
                    .mix(coloresACombinar[0], coloresACombinar[1], (amount = 50))
                    .toHexString()
                    .toUpperCase();

                contenedorColor.css("background-color", colorCombinado);
                contenedorColor.find(".color-hex").text(colorCombinado);
                contenedorColor.find(".color-hex").fadeIn();

                mixing.fadeOut("fast");
                mixing.val("");
                mixing.removeAttr("disabled");
                pencilEdit.fadeOut("fast");

                detectaColor(colorCombinado, contenedorColor.find(".color-hex"), iconos);

                /* CAMBIAR LOCAL_STORAGE */

                cambiarLocalStorage(contenedorColor, colorCombinado);
            }
        }
    });

    pencilEdit.on("click", function () {
        mixing.removeAttr("disabled");
    });
});
