(function(){
    // si la DB se crea de forma exitosa, se asigna a DB
    let DB;
    const listadoClientes = document.querySelector('#listado-clientes');
    document.addEventListener("DOMContentLoaded", ()=>{
        crearDB();
        // Solo se va a ejecutar si existe DB crm
        if(window.indexedDB.open('crm',1)){
            obtenerClientes();
        }
        //Delegation 
        listadoClientes.addEventListener('click', eliminarRegistro);
    });

    // Adding eliminar al href - linea 69 (para realizar delegation)
    function eliminarRegistro(e){
        if(e.target.classList.contains('eliminar')){
            const idEliminar = Number(e.target.dataset.cliente); // dataset es la manera de acceder a los registros > HTML 5 + Number para convertir ID en numero
            const confirmar = confirm('Deseas elimiinr este cliente?')
            if(confirmar){
                const transaction = DB.transaction(['crm'],'readwrite') // comienza una nueva transaction
                const objectStore = transaction.objectStore('crm');
                objectStore.delete(idEliminar);
                
                transaction.oncomplete = function(){
                    console.log('Eliminado...')
                    //Traverse el DOM para eliminar registro
                    e.target.parentElement.parentElement.remove();
                };
                transaction.onerror = function(){
                    console.log('Hubo un error')
                }
            }
        }
    }

    // Crea la DB de IndexedDB - conexion
    function crearDB(){
        const crearDB = window.indexedDB.open('crm', 1);
        crearDB.onerror = function(){
            console.log('Error');
        };
        crearDB.onsuccess = function(){
        DB = crearDB.result;
        };
        crearDB.onupgradeneeded = function(e){
        const db = e.target.result;
        const objectStore = db.createObjectStore('crm', {keyPath: 'id', autoIncrement: true});
        objectStore.createIndex('nombre', 'nombre', {unique: false});
        objectStore.createIndex('email', 'email', {unique: true});
        objectStore.createIndex('telefono', 'telefono', {unique: false});
        objectStore.createIndex('empresa', 'empresa', {unique: false});
        objectStore.createIndex('id', 'id', {unique: true});
        }
    }
    function obtenerClientes(){
        // abrir conexion como primer paso
        const abrirConexion = window.indexedDB.open('crm',1);
        abrirConexion.onerror = function(){
        };
        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
            // acceder al objectStore
            const objectStore = DB.transaction('crm').objectStore('crm');
            // cursores
            objectStore.openCursor().onsuccess = function(e){
                // el cursor es el iterador
                const cursor = e.target.result;
                if(cursor){
                    // cursos va a leer primera posicion en la DB y luego ir al siguiente resultado
                    const {nombre, email,telefono,empresa, id} = cursor.value;
                    listadoClientes.innerHTML += ` 
                    <tr>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                        <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                        <p class="text-gray-700">${telefono}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                        <p class="text-gray-600">${empresa}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                        <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                        <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                    </td>
                </tr>
            `;
                // traer el siguiente resultado almacenado en la DB
                cursor.continue();
                }else{
                    console.log('No hay mas registros...');
                }
            }
        }
    }
})();
