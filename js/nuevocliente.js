// Declarar variables de forma local - IIFE
(function(){
    let DB;
    const formulario = document.querySelector('#formulario');
    document.addEventListener('DOMContentLoaded', () =>{
        // conectar a la DB
        conectarDB();
        formulario.addEventListener('submit',validarCliente);
    });

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

    function validarCliente(e){
    e.preventDefault();
    // Leer todos los inputs
    const nombre = document.querySelector('#nombre').value;
    const email = document.querySelector('#email').value;
    const telefono = document.querySelector('#telefono').value;
    const empresa = document.querySelector('#empresa').value;

    if(nombre === '' || email === '' || telefono === '' || empresa === ''){
        imprimirAlerta('Todos los campos son obligatorios','error');
            return;
        }
        // crear un Obj con la información -- object literal enhancement
        const cliente = {
            nombre,
            email,
            telefono,
            empresa, 
        }
        cliente.id = Date.now();
        crearNuevoCliente(cliente);
    }

    // pasar el object literal enhancement como solo parametro
    function crearNuevoCliente(cliente){

            const transaction = DB.transaction(['crm'],'readwrite');
            const objectStore = transaction.objectStore('crm');

        // agregar nuevo registro de cliente
        objectStore.add(cliente);
        // Mensaje de error
        transaction.onerror = function(){
            imprimirAlerta('Hubo un error','error');
        };
        // Mensaje de Exito
        transaction.oncomplete = function(){
            imprimirAlerta('Cliente agregado exitosamente');
            // despues de 3 segundos > lleva a indexHTML (donde los clientes se almacenan)
            setTimeout(()=>{
            window.location.href= 'index.html';
            },3000);
        }
    }
})();