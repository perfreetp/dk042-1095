const Renderer = {
  canvas: null,
  ctx: null,
  width: 1280,
  height: 720,
  cameraX: 0,
  cameraY: 0,
  shakeIntensity: 0,
  shakeDuration: 0,

  init() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  },

  clear(color = '#000') {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
  },

  begin() {
    this.ctx.save();
    
    let shakeX = 0, shakeY = 0;
    if (this.shakeDuration > 0) {
      shakeX = (Math.random() - 0.5) * this.shakeIntensity * 2;
      shakeY = (Math.random() - 0.5) * this.shakeIntensity * 2;
      this.shakeDuration -= 16;
      if (this.shakeDuration <= 0) {
        this.shakeIntensity = 0;
      }
    }
    
    this.ctx.translate(-this.cameraX + shakeX, -this.cameraY + shakeY);
  },

  end() {
    this.ctx.restore();
  },

  shake(intensity, duration) {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
    this.shakeDuration = Math.max(this.shakeDuration, duration);
  },

  follow(target, mapWidth) {
    const targetX = target.x - this.width / 2;
    const targetY = target.y - this.height / 2;
    
    this.cameraX = clamp(lerp(this.cameraX, targetX, 0.1), 0, Math.max(0, mapWidth - this.width));
    this.cameraY = clamp(lerp(this.cameraY, targetY, 0.1), 0, 0);
  },

  worldToScreen(x, y) {
    return {
      x: x - this.cameraX,
      y: y - this.cameraY
    };
  },

  drawRect(x, y, width, height, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  },

  drawStrokeRect(x, y, width, height, color, lineWidth = 2) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeRect(x, y, width, height);
  },

  drawCircle(x, y, radius, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  },

  drawStrokeCircle(x, y, radius, color, lineWidth = 2) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.stroke();
  },

  drawText(text, x, y, color = '#fff', fontSize = 14, align = 'left', baseline = 'top') {
    this.ctx.fillStyle = color;
    this.ctx.font = `${fontSize}px "Microsoft YaHei", "PingFang SC", sans-serif`;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = baseline;
    this.ctx.fillText(text, x, y);
  },

  drawGradientRect(x, y, width, height, color1, color2, direction = 'vertical') {
    const gradient = direction === 'vertical' 
      ? this.ctx.createLinearGradient(x, y, x, y + height)
      : this.ctx.createLinearGradient(x, y, x + width, y);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x, y, width, height);
  },

  drawRoundedRect(x, y, width, height, radius, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
    this.ctx.fill();
  },

  drawHPBar(x, y, width, height, currentHP, maxHP, showText = true) {
    const percentage = currentHP / maxHP;
    
    this.drawRoundedRect(x - 2, y - 2, width + 4, height + 4, 4, 'rgba(0,0,0,0.8)');
    this.drawRoundedRect(x, y, width, height, 3, '#333');
    
    let color1 = '#27ae60', color2 = '#2ecc71';
    if (percentage < 0.3) {
      color1 = '#c0392b';
      color2 = '#e74c3c';
    } else if (percentage < 0.6) {
      color1 = '#d35400';
      color2 = '#f39c12';
    }
    
    this.drawGradientRect(x, y, width * percentage, height, color1, color2);
    this.drawStrokeRect(x, y, width, height, 'rgba(255,255,255,0.3)', 1);
    
    if (showText) {
      this.drawText(`${Math.ceil(currentHP)}/${maxHP}`, x + width / 2, y + height / 2, '#fff', 11, 'center', 'middle');
    }
  },

  drawPlayer(player) {
    const { x, y, width, height, facingRight, classData, currentState, attackFrame } = player;
    
    const classColor = classData ? classData.color : '#fff';
    const centerX = x + width / 2;
    const groundY = y + height;
    
    this.drawShadow(x + width / 2, groundY, width * 0.6);
    
    const bodyColor = classColor;
    const armorColor = this.lightenColor(classColor, 30);
    
    if (facingRight) {
      this.ctx.save();
      this.ctx.translate(centerX, y);
    } else {
      this.ctx.save();
      this.ctx.translate(centerX, y);
      this.ctx.scale(-1, 1);
    }
    
    const offsetX = -width / 2;
    
    const legOffset = currentState === 'walk' ? Math.sin(Date.now() / 100) * 5 : 0;
    this.drawRect(offsetX + 8, y + 40 - y + legOffset, 10, 20, '#2c3e50');
    this.drawRect(offsetX + 22, y + 40 - y - legOffset, 10, 20, '#2c3e50');
    
    this.drawRect(offsetX + 5, y + 15 - y, 30, 28, bodyColor);
    
    this.drawRect(offsetX + 3, y + 18 - y, 34, 4, armorColor);
    this.drawRect(offsetX + 3, y + 35 - y, 34, 4, armorColor);
    
    this.drawCircle(offsetX + 20, y + 8 - y, 12, '#ffdbac');
    this.drawCircle(offsetX + 20, y + 2 - y, 10, classColor);
    
    if (attackFrame > 0) {
      const weaponAngle = (1 - attackFrame) * Math.PI / 2;
      this.ctx.save();
      this.ctx.translate(offsetX + 35, y + 25 - y);
      this.ctx.rotate(-weaponAngle);
      this.drawRect(0, -3, 35, 6, '#bdc3c7');
      this.drawRect(30, -5, 8, 10, '#f1c40f');
      this.ctx.restore();
    } else {
      this.drawRect(offsetX + 32, y + 20 - y, 5, 25, '#bdc3c7');
    }
    
    this.ctx.restore();
  },

  drawMonster(monster) {
    const { x, y, data, currentHP, isBoss, isDummy } = monster;
    const size = data.size;
    const centerX = x;
    const groundY = y + size;
    
    if (!isDummy) {
      this.drawShadow(centerX, groundY, size * 0.8);
    }
    
    this.drawMonsterShape(monster);
    
    if (isBoss) {
      const barWidth = size * 2;
      const barY = y - size / 2 - 30;
      this.drawHPBar(centerX - barWidth / 2, barY, barWidth, 12, currentHP, data.hp);
      this.drawText(data.name, centerX, barY - 20, '#e74c3c', 16, 'center');
    } else if (!isDummy) {
      const barWidth = size * 1.5;
      const barY = y - size / 2 - 18;
      this.drawHPBar(centerX - barWidth / 2, barY, barWidth, 6, currentHP, data.hp, false);
    }
  },

  drawMonsterShape(monster) {
    const { x, y, data, hitFlash } = monster;
    const size = data.size;
    const color = hitFlash > 0 ? '#fff' : data.color;
    
    switch (data.name) {
      case '蓝史莱姆':
        this.drawSlime(x, y, size, color);
        break;
      case '蘑菇怪':
      case '蘑菇王':
        this.drawMushroom(x, y, size, color, data.name === '蘑菇王');
        break;
      case '野猪':
        this.drawPig(x, y, size, color);
        break;
      case '蝙蝠':
      case '哈比':
        this.drawBat(x, y, size, color, data.flying);
        break;
      case '骷髅兵':
        this.drawSkeleton(x, y, size, color);
        break;
      case '石头人':
      case '石巨人':
        this.drawGolem(x, y, size, color);
        break;
      case '蜘蛛女王':
        this.drawSpider(x, y, size, color);
        break;
      case '天空龙':
        this.drawDragon(x, y, size, color);
        break;
      case '机械兵':
        this.drawRobot(x, y, size, color);
        break;
      case '机甲巨兽':
        this.drawMechaBoss(x, y, size, color);
        break;
      case '训练木桩':
        this.drawDummy(x, y, size, color);
        break;
      default:
        this.drawCircle(x, y, size / 2, color);
    }
    
    if (data.name === '蜘蛛女王') {
      this.drawCircle(x, y - size / 4, size / 6, '#ff0000');
    }
  },

  drawSlime(x, y, size, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, size * 0.6, size * 0.45, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.drawCircle(x - size * 0.2, y - size * 0.1, size * 0.1, '#fff');
    this.drawCircle(x + size * 0.2, y - size * 0.1, size * 0.1, '#fff');
    this.drawCircle(x - size * 0.2, y - size * 0.1, size * 0.05, '#000');
    this.drawCircle(x + size * 0.2, y - size * 0.1, size * 0.05, '#000');
  },

  drawMushroom(x, y, size, color, isKing) {
    this.drawRect(x - size * 0.25, y, size * 0.5, size * 0.5, '#f5deb3');
    
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.ellipse(x, y - size * 0.1, size * 0.6, size * 0.45, 0, Math.PI, 0);
    this.ctx.fill();
    
    this.drawCircle(x - size * 0.25, y - size * 0.2, size * 0.08, '#fff');
    this.drawCircle(x + size * 0.15, y - size * 0.35, size * 0.1, '#fff');
    
    if (isKing) {
      this.drawRect(x - size * 0.3, y - size * 0.6, size * 0.6, size * 0.15, '#f1c40f');
      this.drawRect(x - size * 0.4, y - size * 0.45, size * 0.8, size * 0.1, '#f39c12');
    }
    
    this.drawCircle(x - size * 0.12, y + size * 0.15, size * 0.06, '#000');
    this.drawCircle(x + size * 0.12, y + size * 0.15, size * 0.06, '#000');
  },

  drawPig(x, y, size, color) {
    this.drawRect(x - size * 0.4, y - size * 0.2, size * 0.8, size * 0.5, color);
    this.drawCircle(x + size * 0.35, y - size * 0.15, size * 0.25, color);
    this.drawCircle(x + size * 0.5, y - size * 0.1, size * 0.1, '#ffb6c1');
    this.drawCircle(x + size * 0.35, y - size * 0.25, size * 0.05, '#000');
    this.drawRect(x - size * 0.35, y + size * 0.25, size * 0.1, size * 0.15, '#5d4037');
    this.drawRect(x + size * 0.2, y + size * 0.25, size * 0.1, size * 0.15, '#5d4037');
    this.drawRect(x - size * 0.3, y - size * 0.5, size * 0.05, size * 0.15, color);
    this.drawRect(x - size * 0.1, y - size * 0.5, size * 0.05, size * 0.15, color);
  },

  drawBat(x, y, size, color, flying) {
    const wingOffset = flying ? Math.sin(Date.now() / 100) * size * 0.3 : 0;
    
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x - size * 0.8, y - size * 0.3 - wingOffset);
    this.ctx.lineTo(x - size * 0.4, y + size * 0.1);
    this.ctx.closePath();
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + size * 0.8, y - size * 0.3 - wingOffset);
    this.ctx.lineTo(x + size * 0.4, y + size * 0.1);
    this.ctx.closePath();
    this.ctx.fill();
    
    this.drawCircle(x, y, size * 0.3, color);
    this.drawCircle(x - size * 0.1, y - size * 0.05, size * 0.05, '#ff0000');
    this.drawCircle(x + size * 0.1, y - size * 0.05, size * 0.05, '#ff0000');
  },

  drawSkeleton(x, y, size, color) {
    this.drawCircle(x, y - size * 0.35, size * 0.25, color);
    this.drawRect(x - size * 0.2, y - size * 0.1, size * 0.4, size * 0.35, color);
    this.drawRect(x - size * 0.35, y - size * 0.05, size * 0.15, size * 0.05, color);
    this.drawRect(x + size * 0.2, y - size * 0.05, size * 0.15, size * 0.05, color);
    this.drawRect(x - size * 0.15, y + size * 0.2, size * 0.08, size * 0.25, color);
    this.drawRect(x + size * 0.07, y + size * 0.2, size * 0.08, size * 0.25, color);
    this.drawCircle(x - size * 0.08, y - size * 0.4, size * 0.04, '#000');
    this.drawCircle(x + size * 0.08, y - size * 0.4, size * 0.04, '#000');
  },

  drawGolem(x, y, size, color) {
    this.drawRect(x - size * 0.4, y - size * 0.5, size * 0.8, size * 0.6, color);
    this.drawRect(x - size * 0.3, y - size * 0.85, size * 0.6, size * 0.35, color);
    this.drawRect(x - size * 0.5, y - size * 0.4, size * 0.12, size * 0.4, color);
    this.drawRect(x + size * 0.38, y - size * 0.4, size * 0.12, size * 0.4, color);
    this.drawRect(x - size * 0.3, y + size * 0.05, size * 0.2, size * 0.4, color);
    this.drawRect(x + size * 0.1, y + size * 0.05, size * 0.2, size * 0.4, color);
    this.drawRect(x - size * 0.18, y - size * 0.75, size * 0.1, size * 0.08, '#ff6b00');
    this.drawRect(x + size * 0.08, y - size * 0.75, size * 0.1, size * 0.08, '#ff6b00');
  },

  drawSpider(x, y, size, color) {
    for (let i = 0; i < 4; i++) {
      const angle = (i - 1.5) * 0.3 + Math.sin(Date.now() / 200 + i) * 0.1;
      const legX = Math.cos(angle) * size * 0.7;
      const legY = Math.sin(angle) * size * 0.3;
      this.drawStrokeRect(x - size * 0.1, y, size * 0.2 + legX, size * 0.05 + legY, color, 3);
      this.drawStrokeRect(x - size * 0.1, y, -size * 0.2 - legX, size * 0.05 + legY, color, 3);
    }
    this.drawCircle(x, y, size * 0.4, color);
    this.drawCircle(x, y - size * 0.3, size * 0.25, this.darkenColor(color, 20));
    this.drawCircle(x - size * 0.1, y - size * 0.3, size * 0.06, '#ff0000');
    this.drawCircle(x + size * 0.1, y - size * 0.3, size * 0.06, '#ff0000');
  },

  drawDragon(x, y, size, color) {
    const wingOffset = Math.sin(Date.now() / 150) * size * 0.2;
    
    this.ctx.fillStyle = this.lightenColor(color, 20);
    this.ctx.beginPath();
    this.ctx.moveTo(x - size * 0.2, y - size * 0.2);
    this.ctx.lineTo(x - size * 0.8, y - size * 0.6 - wingOffset);
    this.ctx.lineTo(x - size * 0.3, y + size * 0.1);
    this.ctx.closePath();
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.moveTo(x + size * 0.2, y - size * 0.2);
    this.ctx.lineTo(x + size * 0.8, y - size * 0.6 - wingOffset);
    this.ctx.lineTo(x + size * 0.3, y + size * 0.1);
    this.ctx.closePath();
    this.ctx.fill();
    
    this.drawEllipse(x, y, size * 0.5, size * 0.35, color);
    this.drawCircle(x + size * 0.45, y - size * 0.1, size * 0.25, color);
    this.drawTriangle(x + size * 0.55, y - size * 0.35, size * 0.15, size * 0.2, color);
    this.drawTriangle(x + size * 0.4, y - size * 0.4, size * 0.1, size * 0.15, color);
    this.drawCircle(x + size * 0.5, y - size * 0.15, size * 0.05, '#ff0');
    this.drawRect(x - size * 0.5, y + size * 0.1, size * 0.12, size * 0.25, color);
    this.drawRect(x + size * 0.35, y + size * 0.1, size * 0.12, size * 0.25, color);
  },

  drawRobot(x, y, size, color) {
    this.drawRect(x - size * 0.35, y - size * 0.2, size * 0.7, size * 0.5, color);
    this.drawRect(x - size * 0.25, y - size * 0.6, size * 0.5, size * 0.35, this.lightenColor(color, 15));
    this.drawRect(x - size * 0.18, y - size * 0.5, size * 0.12, size * 0.08, '#00ff00');
    this.drawRect(x + size * 0.06, y - size * 0.5, size * 0.12, size * 0.08, '#00ff00');
    this.drawRect(x - size * 0.08, y - size * 0.75, size * 0.16, size * 0.1, '#e74c3c');
    this.drawRect(x - size * 0.45, y - size * 0.15, size * 0.12, size * 0.4, color);
    this.drawRect(x + size * 0.33, y - size * 0.15, size * 0.12, size * 0.4, color);
    this.drawRect(x - size * 0.28, y + size * 0.25, size * 0.2, size * 0.2, color);
    this.drawRect(x + size * 0.08, y + size * 0.25, size * 0.2, size * 0.2, color);
    this.drawRect(x - size * 0.3, y - size * 0.05, size * 0.6, size * 0.1, '#bdc3c7');
  },

  drawMechaBoss(x, y, size, color) {
    this.drawRect(x - size * 0.45, y - size * 0.3, size * 0.9, size * 0.7, color);
    this.drawRect(x - size * 0.35, y - size * 0.8, size * 0.7, size * 0.45, this.lightenColor(color, 10));
    this.drawRect(x - size * 0.25, y - size * 0.65, size * 0.15, size * 0.1, '#ff0000');
    this.drawRect(x + size * 0.1, y - size * 0.65, size * 0.15, size * 0.1, '#ff0000');
    this.drawRect(x - size * 0.12, y - size * 0.95, size * 0.24, size * 0.15, '#f39c12');
    this.drawRect(x - size * 0.6, y - size * 0.5, size * 0.18, size * 0.3, color);
    this.drawRect(x + size * 0.42, y - size * 0.5, size * 0.18, size * 0.3, color);
    this.drawRect(x - size * 0.65, y - size * 0.2, size * 0.25, size * 0.15, '#7f8c8d');
    this.drawRect(x + size * 0.4, y - size * 0.2, size * 0.25, size * 0.15, '#7f8c8d');
    this.drawRect(x - size * 0.35, y + size * 0.35, size * 0.25, size * 0.3, color);
    this.drawRect(x + size * 0.1, y + size * 0.35, size * 0.25, size * 0.3, color);
    this.drawRect(x - size * 0.4, y - size * 0.1, size * 0.8, size * 0.15, '#bdc3c7');
    
    for (let i = 0; i < 5; i++) {
      this.drawCircle(x - size * 0.3 + i * size * 0.15, y + size * 0.05, size * 0.04, 
        i % 2 === 0 ? '#e74c3c' : '#f39c12');
    }
  },

  drawDummy(x, y, size, color) {
    this.drawRect(x - size * 0.15, y - size * 0.3, size * 0.3, size * 0.6, color);
    this.drawCircle(x, y - size * 0.5, size * 0.2, '#ffdbac');
    this.drawLine(x - size * 0.3, y - size * 0.1, x + size * 0.3, y - size * 0.1, color, 4);
    this.drawRect(x - size * 0.05, y + size * 0.3, size * 0.1, size * 0.3, '#5d4037');
    this.drawRect(x - size * 0.3, y + size * 0.55, size * 0.6, size * 0.08, '#5d4037');
    this.drawText('伤害', x, y - size * 0.45, '#000', 10, 'center', 'middle');
  },

  drawShadow(x, y, width) {
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, width / 2);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, width / 2, width / 6, 0, 0, Math.PI * 2);
    this.ctx.fill();
  },

  drawEllipse(x, y, rx, ry, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    this.ctx.fill();
  },

  drawTriangle(x, y, width, height, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - height);
    this.ctx.lineTo(x - width / 2, y);
    this.ctx.lineTo(x + width / 2, y);
    this.ctx.closePath();
    this.ctx.fill();
  },

  drawLine(x1, y1, x2, y2, color, width = 1) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  },

  drawItem(item) {
    const itemData = GameData.items[item.type];
    if (!itemData) return;
    
    const { x, y } = item;
    const bobOffset = Math.sin(Date.now() / 300 + x) * 3;
    
    const glow = Math.sin(Date.now() / 200) * 0.3 + 0.7;
    this.drawCircle(x, y + bobOffset, 18, `${itemData.color}${Math.floor(glow * 40).toString(16).padStart(2, '0')}`);
    
    this.drawRoundedRect(x - 12, y - 12 + bobOffset, 24, 24, 6, itemData.color);
    this.drawStrokeRect(x - 12, y - 12 + bobOffset, 24, 24, '#fff', 2);
    
    this.drawText(itemData.icon, x, y + bobOffset, '#fff', 16, 'center', 'middle');
    
    if (item.count > 1) {
      this.drawText(item.count.toString(), x + 10, y + 8 + bobOffset, '#fff', 10, 'right');
    }
  },

  drawProjectile(p) {
    const colors = {
      fireball: ['#ff6b00', '#ff0', '#fff'],
      ice_spike: ['#00bcd4', '#b2ebf2', '#fff'],
      arrow_shot: ['#8d6e63', '#a1887f', '#fff'],
      lightning: ['#ffeb3b', '#fff59d', '#fff'],
      multi_shot: ['#8d6e63', '#a1887f', '#fff']
    };
    
    const colorSet = colors[p.skill] || ['#fff', '#ccc', '#fff'];
    
    for (let i = 0; i < 3; i++) {
      const alpha = 0.8 - i * 0.25;
      const offsetX = -p.vx * i * 3;
      const offsetY = -p.vy * i * 3;
      this.drawCircle(p.x + offsetX, p.y + offsetY, 10 - i * 2, `${colorSet[i]}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
    }
    
    this.drawCircle(p.x, p.y, 8, colorSet[0]);
    this.drawCircle(p.x, p.y, 5, colorSet[1]);
    this.drawCircle(p.x, p.y, 2, colorSet[2]);
  },

  drawEffect(effect) {
    const progress = 1 - effect.life / effect.maxLife;
    
    if (effect.type === 'hit') {
      const size = 20 + progress * 30;
      const alpha = 1 - progress;
      this.drawStrokeCircle(effect.x, effect.y, size, `rgba(255, 255, 0, ${alpha})`, 3);
    } else if (effect.type === 'explosion') {
      const size = 30 + progress * 80;
      const alpha = 1 - progress;
      this.drawCircle(effect.x, effect.y, size * 0.6, `rgba(255, 100, 0, ${alpha * 0.5})`);
      this.drawStrokeCircle(effect.x, effect.y, size, `rgba(255, 200, 0, ${alpha})`, 4);
    } else if (effect.type === 'buff') {
      const size = 40 + Math.sin(progress * Math.PI) * 20;
      const alpha = 1 - progress;
      this.drawStrokeCircle(effect.x, effect.y, size, `rgba(100, 200, 255, ${alpha})`, 2);
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + progress * Math.PI;
        const px = effect.x + Math.cos(angle) * size;
        const py = effect.y + Math.sin(angle) * size;
        this.drawCircle(px, py, 4, `rgba(100, 200, 255, ${alpha})`);
      }
    } else if (effect.type === 'levelup') {
      const alpha = 1 - progress;
      const yOffset = -progress * 50;
      this.drawText('升级!', effect.x, effect.y + yOffset, '#f1c40f', 28, 'center');
      this.drawStrokeCircle(effect.x, effect.y + yOffset + 15, 30 + progress * 20, `rgba(241, 196, 15, ${alpha})`, 3);
    }
  },

  lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = clamp((num >> 16) + amt, 0, 255);
    const G = clamp((num >> 8 & 0x00FF) + amt, 0, 255);
    const B = clamp((num & 0x0000FF) + amt, 0, 255);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  },

  darkenColor(color, percent) {
    return this.lightenColor(color, -percent);
  },

  drawBackground(region) {
    const bgGradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    bgGradient.addColorStop(0, region.bgColor);
    bgGradient.addColorStop(1, this.darkenColor(region.bgColor, 20));
    this.ctx.fillStyle = bgGradient;
    this.ctx.fillRect(this.cameraX, this.cameraY, this.width, this.height);

    if (region.id === 'town') {
      this.drawTownBackground();
    } else if (region.id === 'forest') {
      this.drawForestBackground();
    } else if (region.id === 'mine') {
      this.drawMineBackground();
    } else if (region.id === 'sky') {
      this.drawSkyBackground();
    } else if (region.id === 'tower') {
      this.drawTowerBackground();
    }
  },

  drawTownBackground() {
    for (let i = 0; i < 10; i++) {
      const x = i * 350 + 100;
      const y = 400 + Math.sin(i) * 20;
      this.drawRect(x, y, 80, 120, '#5d4037');
      this.drawTriangle(x + 40, y, 100, 40, '#8d6e63');
      this.drawRect(x + 30, y + 80, 20, 40, '#3e2723');
      for (let j = 0; j < 2; j++) {
        for (let k = 0; k < 2; k++) {
          this.drawRect(x + 15 + j * 35, y + 15 + k * 25, 12, 12, '#fff9c4');
        }
      }
    }
    this.drawRect(50, 450, 2900, 70, '#8d6e63');
  },

  drawForestBackground() {
    for (let i = 0; i < 20; i++) {
      const x = i * 180 + 50;
      const y = 520;
      this.drawRect(x + 15, y - 100, 20, 100, '#5d4037');
      this.drawCircle(x + 25, y - 130, 50, '#2e7d32');
      this.drawCircle(x + 10, y - 110, 35, '#388e3c');
      this.drawCircle(x + 40, y - 110, 35, '#388e3c');
    }
    for (let i = 0; i < 30; i++) {
      const x = i * 120 + 30;
      const y = 510;
      this.drawCircle(x, y, 8, '#66bb6a');
      this.drawCircle(x + 10, y + 3, 6, '#81c784');
    }
  },

  drawMineBackground() {
    for (let i = 0; i < 15; i++) {
      const x = i * 220 + 80;
      this.drawRect(x, 0, 30, 520, '#4e342e');
      this.drawRect(x - 20, 0, 70, 30, '#5d4037');
      this.drawRect(x - 20, 490, 70, 30, '#5d4037');
    }
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 3000;
      const y = Math.random() * 400 + 50;
      this.drawCircle(x, y, 5, '#ffeb3b');
      this.drawCircle(x + 8, y + 3, 4, '#ffc107');
    }
  },

  drawSkyBackground() {
    for (let i = 0; i < 10; i++) {
      const x = (i * 350 + this.cameraX * 0.3) % 3500 - 200;
      const y = 80 + Math.sin(i * 0.8) * 40;
      this.drawEllipse(x, y, 80, 25, 'rgba(255, 255, 255, 0.8)');
      this.drawEllipse(x + 50, y - 10, 60, 20, 'rgba(255, 255, 255, 0.9)');
      this.drawEllipse(x - 30, y + 5, 50, 18, 'rgba(255, 255, 255, 0.7)');
    }
    for (let i = 0; i < 5; i++) {
      const x = i * 700 + 200;
      const y = 200;
      this.drawCircle(x, y, 40, 'rgba(255, 255, 255, 0.3)');
    }
  },

  drawTowerBackground() {
    for (let i = 0; i < 10; i++) {
      const x = i * 320 + 100;
      this.drawRect(x, 100, 60, 420, '#424242');
      this.drawRect(x + 10, 120, 40, 30, '#ff5722');
      this.drawRect(x + 10, 170, 40, 30, '#ff9800');
      for (let j = 0; j < 5; j++) {
        this.drawRect(x + 5, 220 + j * 50, 50, 5, '#212121');
      }
    }
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 3000;
      const y = Math.random() * 300 + 100;
      this.drawRect(x, y, 4, 4, '#4fc3f7');
    }
  },

  drawPlatform(platform, color) {
    this.drawGradientRect(platform.x, platform.y, platform.width, platform.height, 
      color, this.darkenColor(color, 15));
    this.drawStrokeRect(platform.x, platform.y, platform.width, platform.height, 
      this.lightenColor(color, 20), 2);
    
    if (platform.height > 50) {
      for (let i = 0; i < platform.width; i += 40) {
        this.drawLine(platform.x + i, platform.y + 5, platform.x + i + 20, platform.y + 5, 
          this.lightenColor(color, 10), 2);
      }
    }
  },

  drawPortal(portal) {
    const glowIntensity = Math.sin(Date.now() / 300) * 0.3 + 0.7;
    
    this.drawCircle(portal.x, portal.y - 30, 45, `rgba(100, 200, 255, ${glowIntensity * 0.3})`);
    this.drawCircle(portal.x, portal.y - 30, 35, `rgba(100, 200, 255, ${glowIntensity * 0.5})`);
    this.drawCircle(portal.x, portal.y - 30, 25, `rgba(150, 220, 255, ${glowIntensity * 0.7})`);
    
    this.drawText(portal.label, portal.x, portal.y - 80, '#4fc3f7', 14, 'center');
    
    const arrowY = portal.y - 55 + Math.sin(Date.now() / 200) * 3;
    this.drawTriangle(portal.x, arrowY, 12, 8, '#4fc3f7');
  },

  drawChest(chest) {
    const { x, y, opened, locked } = chest;
    
    if (opened) {
      this.drawRect(x - 25, y - 15, 50, 25, '#8d6e63');
      this.drawRect(x - 25, y - 35, 50, 10, '#6d4c41');
      this.drawRect(x - 5, y - 35, 10, 25, '#5d4037');
    } else {
      this.drawRect(x - 25, y - 25, 50, 35, '#8d6e63');
      this.drawRect(x - 25, y - 35, 50, 15, '#6d4c41');
      this.drawRect(x - 5, y - 25, 10, 15, '#5d4037');
      
      if (locked) {
        this.drawCircle(x, y - 15, 8, '#f1c40f');
        this.drawRect(x - 2, y - 18, 4, 6, '#5d4037');
      }
      
      const glow = Math.sin(Date.now() / 400) * 0.3 + 0.5;
      this.drawStrokeRect(x - 28, y - 38, 56, 53, 
        `rgba(241, 196, 15, ${glow})`, 2);
    }
  },

  drawNPC(npc) {
    const { x, y, name, type } = npc;
    const centerX = x + 20;
    const groundY = y + 60;
    
    this.drawShadow(centerX, groundY, 35);
    
    const colors = {
      shop: '#3498db',
      enhance: '#e67e22',
      quest: '#2ecc71',
      talent: '#9b59b6'
    };
    const color = colors[type] || '#95a5a6';
    
    this.drawRect(x, y + 20, 40, 40, color);
    this.drawCircle(centerX, y + 10, 15, '#ffdbac');
    this.drawCircle(centerX, y + 2, 12, this.darkenColor(color, 20));
    
    this.drawCircle(centerX - 5, y + 8, 2, '#000');
    this.drawCircle(centerX + 5, y + 8, 2, '#000');
    
    const bobOffset = Math.sin(Date.now() / 500) * 3;
    const exclaimY = y - 20 + bobOffset;
    this.drawCircle(centerX, exclaimY, 10, '#f1c40f');
    this.drawText('!', centerX, exclaimY, '#000', 14, 'center', 'middle');
    
    this.drawText(name, centerX, y - 35, '#fff', 12, 'center');
  },

  drawDamageText(text) {
    const screenPos = this.worldToScreen(text.x, text.y);
    const alpha = text.life / text.maxLife;
    
    let fontSize = 18;
    let color = '#fff';
    
    if (text.isCrit) {
      fontSize = 24;
      color = '#ff6b00';
    } else if (text.isMiss) {
      color = '#95a5a6';
    } else if (text.isHeal) {
      color = '#2ecc71';
    } else {
      color = '#e74c3c';
    }
    
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    
    if (text.isCrit) {
      this.drawText(text.value.toString(), screenPos.x + 1, screenPos.y + 1, '#000', fontSize, 'center');
      this.drawText(text.value.toString(), screenPos.x, screenPos.y, color, fontSize, 'center');
    } else {
      this.drawText(text.value.toString(), screenPos.x + 1, screenPos.y + 1, '#000', fontSize, 'center');
      this.drawText(text.value.toString(), screenPos.x, screenPos.y, color, fontSize, 'center');
    }
    
    this.ctx.restore();
  },

  drawFloatingText(text) {
    const screenPos = this.worldToScreen(text.x, text.y);
    const alpha = text.life / text.maxLife;
    
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.drawText(text.text, screenPos.x + 1, screenPos.y + 1, '#000', 14, 'center');
    this.drawText(text.text, screenPos.x, screenPos.y, text.color, 14, 'center');
    this.ctx.restore();
  },

  drawEffect(effect) {
    const progress = 1 - effect.life / effect.maxLife;
    
    if (effect.type === 'slash') {
      const alpha = 1 - progress;
      const length = 60 + progress * 20;
      const direction = effect.facingRight ? 1 : -1;
      
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.strokeStyle = '#fff';
      this.ctx.lineWidth = 4;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.arc(effect.x, effect.y, length * 0.6, 
        -Math.PI / 4 * direction, Math.PI / 4 * direction);
      this.ctx.stroke();
      
      this.ctx.strokeStyle = '#ffeb3b';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(effect.x, effect.y, length * 0.5, 
        -Math.PI / 4 * direction, Math.PI / 4 * direction);
      this.ctx.stroke();
      this.ctx.restore();
    } else if (effect.type === 'aoe') {
      const alpha = 1 - progress;
      const radius = effect.radius * (0.5 + progress * 0.5);
      
      this.ctx.save();
      this.ctx.globalAlpha = alpha * 0.3;
      this.drawCircle(effect.x, effect.y, radius, '#ff6b00');
      this.ctx.globalAlpha = alpha;
      this.drawStrokeCircle(effect.x, effect.y, radius, '#ffeb3b', 3);
      this.drawStrokeCircle(effect.x, effect.y, radius * 0.7, '#ff9800', 2);
      this.ctx.restore();
    } else if (effect.type === 'chain') {
      const alpha = 1 - progress;
      
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      
      const midX = (effect.x1 + effect.x2) / 2 + randomRange(-10, 10);
      const midY = (effect.y1 + effect.y2) / 2 + randomRange(-10, 10);
      
      this.ctx.strokeStyle = '#ffeb3b';
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.moveTo(effect.x1, effect.y1);
      this.ctx.quadraticCurveTo(midX, midY, effect.x2, effect.y2);
      this.ctx.stroke();
      
      this.ctx.strokeStyle = '#fff';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(effect.x1, effect.y1);
      this.ctx.quadraticCurveTo(midX, midY, effect.x2, effect.y2);
      this.ctx.stroke();
      
      this.drawCircle(effect.x1, effect.y1, 8, '#fff');
      this.drawCircle(effect.x2, effect.y2, 8, '#fff');
      this.ctx.restore();
    } else if (effect.type === 'death') {
      const alpha = 1 - progress;
      const size = effect.size * (1 + progress * 0.5);
      
      this.ctx.save();
      this.ctx.globalAlpha = alpha * 0.5;
      this.drawCircle(effect.x, effect.y, size * 0.5, effect.color);
      this.ctx.globalAlpha = alpha;
      
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const dist = progress * size;
        const px = effect.x + Math.cos(angle) * dist;
        const py = effect.y + Math.sin(angle) * dist;
        this.drawCircle(px, py, 6 * (1 - progress), effect.color);
      }
      this.ctx.restore();
    } else if (effect.type === 'chest_open') {
      const alpha = 1 - progress;
      const size = 30 + progress * 50;
      
      this.ctx.save();
      this.ctx.globalAlpha = alpha * 0.5;
      this.drawCircle(effect.x, effect.y - 20, size, '#f1c40f');
      this.ctx.globalAlpha = alpha;
      
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + progress * Math.PI;
        const dist = 40 + progress * 20;
        const px = effect.x + Math.cos(angle) * dist;
        const py = effect.y - 20 + Math.sin(angle) * dist;
        this.drawCircle(px, py, 5 * (1 - progress * 0.5), '#f39c12');
      }
      this.ctx.restore();
    } else if (effect.type === 'hit') {
      const size = 20 + progress * 30;
      const alpha = 1 - progress;
      this.drawStrokeCircle(effect.x, effect.y, size, `rgba(255, 255, 0, ${alpha})`, 3);
    } else if (effect.type === 'explosion') {
      const size = 30 + progress * 80;
      const alpha = 1 - progress;
      this.drawCircle(effect.x, effect.y, size * 0.6, `rgba(255, 100, 0, ${alpha * 0.5})`);
      this.drawStrokeCircle(effect.x, effect.y, size, `rgba(255, 200, 0, ${alpha})`, 4);
    } else if (effect.type === 'buff') {
      const size = 40 + Math.sin(progress * Math.PI) * 20;
      const alpha = 1 - progress;
      this.drawStrokeCircle(effect.x, effect.y, size, `rgba(100, 200, 255, ${alpha})`, 2);
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + progress * Math.PI;
        const px = effect.x + Math.cos(angle) * size;
        const py = effect.y + Math.sin(angle) * size;
        this.drawCircle(px, py, 4, `rgba(100, 200, 255, ${alpha})`);
      }
    } else if (effect.type === 'levelup') {
      const alpha = 1 - progress;
      const yOffset = -progress * 50;
      this.drawText('升级!', effect.x, effect.y + yOffset, '#f1c40f', 28, 'center');
      this.drawStrokeCircle(effect.x, effect.y + yOffset + 15, 30 + progress * 20, `rgba(241, 196, 15, ${alpha})`, 3);
    }
  }
};
