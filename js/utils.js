function random(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(random(min, max + 1));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function rectCollision(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}

function circleCollision(c1, c2) {
  return distance(c1, c2) < c1.radius + c2.radius;
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('保存失败:', e);
  }
}

function loadFromStorage(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error('读取失败:', e);
    return defaultValue;
  }
}

function showNotification(message, type = 'info', duration = 2000) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideDown 0.3s ease-out reverse';
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

function createDamageText(x, y, damage, isCritical = false, isMiss = false, isHeal = false) {
  if (typeof Game !== 'undefined' && Game.damageTexts) {
    Game.damageTexts.push({
      x, y,
      value: isMiss ? 'MISS' : Math.floor(damage),
      isCrit: isCritical,
      isMiss,
      isHeal,
      life: 1000,
      maxLife: 1000
    });
  }
}

function createFloatingText(x, y, text, color = '#fff') {
  if (typeof Game !== 'undefined' && Game.floatingTexts) {
    Game.floatingTexts.push({
      x, y,
      text,
      color,
      life: 1500,
      maxLife: 1500
    });
  }
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function getRarityClass(rarity) {
  switch (rarity) {
    case 'rare': return 'rare';
    case 'epic': return 'epic';
    case 'legendary': return 'legendary';
    default: return '';
  }
}

function getRarityColor(rarity) {
  switch (rarity) {
    case 'rare': return '#9b59b6';
    case 'epic': return '#2ecc71';
    case 'legendary': return '#f39c12';
    default: return '#ecf0f1';
  }
}
