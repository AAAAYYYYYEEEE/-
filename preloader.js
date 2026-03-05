 // preloader.js — универсальный прелоадер
document.addEventListener('DOMContentLoaded', function() {
  // Показываем прелоадер на 3 секунды
  const preloader = document.getElementById('preloader');
  
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.pointerEvents = 'none';
      
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, 3000);
  }
});

