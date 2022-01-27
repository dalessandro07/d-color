/* DRAG AND DROP CREAR PALETA DE COLORES INDEX */

/* DEFINIR UNA LISTA O CONTENEDOR */

let lista = document.querySelector(".contenedor-colores");

/* CREAR EL DRAG AND DROP CON SORTABLE.CREATE */

Sortable.create(lista, {
    /* AGREGAR ANIMACION */
    animation: 150,
    /* ESTABLECER NOMBRE DE CLASE AL SELECCIONAR */
    chosenClass: "seleccionado",
    /* ESTILO DEL FANTASMA */
    ghostClass: "fantasma",
    /* ESTILO AL HACER DRAG */
    dragClass: "drag",
    /* HANDLE */
    handle: ".fa-arrows-alt-h",
    /* ELEMENTOS IGNORADOS */
    filter: ".color-hex",
    /* CUANDO SE SUELTA */
    onEnd: () => {
        arrayPaletaColores = [];

        let coloresHex = $(".contenedor-colores").children().find(".color-hex").text();
        let coloresPaleta = coloresHex.match(/.{1,7}/g);

        for (let i = 0; i < coloresPaleta.length; i++) {
            let paletaObj = { id: i, color: coloresPaleta[i] };
            arrayPaletaColores.push(paletaObj);
        }

        guardarLocalStorage(arrayPaletaColores);
    },
    /* DAR NOMBRE A LA LISTA */
    group: "lista-colores",
});
