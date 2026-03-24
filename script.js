// ========== АВТОРИЗАЦИЯ/РЕГИСТРАЦИЯ ==========
let currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;

// Функции авторизации
function openAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function switchAuthTab(tab) {
  const tabs = document.querySelectorAll('.auth-tab');
  const forms = document.querySelectorAll('.auth-form');
  
  tabs.forEach(t => t.classList.remove('active'));
  forms.forEach(f => f.classList.remove('active'));
  
  if (tab === 'login') {
    if (tabs[0]) tabs[0].classList.add('active');
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.classList.add('active');
    const title = document.getElementById('authModalTitle');
    if (title) title.textContent = 'Вход';
  } else {
    if (tabs[1]) tabs[1].classList.add('active');
    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.classList.add('active');
    const title = document.getElementById('authModalTitle');
    if (title) title.textContent = 'Регистрация';
  }
}

// Регистрация
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName')?.value;
    const email = document.getElementById('regEmail')?.value;
    const password = document.getElementById('regPassword')?.value;
    
    if (!name || !email || !password) {
      showAuthStatus('Заполните все поля', 'error');
      return;
    }
    
    if (password.length < 6) {
      showAuthStatus('Пароль должен быть не менее 6 символов', 'error');
      return;
    }
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      showAuthStatus('Пользователь с таким email уже существует', 'error');
      return;
    }
    
    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      password: password,
      avatar: name.charAt(0).toUpperCase()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showAuthStatus('Регистрация успешна!', 'success');
    setTimeout(() => {
      closeAuthModal();
      updateUserInterface();
      updateRatingsAccess();
      showToast('Добро пожаловать, ' + name + '! Теперь вы можете оценивать блюда ⭐', 'success');
    }, 1000);
  });
}

// Вход
const loginFormElement = document.getElementById('loginForm');
if (loginFormElement) {
  loginFormElement.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      showAuthStatus('Вход выполнен!', 'success');
      setTimeout(() => {
        closeAuthModal();
        updateUserInterface();
        updateRatingsAccess();
        showToast('Добро пожаловать, ' + user.name + '! Теперь вы можете оценивать блюда ⭐', 'success');
      }, 1000);
    } else {
      showAuthStatus('Неверный email или пароль', 'error');
    }
  });
}

function showAuthStatus(message, type) {
  const statusDiv = document.getElementById('authStatus');
  if (statusDiv) {
    statusDiv.textContent = message;
    statusDiv.style.color = type === 'error' ? '#ff6b6b' : '#ffd700';
    setTimeout(() => {
      statusDiv.textContent = '';
    }, 3000);
  }
}

function showToast(message, type = 'info') {
  let toast = document.getElementById('authRequiredToast');
  if (!toast) return;
  
  toast.innerHTML = `<i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i><span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Выход из аккаунта
function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateUserInterface();
  updateRatingsAccess();
  showToast('Вы вышли из аккаунта. Чтобы оценивать блюда, войдите снова ⭐', 'info');
}

// Обновление интерфейса бургер меню
function updateUserInterface() {
  const navMenu = document.querySelector('.nav-menu');
  if (!navMenu) return;
  
  let userBlock = document.querySelector('.user-profile');
  
  if (currentUser) {
    if (!userBlock) {
      const userProfile = document.createElement('div');
      userProfile.className = 'user-profile';
      userProfile.innerHTML = `
        <div class="user-info">
          <div class="user-avatar">${currentUser.avatar}</div>
          <span>${currentUser.name}</span>
        </div>
        <button class="logout-btn" onclick="logout()">Выйти</button>
      `;
      navMenu.appendChild(userProfile);
    } else {
      const avatar = userBlock.querySelector('.user-avatar');
      const nameSpan = userBlock.querySelector('.user-info span');
      if (avatar) avatar.textContent = currentUser.avatar;
      if (nameSpan) nameSpan.textContent = currentUser.name;
    }
    
    const authItem = document.querySelector('.auth-menu-item');
    if (authItem) authItem.remove();
  } else {
    if (userBlock) userBlock.remove();
    
    if (!document.querySelector('.auth-menu-item')) {
      const loginItem = document.createElement('li');
      loginItem.className = 'auth-menu-item';
      loginItem.innerHTML = '<a href="#" onclick="openAuthModal(); return false;"><i class="fas fa-sign-in-alt"></i> Войти</a>';
      
      const items = navMenu.querySelectorAll('li');
      if (items.length > 0) {
        navMenu.insertBefore(loginItem, items[items.length - 1]);
      } else {
        navMenu.appendChild(loginItem);
      }
    }
  }
}

// ========== СИСТЕМА ОЦЕНКИ БЛЮД ==========

function loadRatings() {
  return JSON.parse(localStorage.getItem('dishRatings') || '{}');
}

function saveRating(dishId, rating) {
  const ratings = loadRatings();
  
  if (!ratings[dishId]) {
    ratings[dishId] = {};
  }
  
  ratings[dishId][currentUser.id] = {
    rating: rating,
    userName: currentUser.name,
    date: new Date().toISOString()
  };
  
  localStorage.setItem('dishRatings', JSON.stringify(ratings));
  updateDishDisplayRating(dishId);
}

function getAverageRating(dishId) {
  const ratings = loadRatings();
  if (!ratings[dishId]) return 0;
  
  const userRatings = Object.values(ratings[dishId]);
  if (userRatings.length === 0) return 0;
  
  const sum = userRatings.reduce((acc, curr) => acc + curr.rating, 0);
  return sum / userRatings.length;
}

function getUserRating(dishId) {
  if (!currentUser) return null;
  const ratings = loadRatings();
  if (ratings[dishId] && ratings[dishId][currentUser.id]) {
    return ratings[dishId][currentUser.id].rating;
  }
  return null;
}

function updateDishDisplayRating(dishId) {
  const dishCard = document.querySelector(`.dish[data-dish-id="${dishId}"]`);
  if (!dishCard) return;
  
  const ratingDiv = dishCard.querySelector('.rating');
  if (!ratingDiv) return;
  
  const stars = ratingDiv.querySelectorAll('span');
  const userRating = getUserRating(dishId);
  const avgRating = getAverageRating(dishId);
  
  const displayRating = userRating !== null ? userRating : avgRating;
  const roundedRating = Math.round(displayRating);
  
  stars.forEach((star, i) => {
    if (i < roundedRating) {
      star.classList.remove('empty');
      star.classList.add('filled');
      star.textContent = '★';
    } else {
      star.classList.remove('filled');
      star.classList.add('empty');
      star.textContent = '☆';
    }
  });
  
  ratingDiv.dataset.rating = displayRating.toFixed(1);
}

function updateRatingsAccess() {
  const allRatings = document.querySelectorAll('.rating');
  
  allRatings.forEach(rating => {
    if (currentUser) {
      rating.classList.remove('guest-mode');
      rating.classList.add('user-mode');
      rating.style.cursor = 'pointer';
      rating.style.opacity = '1';
      rating.style.pointerEvents = 'auto';
    } else {
      rating.classList.add('guest-mode');
      rating.classList.remove('user-mode');
      rating.style.cursor = 'not-allowed';
      rating.style.opacity = '0.6';
      rating.style.pointerEvents = 'none';
    }
  });
}

function initDishRatings() {
  const dishes = document.querySelectorAll('.dish');
  
  dishes.forEach((dish, index) => {
    const dishId = `dish_${index}`;
    dish.setAttribute('data-dish-id', dishId);
    
    const ratingDiv = dish.querySelector('.rating');
    if (!ratingDiv) return;
    
    updateDishDisplayRating(dishId);
    
    const newRatingDiv = ratingDiv.cloneNode(true);
    ratingDiv.parentNode.replaceChild(newRatingDiv, ratingDiv);
    
    newRatingDiv.addEventListener('click', (e) => {
      e.stopPropagation();
      
      if (!currentUser) {
        showToast('⭐ Чтобы оценить блюдо, войдите в аккаунт', 'error');
        openAuthModal();
        return;
      }
      
      const stars = newRatingDiv.querySelectorAll('span');
      let clickedStarIndex = -1;
      
      for (let i = 0; i < stars.length; i++) {
        const starRect = stars[i].getBoundingClientRect();
        if (e.clientX >= starRect.left && e.clientX <= starRect.right) {
          clickedStarIndex = i;
          break;
        }
      }
      
      if (clickedStarIndex !== -1) {
        const newRating = clickedStarIndex + 1;
        saveRating(dishId, newRating);
        
        const dishName = dish.querySelector('h3')?.textContent || 'блюдо';
        showToast(`Вы оценили "${dishName}" на ${newRating} ⭐`, 'success');
      }
    });
  });
  
  updateRatingsAccess();
}

// ========== БУРГЕР МЕНЮ ==========
const burgerIcon = document.querySelector('.burger-icon');
const navMenu = document.querySelector('.nav-menu');

if (burgerIcon && navMenu) {
  burgerIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    burgerIcon.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  
  document.addEventListener('click', () => {
    burgerIcon.classList.remove('active');
    navMenu.classList.remove('active');
  });
}

// ========== МОДАЛКА БРОНИРОВАНИЯ ==========
function openBookingModal() {
  if (!currentUser) {
    showToast('Чтобы забронировать столик, войдите в аккаунт', 'error');
    openAuthModal();
    return;
  }
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

const bookingModal = document.getElementById('bookingModal');
if (bookingModal) {
  bookingModal.addEventListener('click', function(e) {
    if (e.target === this) closeBookingModal();
  });
}

const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = this.querySelector('.btn-booking');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';
    btn.disabled = true;
    
    setTimeout(() => {
      this.style.display = 'none';
      const successDiv = document.getElementById('bookingSuccess');
      if (successDiv) successDiv.style.display = 'block';
      showToast('Бронирование отправлено! Мы свяжемся с вами', 'success');
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 2000);
  });
}

const phoneInput = document.querySelector('input[name="phone"]');
if (phoneInput) {
  phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('8')) value = '7' + value.slice(1);
    if (!value.startsWith('7')) value = '7' + value;
    e.target.value = value.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($1$2) $3-$4-$5');
  });
}

// ========== PRELOADER ==========
window.addEventListener('load', function() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }, 500);
    }, 3500);
  }
  
  initDishRatings();
  updateUserInterface();
  initDegustationButtons(); // 👈 ДОБАВЬ ЭТУ СТРОКУ
});

// ========== КУКИ БАННЕР ==========
const cookieBanner = document.getElementById('cookie-banner');
if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
  setTimeout(() => {
    cookieBanner.classList.add('show');
  }, 1000);
  
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');
  
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.classList.remove('show');
    });
  }
  
  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'false');
      cookieBanner.classList.remove('show');
    });
  }
}

// ========== КАРУСЕЛЬ ОТЗЫВОВ ==========
let currentReview = 0;
const totalReviews = 3;

function showReview(index) {
  const cards = document.querySelectorAll('.review-card');
  const dots = document.querySelectorAll('.dot');
  
  if (cards.length === 0) return;
  
  cards.forEach(card => card.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  if (cards[index]) cards[index].classList.add('active');
  if (dots[index]) dots[index].classList.add('active');
  
  const carouselInner = document.getElementById('carouselInner');
  if (carouselInner) {
    carouselInner.style.transform = `translateX(-${index * 100}%)`;
  }
}

function nextReview() {
  currentReview = (currentReview + 1) % totalReviews;
  showReview(currentReview);
}

function prevReview() {
  currentReview = (currentReview - 1 + totalReviews) % totalReviews;
  showReview(currentReview);
}

document.addEventListener('DOMContentLoaded', function() {
  const dotsContainer = document.getElementById('reviewDots');
  if (dotsContainer && dotsContainer.children.length === 0) {
    for (let i = 0; i < totalReviews; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.onclick = () => {
        currentReview = i;
        showReview(i);
      };
      dotsContainer.appendChild(dot);
    }
    showReview(0);
    setInterval(nextReview, 4000);
  }
});

document.documentElement.style.scrollBehavior = 'smooth';
// ========== КНОПКИ БРОНИРОВАНИЯ В ДЕГУСТАЦИЯХ ==========
function initDegustationButtons() {
  // Находим все кнопки "Забронировать" в секции дегустаций
  const degustationBtns = document.querySelectorAll('.prices-section .cta-btn');
  
  degustationBtns.forEach(btn => {
    // Удаляем старый обработчик, если есть
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    // Добавляем новый обработчик
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Проверяем авторизацию
      if (!currentUser) {
        showToast('Чтобы забронировать дегустацию, войдите в аккаунт', 'error');
        openAuthModal();
        return;
      }
      
      // Открываем модалку бронирования
      openBookingModal();
      
      // Опционально: можно предзаполнить поле с пожеланиями
      setTimeout(() => {
        const messageField = document.querySelector('#bookingForm textarea[name="message"]');
        if (messageField) {
          const cardTitle = this.closest('.price-card')?.querySelector('h3')?.textContent || 'дегустацию';
          messageField.value = `Хочу забронировать ${cardTitle}`;
        }
      }, 300);
    });
  });
}

