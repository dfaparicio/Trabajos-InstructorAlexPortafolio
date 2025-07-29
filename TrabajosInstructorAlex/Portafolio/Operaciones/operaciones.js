let borrador = document.getElementById("ValorUno")

document.getElementById("Borrar1").addEventListener("click", ()=>{
    
    borrador.value = "";

});

let borrador2 = document.getElementById("ValorDos")

document.getElementById("Borrar2").addEventListener("click", ()=>{
    
    borrador2.value = "";

});



    function Calcular(){
    const valor1 = parseFloat(document.getElementById("ValorUno").value) || 0;
    const valor2 = parseFloat(document.getElementById("ValorDos").value) || 0;

    const radio = document.querySelector('input[name="Grupo"]:checked');
    
    if(!radio){
        document.getElementById("ResultadoTodo").textContent = "Seleccione una opción";
        return;
    }

    const operacion = radio.value;
    let resultado;

    
    if (operacion === "Suma"){

        resultado = valor1 + valor2;
    }
    else if (operacion === "Resta"){
        resultado = valor1 - valor2;
    }
    else if (operacion === "Multiplicacion"){
        resultado = valor1 * valor2;
    }
    else if (operacion === "Division"){
        resultado = valor2 !== 0 ? valor1 / valor2 : "Error (división por 0)";
    }



    document.getElementById("ResultadoTodo").textContent = resultado;

}
