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
    /* CUANDO SE SUELTA */
    onEnd: () => {
        arrayPaletaColores = [];

        let coloresHex = $(".contenedor-colores").children().find(".color-hex").text();
        let coloresPaleta = coloresHex.match(/.{1,7}/g);

        for (let i = 0; i < coloresPaleta.length; i++) {
            let paletaObj = { id: i, color: coloresPaleta[i] };
            arrayPaletaColores.push(paletaObj);
        }

        console.log(arrayPaletaColores);

        guardarLocalStorage(arrayPaletaColores);
    },
    /* DAR NOMBRE A LA LISTA */
    group: "lista-colores",
    /* LOCAL_STORAGE */
    store: {
        /* SE GUARDA EL ORDEN DE LA LISTA */
        set: (sortable) => {
            const orden = sortable.toArray();
            localStorage.setItem(sortable.options.group.name, orden.join(","));
            console.log(orden);
        },
        /* OBTENEMOS EL ORDEN DE LA LISTA */
        get: (sortable) => {
            const orden = localStorage.getItem(sortable.options.group.name);
            return orden ? orden.split(",") : [];
        },
    },
});
