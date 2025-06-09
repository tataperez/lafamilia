<?php

ini_set('display_errors', 1); // Muestra errores en el navegador (solo para desarrollo)
ini_set('display_startup_errors', 1);
error_reporting(E_ALL); // Reporta todos los tipos de errores

// 1. Configuración de la conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
// Sin backticks para el nombre de la base de datos en la conexión
$dbname = "la familia barbershop"; 

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión a la base de datos: " . $conn->connect_error);
}

// 2. Verificar si el formulario ha sido enviado usando el método POST
if ($_SERVER["REQUEST_METHOD"] == "POST") { // <-- Esta es la llave de apertura en la línea 24 (aproximadamente)
    // Recoger y "sanitizar" los datos del formulario
    $nombre_form = $conn->real_escape_string($_POST['nombre'] ?? '');
    $correo_form = $conn->real_escape_string($_POST['email'] ?? '');
    $telefono_form = $conn->real_escape_string($_POST['phone'] ?? '');
    $mensaje_form = $conn->real_escape_string($_POST['message'] ?? '');

    // Validar que los campos requeridos no estén vacíos
    if (empty($nombre_form) || empty($correo_form) || empty($mensaje_form)) {
        echo "Error: Por favor, complete todos los campos requeridos (Nombre, Correo, Mensaje).";
        $conn->close();
        exit();
    }

    // 3. Preparar e insertar los datos en la base de datos
    // Con backticks para el nombre de la tabla con espacio
    $sql = "INSERT INTO `formulario contacto` (NOMBRE, CORREO, TELEFONO, MENSAJE)
            VALUES ('$nombre_form', '$correo_form', '$telefono_form', '$mensaje_form')";

    if ($conn->query($sql) === TRUE) {
        // Redirige a la página de éxito
        header("Location: exito_contacto.html");
        exit(); // Es crucial terminar el script después de una redirección
    } else {
        // Si hay un error, aún mostramos el mensaje detallado para depuración
        echo "Error al enviar el mensaje: " . $sql . "<br>" . $conn->error;
    }

} // <-- Esta llave de cierre pertenece al "if ($_SERVER["REQUEST_METHOD"] == "POST") {"

// Cerrar conexión (se cierra al final, o dentro de cada bloque si se usa exit() antes)
$conn->close();

?>