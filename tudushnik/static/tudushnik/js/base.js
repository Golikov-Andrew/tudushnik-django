const burgerMenuButton = document.querySelector('.burger-menu-button'),
    navbarContainer = document.querySelector('.navbar-container');

burgerMenuButton.addEventListener('click', () => {
    navbarContainer.classList.toggle('opened')
})