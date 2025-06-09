document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');

    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
        });

        // Opcional: Cerrar el menú al hacer clic en un enlace (para SPA o si no recarga la página)
        // mainNav.querySelectorAll('a').forEach(link => {
        //     link.addEventListener('click', () => {
        //         mainNav.classList.remove('active');
        //         hamburgerBtn.classList.remove('active');
        //     });
        // });
    }
});