// 1. Simulación de Petición Asíncrona

function fakeRequest(data) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 1000);
    });
}

// 2. Funciones de Utilidad (DOM y Lógica)

// Función para inyectar errores en el DOM
function mostrarError(idElemento, mensaje) {
    const elemento = document.querySelector("#" + idElemento);
    elemento.textContent = mensaje;
}

// Esta función se encarga de vaciar todos los contenedores de texto (span y div)
// antes de que el código evalúe las validaciones de un nuevo intento de registro o login.
function limpiarErrores() {
    document.querySelector("#error-nombre").textContent = "";
    document.querySelector("#error-email").textContent = "";
    document.querySelector("#error-password").textContent = "";
    document.querySelector("#error-confirmacion").textContent = "";
    document.querySelector("#error-fecha").textContent = "";
    document.querySelector("#error-terminos").textContent = "";
    document.querySelector("#estado-registro").textContent = "";

    document.querySelector("#error-login-email").textContent = "";
    document.querySelector("#error-login-password").textContent = "";
    document.querySelector("#estado-login").textContent = "";
}

// Calcula la edad en base a la fecha de nacimiento ingresada
function calcularEdad(fechaString) {
    const hoy = new Date();
    const fechaNac = new Date(fechaString);
    
    // 1. Calculamos la edad "cruda" restando solo los años.
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    
    // 2. Calculamos la diferencia de meses para saber si ya cumplió años este año.
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    // Si el mes es menor a 0 (aún no llegó su mes de cumpleaños), 
    // O si estamos en el mismo mes (mes === 0) pero el día actual es menor al día de su cumpleaños,
    // significa que todavía no cumple este año, así que le restamos 1 a la edad cruda.
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--; // Equivalente a: edad = edad - 1;
    }
    return edad;
}

// 3. Lógica de Registro

// Capturamos el formulario de registro completo usando su ID
const formRegistro = document.querySelector("#form-registro");

// Escuchamos el evento 'submit' (cuando el usuario hace clic en el botón tipo submit).
// Usamos 'async' para poder usar 'await' más abajo al simular la respuesta del servidor.
formRegistro.addEventListener("submit", async function(evento) {
    
    // Evita que la página recargue, comportamiento por defecto de los formularios en HTML.
    evento.preventDefault();
    
    // Llamamos a nuestra función de utilidad para limpiar mensajes viejos.
    limpiarErrores();

    // Capturamos los valores actuales que el usuario escribió en los inputs.
    const nombre = document.querySelector("#reg-nombre").value;
    const email = document.querySelector("#reg-email").value;
    const password = document.querySelector("#reg-password").value;
    const confirmacion = document.querySelector("#reg-confirmacion").value;
    const fecha = document.querySelector("#reg-fecha").value;
    // Para el checkbox usamos .checked en lugar de .value porque nos interesa saber si está tildado (true o false).
    const terminos = document.querySelector("#reg-terminos").checked; 

    // Variable bandera que nos avisará si alguna validación falló.
    let hayErrores = false;

    // --- BLOQUE DE VALIDACIONES ---

    // Validación: Campos obligatorios
    if (nombre === "") {
        mostrarError("error-nombre", "El nombre es obligatorio.");
        hayErrores = true;
    }

    // Validación: Formato de Email (básico, comprobando que tenga '@' y '.')
    if (email === "") {
        mostrarError("error-email", "El email es obligatorio.");
        hayErrores = true;
    } else if (!email.includes("@") || !email.includes(".")) {
        mostrarError("error-email", "El formato del email no es válido.");
        hayErrores = true;
    }

    // Validación manual de la contraseña (Mínimo 8 caracteres y al menos 1 número).
    let tieneNumero = false;
    for (let i = 0; i < password.length; i++) {
        // isNaN (is Not a Number) devuelve false si el caracter SÍ es un número.
        if (!isNaN(password[i])) {
            tieneNumero = true;
        }
    }

    if (password.length < 8 || !tieneNumero) {
        mostrarError("error-password", "Debe tener al menos 8 caracteres e incluir un número.");
        hayErrores = true;
    }

    // Validación: Coincidencia de contraseñas
    if (password !== confirmacion || confirmacion === "") {
        mostrarError("error-confirmacion", "Las contraseñas no coinciden.");
        hayErrores = true;
    }

    // Validación: Mayor de 18 años llamando a nuestra función auxiliar
    if (fecha === "") {
        mostrarError("error-fecha", "La fecha de nacimiento es obligatoria.");
        hayErrores = true;
    } else {
        const edad = calcularEdad(fecha);
        if (edad < 18) {
            mostrarError("error-fecha", "Debes ser mayor de 18 años para registrarte.");
            hayErrores = true;
        }
    }

    // Validación: Términos y condiciones
    if (terminos === false) {
        mostrarError("error-terminos", "Debes aceptar los términos y condiciones.");
        hayErrores = true;
    }

    // Si encontramos al menos un error (la bandera es true), cortamos la ejecución de la función con 'return'.
    // Esto asegura que NUNCA se guarde un usuario con datos inválidos.
    if (hayErrores === true) {
        return;
    }

    // --- Inicia el proceso de Guardado y Asincronía ---
    
    // Mostramos el mensaje temporal "Cargando..." para el usuario.
    const estadoMensaje = document.querySelector("#estado-registro");
    estadoMensaje.textContent = "Cargando...";
    estadoMensaje.style.color = "white"; 

    // Pausamos la ejecución simulando que enviamos los datos a un servidor.
    await fakeRequest();

    // TRAER DATOS DE LOCALSTORAGE:
    // localStorage.getItem devuelve siempre un String.
    let usuariosString = localStorage.getItem("usuarios");
    let usuarios = [];
    
    // Si usuariosString NO es nulo (es decir, ya hay datos guardados previamente), 
    // lo convertimos de vuelta a un Array de objetos usando JSON.parse.
    if (usuariosString !== null) {
        usuarios = JSON.parse(usuariosString);
    }

    // Recorremos el Array para ver si el email ingresado ya existe.
    let emailDuplicado = false;
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].email === email) {
            emailDuplicado = true;
        }
    }

    if (emailDuplicado === true) {
        // Mostramos el error final y cortamos el proceso.
        estadoMensaje.textContent = "Error: El email ingresado ya se encuentra registrado.";
        estadoMensaje.style.color = "#ff4c4c"; 
    } else {
        // Si todo está perfecto y no es duplicado, creamos un objeto 'nuevoUsuario'.
        const nuevoUsuario = {
            nombre: nombre,
            email: email,
            password: password,
            fecha: fecha
        };

        // Lo agregamos a nuestro Array de usuarios.
        usuarios.push(nuevoUsuario);
        
        // Guardamos el Array actualizado en localStorage. 
        // Convertimos el Array a String usando JSON.stringify.
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        estadoMensaje.textContent = "¡Registro exitoso! Ya puedes iniciar sesión.";
        estadoMensaje.style.color = "#4CAF50"; 
        
        // Limpiamos visualmente los inputs dejando el formulario listo para otro registro.
        document.querySelector("#reg-nombre").value = "";
        document.querySelector("#reg-email").value = "";
        document.querySelector("#reg-password").value = "";
        document.querySelector("#reg-confirmacion").value = "";
        document.querySelector("#reg-fecha").value = "";
        document.querySelector("#reg-terminos").checked = false;
    }
});

// 4. Lógica de Login (Autenticación)

const formLogin = document.querySelector("#form-login");

formLogin.addEventListener("submit", async function(evento) {
     
    // Evita que la página recargue, comportamiento por defecto de los formularios en HTML.
    evento.preventDefault();
    
    // Llamamos a nuestra función de utilidad para limpiar mensajes viejos.
    limpiarErrores()

    // Capturamos las credenciales ingresadas.
    const emailLogin = document.querySelector("#login-email").value;
    const passwordLogin = document.querySelector("#login-password").value;
    
    let hayErrores = false;

    // Validación básica: Solo verificamos que no estén vacíos.
    // No hace falta validar el formato de email o la seguridad de la contraseña acá, 
    // porque si el formato estuviera mal, simplemente no coincidiría con la base de datos.
    if (emailLogin === "") {
        mostrarError("error-login-email", "Ingresa tu email.");
        hayErrores = true;
    }
    
    if (passwordLogin === "") {
        mostrarError("error-login-password", "Ingresa tu contraseña.");
        hayErrores = true;
    }

    // Si faltan datos, cortamos el proceso.
    if (hayErrores === true) {
        return;
    }

    const estadoLogin = document.querySelector("#estado-login");
    estadoLogin.textContent = "Cargando...";
    estadoLogin.style.color = "white";

    // Pausamos la ejecución simulando la comunicación con el backend.
    await fakeRequest();

    // Extraemos nuestra "Base de datos". 
    // Usamos JSON.parse para convertir el texto plano guardado en un Array manejable.
    let usuariosString = localStorage.getItem("usuarios");
    let usuarios = [];
    if (usuariosString !== null) {
        usuarios = JSON.parse(usuariosString);
    }

    // --- PROCESO DE AUTENTICACIÓN ---
    let accesoConcedido = false; // Bandera para saber si encontramos al usuario
    
    // Recorremos todo el array buscando el usuario.
    for (let i = 0; i < usuarios.length; i++) {
        // Exigimos coincidencia EXACTA en ambos campos.
        if (usuarios[i].email === emailLogin && usuarios[i].password === passwordLogin) {
            accesoConcedido = true;
        }
    }

    // Mostramos el resultado final manipulando el DOM.
    if (accesoConcedido === true) {
        estadoLogin.textContent = "Acceso correcto. ¡Bienvenido!";
        estadoLogin.style.color = "#4CAF50"; 
    } else {
        // Por seguridad, usamos un mensaje genérico. 
        // No le decimos al usuario si falló el email o la contraseña, así evitamos 
        // dar pistas a alguien que esté intentando adivinar cuentas (enumeración de usuarios).
        estadoLogin.textContent = "Credenciales incorrectas o usuario inexistente.";
        estadoLogin.style.color = "#ff4c4c"; 
    }
});