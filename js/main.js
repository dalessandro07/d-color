/* VARIABLES GLOBALES */

let contenedorColorDefault = $(".contenedor-color");
let paletasGuardadas = [];
let arrayPaletaColores = [];
let idCount = 0;

/* INICIANDO FUNCIONES */

$(".nueva-paleta").click(function () {
    $(".index").fadeIn("fast");
    $(".contenedor-paleta").fadeIn("fast");
    $(".register-page").fadeOut("fast");
    $(".paletas-guardadas-page").fadeOut("fast");

    window.location.href = "#paleta-container";
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

/* MOSTRAR PALETAS RECARGADAS */

/* FUNCION REGARGAR PALETAS */

function recargarPaletas() {
    if (parseInt(localStorage.getItem("recargado")) === 1) {
        $(".index").fadeOut("fast");
        $(".contenedor-paleta").fadeOut("fast");
        $(".register-page").fadeOut("fast");
        $(".paletas-guardadas-page").fadeIn("fast");
    } else {
        $(".index").fadeIn("fast");
        $(".register-page").fadeOut("fast");
        $(".paletas-guardadas-page").fadeOut("fast");
    }

    localStorage.setItem("recargado", 0);
}

recargarPaletas();

/* CAMBIANDO COLOR DE TEXTO POR EL FONDO DINAMICAMENTE */

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

/* FUNCION ASIGNANDO NOMBRES A LOS COLORES */

function asignarNombre(paleta) {
    for (const color of paleta) {
        let contenedorColor = $(".contenedor-colores").children();
        let colorName = contenedorColor.find(".color-name");

        /* GET THE COLOR API */

        let url = `https://www.thecolorapi.com/id?hex=${color.color.slice(1)}`;

        $.get(url, function (data, textStatus, err) {
            if (textStatus == "success") {
                color.name = data.name.value;
                $(colorName[color.id]).text(color.name);
                detectaColor(color.color, $(colorName[color.id]), $(colorName[color.id]));
            } else {
                console.log(err);
            }
        });
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
        }

        localStorage.setItem("paleta", JSON.stringify(paleta));
    }
}

function respaldarLocalStorage() {
    if (localStorage.getItem("paleta")) {
        let paleta = JSON.parse(localStorage.getItem("paleta"));

        if (paleta.hora) {
            if (localStorage.getItem("paletas-guardadas")) {
                paletasGuardadas = JSON.parse(localStorage.getItem("paletas-guardadas"));
            }

            $(".contenedor-colores").children().remove();

            for (const color of paleta.paleta) {
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

            asignarNombre(paleta.paleta);
        } else {
            if (localStorage.getItem("paletas-guardadas")) {
                paletasGuardadas = JSON.parse(localStorage.getItem("paletas-guardadas"));
            }

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

            asignarNombre(paleta);
        }
    } else {
        asignarNombre([{ id: 0, color: "#FFFFFF" }]);
    }
}

respaldarLocalStorage();

/* OBTENIENDO HORA DE GUARDADO DE PALETA */

function obtenerHora() {
    let fecha = new Date().toLocaleDateString();
    let hora = new Date().getHours();
    let minutos = new Date().getMinutes();
    let segundos = new Date().getSeconds();

    if (minutos < 10) {
        minutos = "0" + minutos;
    } else if (segundos < 10) {
        segundos = "0" + segundos;
    }

    let horaActual = `${fecha} | ${hora}:${minutos}:${segundos}`;

    return horaActual;
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
    asignarNombre(arrayPaletaColores);
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

        /* ASIGNAR NOMBRES AL COLOR */

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

    /* FOOTER */

    for (let color of paleta) {
        $(".icono-footer").css("color", color.color);
    }

    asignarNombre(paleta);
    guardarLocalStorage(paleta);
});

/* BORRAR/LIMPIAR PALETA */

$(".fa-trash-alt").on("click", function () {
    Swal.fire({
        title: "¿Quieres limpiar la paleta? Esta acción no se puede deshacer",
        showDenyButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        denyButtonText: `Limpiar`,
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isDenied) {
            contenedorColorDefault.find(".color-hex").text("#FFFFFF");
            contenedorColorDefault.find(".color-hex").css("color", "#000000");
            contenedorColorDefault.find(".opciones").css("color", "#000000");
            contenedorColorDefault.css("background-color", "#FFFFFF");
            $(".contenedor-colores").children().remove();
            $(".contenedor-colores").append(contenedorColorDefault.clone());

            localStorage.removeItem("paleta");

            asignarNombre([{ id: 0, color: "#FFFFFF" }]);
        }
    });
});

/* CREAR PALETA CON COLOR BASE */

$(".fa-fill").on("click", function () {
    Swal.fire({
        title: "Introduzca el color base",
        input: "text",
        inputAttributes: {
            autocapitalize: "off",
        },
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Crear Paleta",
        showLoaderOnConfirm: true,
        preConfirm: (color) => {
            return fetch(`https://www.thecolorapi.com/scheme?hex=${color.slice(1)}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                })
                .catch((error) => {
                    Swal.showValidationMessage(`Request failed: ${error}`);
                });
        },
        allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
        if (result.isConfirmed) {
            let esquema = result.value.colors;
            let paleta = [];
            let count = 0;

            if (esquema !== undefined) {
                for (let color of esquema) {
                    paleta.push({ id: count++, color: color.hex.value });
                }

                guardarLocalStorage(paleta);
                respaldarLocalStorage();

                Swal.fire({
                    title: `¡Paleta Creada!`,
                    imageUrl: result.value.image.named,
                });
            }
        }
    });
});

/* GUARDAR PALETA */

/* FUNCIONES Y EVENTOS DE GUARDAR PALETA */

$(".fa-save").on("click", function () {
    let paleta = JSON.parse(localStorage.getItem("paleta"));

    if (localStorage.getItem("paleta")) {
        if (localStorage.getItem("email") && localStorage.getItem("password") && localStorage.getItem("check")) {
            if (paletasGuardadas.length <= 30) {
                if (localStorage.getItem("indice")) {
                    paletasGuardadas[localStorage.getItem("indice")] = { paleta: paleta, hora: obtenerHora() };
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

                    localStorage.removeItem("indice");
                } else {
                    let comprobar = paletasGuardadas.find((col) => col.paleta[0].color === paleta[0].color);

                    if (comprobar === undefined) {
                        paletasGuardadas.push({ paleta: paleta, hora: obtenerHora() });

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
                $(".contenedor-paleta").fadeOut("fast");
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

        /* CAMBIAR NOMBRE DE COLOR */

        let paleta = JSON.parse(localStorage.getItem("paleta"));

        if (paleta.hora) {
            asignarNombre(paleta.paleta);
        } else {
            asignarNombre(paleta);
        }
    });
});

$(".contenedor-colores").on("click", ".opciones", function () {
    $(this).parents(".contenedor-color").find(".contenedor-hex").children("input").fadeOut("fast");
    $(this).parents(".contenedor-color").find(".contenedor-hex").children(".color-hex").fadeIn("fast");
});

/* FUNCIONES MENORES INDIVIDUALES */

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

        let paleta = JSON.parse(localStorage.getItem("paleta"));
        if (paleta.hora) {
            asignarNombre(paleta.paleta);
        } else {
            asignarNombre(paleta);
        }
    } else {
        let paleta = [{ id: contenedorColor.attr("data-id"), color: colorHex.text() }];
        asignarNombre(paleta);
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
        contenedorColor.addClass("animate__animated animate__hinge");
        contenedorColor.fadeOut(1800, function () {
            contenedorColor.remove();
        });
        let idThis = contenedoresTotales.index(contenedorColor);
        eliminarLocalStorage(idThis);
    } else {
        contenedorColor.css("background-color", "#FFFFFF");
        colorHex.css("color", "#000000");
        iconos.css("color", "#000000");
        colorHex.text("#FFFFFF");

        if (localStorage.getItem("paleta")) {
            let paleta = JSON.parse(localStorage.getItem("paleta"));
            paleta[0].color = "#FFFFFF";
            localStorage.setItem("paleta", JSON.stringify(paleta));
            asignarNombre([{ id: 0, color: "#FFFFFF" }]);
        } else {
            asignarNombre([{ id: 0, color: "#FFFFFF" }]);
        }
    }
});

/* COMBINAR COLORES */

$(".contenedor-colores").on("click", ".fa-blender", function () {
    /* VARIABLES */

    let coloresACombinar = [];

    let contenedorColor = $(this).parents(".contenedor-color");
    let iconos = contenedorColor.find(".opciones");

    let iconoCombinar = $(this);

    let mixing = contenedorColor.find(".mixing");
    let pencilEdit = contenedorColor.find(".fa-pencil-alt");

    /* MOSTRAR Y ESCONDER */

    $(this).toggleClass("clicked");

    if (!$(this).hasClass("clicked")) {
        /* EVENTOS */

        contenedorColor.find(".color-hex").fadeOut();
        mixing.fadeIn("fast");

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

                    iconoCombinar.addClass("clicked");

                    /* CAMBIAR LOCAL_STORAGE */

                    cambiarLocalStorage(contenedorColor, colorCombinado);

                    /* CAMBIAR NOMBRE DE COLOR */

                    let paleta = JSON.parse(localStorage.getItem("paleta"));

                    if (paleta.hora) {
                        asignarNombre(paleta.paleta);
                    } else {
                        asignarNombre(paleta);
                    }

                    /* DETECTAR COLOR */

                    detectaColor(colorCombinado, contenedorColor.find(".color-hex"), iconos);
                }
            }
        });

        pencilEdit.on("click", function () {
            mixing.removeAttr("disabled");
        });
    } else {
        contenedorColor.find(".color-hex").fadeIn();
        mixing.fadeOut("fast");
    }
});
