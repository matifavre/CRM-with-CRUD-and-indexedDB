function conectarDB(){
    // Window.indexedDB crea una DB y si ya existe se conecta
    const abrirConexion = window.indexedDB.open('crm',1);
    abrirConexion.error = function(){
        console.log('Error')
    };
    abrirConexion.onsuccess = function(){
        DB = abrirConexion.result; 
    }
}
function imprimirAlerta(mensaje,tipo){
    // If para evitar la acumulacion del mensaje
    const alerta = document.querySelector('.alerta');
    if(!alerta){
           // crear alerta
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center','border','alerta');
    if(tipo === 'error'){
        divMensaje.classList.add('bg-red-100','border-red-400','text-red-700');
    }else{
        divMensaje.classList.add('bg-green-100','border-green-400','text-green-700');
    }
    divMensaje.textContent = mensaje; // Imprime la alerta
    formulario.appendChild(divMensaje); // Agregar formulario para agregar al DOM (divMensaje)
    setTimeout(()=>{
            divMensaje.remove();
        },3000);
    }

}