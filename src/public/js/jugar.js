const total = 1008;
var respuesta = -1;
var puntaje = 0;

$(document).ready( async function () {

    puntaje = parseInt(document.getElementById("puntaje_bd").value)
    jugar()

})


async function jugar(){

    limpiar()

    var pokemones = await obtenerPokemones(arrayAleatorios(1,total));
    respuesta = obtenerAleatorio(0,3)

    document.getElementById("img_pokemon").src = pokemones[respuesta].foto
    console.log("respuesta: " + pokemones[respuesta].nombre)

    document.getElementById("opcion_1").innerText = pokemones[0].nombre
    document.getElementById("opcion_2").innerText = pokemones[1].nombre
    document.getElementById("opcion_3").innerText = pokemones[2].nombre
    document.getElementById("pokemon_pregunta").innerHTML = "<strong>¿Quién es este pokemón?</strong>"
}

function limpiar(){
    document.getElementById("img_pokemon").src = "/img/pokemon.gif"
    document.getElementById("pokemon_pregunta").innerHTML = `<strong><i class="fa fa-spinner fa-spin" style="color:gray"></i> Cargando</strong>`
    document.getElementById("opcion_1").innerText = "Opcion 1"
    document.getElementById("opcion_2").innerText = "Opcion 2"
    document.getElementById("opcion_3").innerText = "Opcion 3"
}

$(".opcion").on("click", async function(e) {
    const op = parseInt($(this).data("opcion"));
    var correcto = respuesta === op ? true: false;
    
    if(correcto){
        puntaje +=10
        await update_puntaje({"id": document.getElementById("_id").value})
    }

    $("#modalrespuesta").data("correcto", correcto).modal("show");
    document.getElementById("puntaje").innerHTML = `<strong>${puntaje} PUNTOS</strong>`;
});


async function update_puntaje(data){

    const response = await fetch("/update_puntaje", {
        method:"POST", 
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    response.ok ? true : false

}

$("#modalrespuesta").on("show.bs.modal", function (event){
    const modal = $(this);
    const titulo = modal.find('.modal-title')
    const body = modal.find('.modal-body')
    if(modal.data("correcto")){
        titulo.html("<strong>¡CORRECTO!<strong>")
        titulo.css('color', 'green')
        body.html(`<img src="/img/ganaste.gif" id="img_pokemon" class="img-fluid" style="width: 100%">`)
    }else{
        titulo.html("<strong>FALLASTE...<strong>")
        titulo.css('color', 'red')
        body.html(`<img src="/img/perdiste.gif" id="img_pokemon" class="img-fluid" style="width: 100%">`)
    }
})


$("#modalrespuesta").on("hide.bs.modal", function (event){

    const modal = $(this);
    if(modal.data("correcto")){
        jugar()
    }else{
        window.location.href = "/salir"
    }
});


async function obtenerPokemones(aleatorios) {
    var promesas = aleatorios.map(pos => peticion(pos));
    return await Promise.all(promesas)
}

async function peticion(aleatorio){

    let pokemon = {"foto":"", "nombre":""}

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${aleatorio}`);
    
    if (response.ok) {
        const data = await response.json();
        pokemon["foto"] = data.sprites.other["official-artwork"].front_default;
        pokemon["nombre"] = data.name;
    } else {
        console.error('Error en la solicitud:', response.statusText);
    }

    return pokemon;
}


function obtenerAleatorio(inicio,total){
    return Math.floor(Math.random() * total) + inicio;
}

function arrayAleatorios(inicio,total){
    return Array.from({ length: 3 }).map(() => obtenerAleatorio(inicio,total));
}