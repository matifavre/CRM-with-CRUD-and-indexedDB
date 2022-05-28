(function(){
let DB;
let idCliente;

const nombreInput = document.querySelector('#nombre');
const emailInput = document.querySelector('#email');
const telefonoInput = document.querySelector('#telefono');
const empresaInput = document.querySelector('#empresa');
const formulario = document.querySelector('#formulario');



    document.addEventListener('DOMContentLoaded', ()=>{
        conectarDB();
        //actualizar el registro (Formulaio)
        formulario.addEventListener('submit',actualizarCliente); // Escucha por el submit
        // Leer parametros de URL + verificar ID de URL
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');
        if(idCliente){
            //Async programacion
            setTimeout(()=>{
                obtenerCliente(idCliente);
            },100);
        }
    });
    function actualizarCliente(e){
        e.preventDefault();
        // Validar Cliente
        if(nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }
        // Actualizar cliente (una vez que la validacion termine)
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente) // Number ya que el ID en consola se almacena como String en vez de numero, por eso hay que convertirlo
        }
        const transaction = DB.transaction(['crm'],'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.put(clienteActualizado); // Encontrar ID + actualizar
        transaction.oncomplete = function(){
            imprimirAlerta('Editado correctamente');
            setTimeout(()=>{
                window.location.href = 'index.html';
            },3000);
        }
        transaction.onerror = function(){
            imprimirAlerta('Hubo un error', 'error')
        }
    }
    function obtenerCliente(id){
        // Abrir conexion para obtener Cliente + objectStore para interactuar con la BD
        const transaction = DB.transaction(['crm'],'readwrite'); // tambien podria ser readonly (solo es fetch un registro)
        const objectStore = transaction.objectStore('crm');
        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e){
            const cursor = e.target.result;
            if(cursor){
                // Dado que indexedDB es limitado, no existe un Where > Por eso hay que anidar otro IF
                // Va a tomar el cursor (id + editarCliente) > tomar referencia y llenar el form para editar
                if(cursor.value.id === Number(id)){
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
    }
    function llenarFormulario(datosCliente){
        const {nombre,email,telefono,empresa} = datosCliente;
        nombreInput.value = nombre; // llama al nombre que se extrae con Destructuring
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }
    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm',1);
        abrirConexion.error = function(){
            console.log('Error')
        };
        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result; 
        }
    }
})();