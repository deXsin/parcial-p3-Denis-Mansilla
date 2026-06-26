# Parcial Programación 3 - Módulo de Autenticación Frontend

**Autor:** Denis Gian Mansilla  
**Institución:** CENT 35 - Tecnicatura en Desarrollo de Software  
**Fecha:** Junio 2026  

---

## Descripción del proyecto

Este proyecto consiste en un módulo funcional de registro e inicio de sesión de usuarios desarrollado completamente del lado del cliente.

Fue realizado utilizando tecnologías frontend nativas: HTML, CSS y JavaScript. La interfaz utiliza Flexbox para organizar los formularios y cuenta con diseño responsive para adaptarse a pantallas más pequeñas.

El sistema permite registrar usuarios, validar sus datos, guardarlos en `localStorage` e iniciar sesión utilizando las credenciales registradas.

El proyecto implementa:

- Registro de usuarios con nombre, email, contraseña, confirmación de contraseña, fecha de nacimiento y aceptación de términos.
- Validaciones de campos obligatorios.
- Validación de formato de email.
- Validación de contraseña con mínimo 8 caracteres y al menos un número.
- Validación de coincidencia entre contraseña y confirmación.
- Validación de mayoría de edad.
- Validación de aceptación de términos y condiciones.
- Prevención de emails duplicados.
- Mensajes de error y éxito mostrados dinámicamente mediante manipulación del DOM.
- Uso de `preventDefault()` para evitar la recarga de la página.
- Simulación de una petición asíncrona mediante Promesas y `async/await`.
- Persistencia de usuarios utilizando `localStorage`.
- Conversión de datos mediante `JSON.stringify()` y `JSON.parse()`.

---

## Instrucciones para su ejecución

El proyecto fue diseñado para ejecutarse directamente desde el navegador.

No requiere instalación de dependencias, frameworks, backend ni servidor local.

1. Clonar el repositorio o descargar los archivos en formato `.zip`.
2. Extraer los archivos si se descargó el proyecto como `.zip`.
3. Abrir la carpeta del proyecto.
4. Hacer doble clic sobre el archivo `index.html`.
5. El sistema se abrirá en el navegador y estará listo para utilizarse.

Se recomienda utilizar navegadores modernos como Google Chrome, Mozilla Firefox, Microsoft Edge o Brave.

---

## Usuario de prueba
> Importante: el proyecto no incluye usuarios precargados.  
> Para probar el inicio de sesión, primero se debe registrar el siguiente usuario desde el formulario de Registro.

- **Nombre y apellido:** Profesor de Prueba
- **Email:** `profesor@cent35.edu.ar`
- **Contraseña:** `Aprobado2026`
- **Confirmación de contraseña:** `Aprobado2026`
- **Fecha de nacimiento:** `01/01/1980`
- **Términos y condiciones:** deben estar aceptados.

Luego de registrarlo correctamente, se puede utilizar el mismo email y contraseña en el formulario de Login.

---

## Persistencia de datos

Los usuarios se almacenan localmente en el navegador mediante `localStorage`.

La información se guarda bajo la clave:

```js
usuarios
```

Los datos se almacenan como un array de objetos convertido a formato JSON.

Ejemplo de usuario guardado:

```js
{
  nombre: "Profesor de Prueba",
  email: "profesor@cent35.edu.ar",
  password: "Aprobado2026",
  fecha: "1980-01-01"
}
```

Para guardar los usuarios se utiliza:

```js
localStorage.setItem("usuarios", JSON.stringify(usuarios));
```

Para recuperar los usuarios se utiliza:

```js
JSON.parse(localStorage.getItem("usuarios"));
```

---

## Flujo del proceso

### 1. Proceso de Registro

1. El usuario completa el formulario de registro y presiona el botón **“Registrar”**.
2. El sistema evita la recarga de la página mediante `preventDefault()` y limpia los mensajes previos mediante `limpiarErrores()`.
3. Se capturan los datos ingresados: nombre, email, contraseña, confirmación de contraseña, fecha de nacimiento y aceptación de términos.
4. Se validan todos los campos:
   - Campos obligatorios.
   - Formato válido de email.
   - Contraseña de mínimo 8 caracteres.
   - Contraseña con al menos un número.
   - Coincidencia entre contraseña y confirmación.
   - Usuario mayor de 18 años.
   - Aceptación de términos y condiciones.
5. Si existe algún error, el sistema lo muestra debajo del campo correspondiente utilizando la función `mostrarError()` y manipulación del DOM mediante `textContent`.
6. Si los datos son válidos, se muestra el mensaje **“Cargando...”**.
7. Se simula una petición asíncrona mediante `await fakeRequest()`.
8. El sistema recupera los usuarios almacenados mediante `localStorage.getItem()` y `JSON.parse()`.
9. Se verifica si el email ya se encuentra registrado.
10. Si el email ya existe, se muestra un mensaje de error indicando que el usuario ya está registrado.
11. Si el email no existe:
    - Se crea un objeto `nuevoUsuario`.
    - Se agrega el usuario al array mediante `usuarios.push()`.
    - Se guarda el array actualizado en `localStorage` utilizando `JSON.stringify()` y `localStorage.setItem()`.
12. Finalmente, se muestra el mensaje de registro exitoso y se limpian los campos del formulario.

![Diagrama de Flujo - Registro](./diagrama-registro.jpg)

---

### 2. Proceso de Login

1. El usuario ingresa su email y contraseña y presiona el botón **“Ingresar”**.
2. El sistema evita la recarga de la página mediante `preventDefault()` y limpia los mensajes previos mediante `limpiarErrores()`.
3. Se capturan los valores ingresados en los campos de email y contraseña.
4. Se valida que ambos campos estén completos.
5. Si falta algún dato, se muestra el error correspondiente utilizando `mostrarError()`.
6. Si los campos están completos, se muestra el mensaje **“Cargando...”**.
7. Se simula una petición asíncrona mediante `await fakeRequest()`.
8. El sistema obtiene los usuarios guardados en `localStorage`.
9. Los datos recuperados se convierten desde JSON a un array mediante `JSON.parse()`.
10. Se busca una coincidencia entre el email y la contraseña ingresados.
11. Si existe una coincidencia, se muestra el mensaje: “Acceso correcto. ¡Bienvenido!”.
12. Si no existe coincidencia, se muestra el mensaje: “Credenciales incorrectas o usuario inexistente.”.

![Diagrama de Flujo - Login](./diagrama-login.jpg)

---

## Funciones principales del proyecto

| Función / Elemento | Responsabilidad |
|---|---|
| `fakeRequest(data)` | Simula una petición a un servidor mediante una Promesa y `setTimeout`. |
| `mostrarError(idElemento, mensaje)` | Muestra mensajes de error dentro de la interfaz utilizando `textContent`. |
| `limpiarErrores()` | Limpia los mensajes de error y estado antes de un nuevo intento. |
| `calcularEdad(fechaString)` | Calcula la edad del usuario a partir de la fecha de nacimiento ingresada. |
| Evento `submit` de Registro | Captura datos, valida, verifica emails duplicados y guarda usuarios. |
| Evento `submit` de Login | Captura credenciales, verifica usuarios y muestra el resultado del acceso. |
| `localStorage.setItem()` | Guarda los usuarios registrados en el navegador. |
| `localStorage.getItem()` | Recupera los usuarios guardados en el navegador. |
| `JSON.stringify()` | Convierte el array de usuarios a texto JSON antes de guardarlo. |
| `JSON.parse()` | Convierte el texto JSON recuperado en un array de usuarios. |

---

## Consideraciones

- El sistema funciona únicamente en el navegador.
- No utiliza backend ni base de datos externa.
- Los usuarios quedan guardados solamente en el navegador donde se realizó el registro.
- Si se ejecuta `localStorage.clear()` desde la consola del navegador, los usuarios registrados se eliminarán.
- Las contraseñas se almacenan en texto plano únicamente con fines educativos, ya que el proyecto no utiliza backend ni sistemas de cifrado.
