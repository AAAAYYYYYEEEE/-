 document.querySelectorAll('.rating').forEach(rating => {
      rating.addEventListener('click', (e) => {
        const rect = rating.getBoundingClientRect();
        const pos = e.clientX - rect.left;
        const starWidth = rect.width / 5;
        const newRating = Math.max(1, Math.floor(pos / starWidth) + 1);

        const spans = rating.querySelectorAll('span');
        spans.forEach((span, i) => {
          if (i < newRating) {
            span.classList.remove('empty');
            span.classList.add('filled');
            span.textContent = '★';
          } else {
            span.classList.remove('filled');
            span.classList.add('empty');
            span.textContent = '☆';
          }
        });

        rating.dataset.rating = newRating;
      });
    });

const burgerIcon = document.querySelector('.burger-icon');
const navMenu = document.querySelector('.nav-menu');

burgerIcon.addEventListener('click', (e) => {
  e.stopPropagation();
  burgerIcon.classList.toggle('active');
  navMenu.classList.toggle('active');
});


document.addEventListener('click', () => {
  burgerIcon.classList.remove('active');
  navMenu.classList.remove('active');
});

document.getElementById('bookingForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Имитация отправки
  const btn = this.querySelector('.btn-booking');
  const originalText = btn.innerHTML;
  
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';
  btn.disabled = true;
  
  setTimeout(() => {
    document.getElementById('bookingForm').style.display = 'none';
    document.getElementById('bookingSuccess').style.display = 'block';
  }, 2000);
});

// Автозаполнение телефона
document.querySelector('input[name="phone"]').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.startsWith('8')) value = '7' + value.slice(1);
  if (!value.startsWith('7')) value = '7' + value;
  e.target.value = value.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($1$2) $3-$4-$5');
});

// Открыть модалку бронирования
function openBookingModal() {
  document.getElementById('bookingModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Закрыть модалку
function closeBookingModal() {
  document.getElementById('bookingModal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Закрытие по клику на фон
document.getElementById('bookingModal').addEventListener('click', function(e) {
  if (e.target === this) closeBookingModal();
});

// Отправка формы
document.getElementById('bookingForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const btn = this.querySelector('.btn-booking');
  const originalText = btn.innerHTML;
  
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';
  btn.disabled = true;
  
  setTimeout(() => {
    this.style.display = 'none';
    document.getElementById('bookingSuccess').style.display = 'block';
  }, 2000);
});

// Автозаполнение телефона
document.querySelector('input[name="phone"]').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.startsWith('8')) value = '7' + value.slice(1);
  if (!value.startsWith('7')) value = '7' + value;
  e.target.value = value.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($1$2) $3-$4-$5');
});

window.addEventListener('load', function() {
  const preloader = document.querySelector('.preloader');
  preloader.style.opacity = '0';
  setTimeout(() => {
    preloader.style.display = 'none';
  }, 500);
});

// Карусель отзывов
let currentReview = 0;
const totalReviews = 3; // 3 отзыва

function showReview(index) {
 
  document.querySelectorAll('.review-card').forEach(card => {
    card.classList.remove('active');
  });
  document.querySelectorAll('.dot').forEach(dot => {
    dot.classList.remove('active');
  });
  
 
  document.querySelectorAll('.review-card')[index].classList.add('active');
  document.querySelectorAll('.dot')[index].classList.add('active');
  
  // Прокрутка карусели
  const carouselInner = document.getElementById('carouselInner');
  carouselInner.style.transform = `translateX(-${index * 100}%)`;
}

function nextReview() {
  currentReview = (currentReview + 1) % totalReviews;
  showReview(currentReview);
}

function prevReview() {
  currentReview = (currentReview - 1 + totalReviews) % totalReviews;
  showReview(currentReview);
}

// Создаём точки
document.addEventListener('DOMContentLoaded', function() {
  const dotsContainer = document.getElementById('reviewDots');
  for (let i = 0; i < totalReviews; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.onclick = () => showReview(i);
    if (i === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);
  }
  
  // Автопрокрутка каждые 4 секунды
  setInterval(nextReview, 4000);
});

// Preloader
window.addEventListener('load', function() {
  const preloader = document.getElementById('preloader');
  
  // Задержка 3.5 секунды
  setTimeout(() => {
    preloader.classList.add('fade-out');
    
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 500);
  }, 3500);
});

// Плавная прокрутка после загрузки
document.documentElement.style.scrollBehavior = 'smooth';
