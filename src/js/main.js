const buttonsMobile = document.querySelector('.buttonsMobile');
const open = document.querySelector('.menu-icon');
const menu = document.querySelector('.nav__menu');
const close = document.querySelector('.close-menu-icon');

buttonsMobile.addEventListener('click', function (e) {
   let currentTarget = e.target;
   open.classList.remove('active');
   menu.classList.add('active');
   close.classList.remove('disable');
   currentTarget.closest("div").classList.add('disable');
   if (close.classList.contains('disable')) {
      menu.classList.remove('active');
      open.classList.remove('disable')
   }
   if (document.documentElement.clientWidth < 480) {
      menu.style.left = `${document.documentElement.clientWidth - 330}px`;
   }
});

document.addEventListener('click', function (e) {
   if (e.target === menu || menu.contains(e.target) || e.target === open ) {
      return false
   }
   menu.classList.remove('active');
   if (!close.classList.contains('active')) {
      close.classList.add('disable');
      open.classList.add('active')
   }
});   
