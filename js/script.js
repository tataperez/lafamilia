document.addEventListener('DOMContentLoaded', function() {
    // ******************************************************************
    // SCRIPT PARA EL MENÚ DE HAMBURGUESA
    // ******************************************************************
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');

    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
        });

        // Opcional: Cerrar el menú al hacer clic en un enlace
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                hamburgerBtn.classList.remove('active');
            });
        });
    }

    // ******************************************************************
    // SCRIPT PARA EL ENVÍO DEL FORMULARIO DE CONTACTO
    // ******************************************************************
    const contactForm = document.getElementById('contactForm'); // Selecciona el formulario por su ID

    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Evita el envío tradicional del formulario (que recargaría la página)

            const formData = new FormData(contactForm);
            // Convierte FormData a un objeto plano para enviarlo como JSON
            const data = Object.fromEntries(formData.entries());

            try {
                // Realiza la petición a tu función Serverless de Vercel
                const response = await fetch('/api/submit-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Indicamos que enviamos JSON
                    },
                    body: JSON.stringify(data) // Convertimos el objeto JavaScript a una cadena JSON
                });

                if (response.ok) { // Si la respuesta de la función Serverless es exitosa (código de estado 200)
                    console.log('Respuesta OK de la función Serverless. Redirigiendo...'); // Para depuración
                    window.location.href = 'exito_contacto.html'; // ¡Redirige a la página de éxito!
                } else {
                    // Si hay un error, obtenemos el mensaje de error del servidor y lo mostramos
                    const errorData = await response.json();
                    alert('Error al enviar el mensaje: ' + (errorData.message || 'Error desconocido'));
                    console.error('Error del servidor:', errorData);
                }
            } catch (error) {
                // Captura errores que ocurren antes de que la petición llegue al servidor (ej. problemas de red)
                alert('Hubo un problema con el envío: ' + error.message);
                console.error('Error de red o JavaScript:', error);
            }
        });
    }
}); // <-- ¡Asegúrate de que este } cierre el `DOMContentLoaded` inicial!