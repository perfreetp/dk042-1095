const MapManager = {
  currentRegion: null,
  platforms: [],
  monsters: [],
  npcs: [],
  portals: [],
  chests: [],
  bossSpawned: false,
  boss2Spawned: false,
  bossDefeated: false,
  boss2Defeated: false,
  mapWidth: 3000,

  init() {
    this.monsters = [];
    this.npcs = [];
    this.portals = [];
    this.chests = [];
    this.bossSpawned = false;
    this.boss2Spawned = false;
    this.bossDefeated = false;
    this.boss2Defeated = false;
  },

  loadRegion(regionId) {
    this.init();
    this.currentRegion = GameData.regions[regionId];
    
    if (!this.currentRegion) {
      console.error('Region not found:', regionId);
      return;
    }

    this.platforms = GameData.platforms[regionId] || [];
    this.mapWidth = 3000;

    const spawns = GameData.monsterSpawns[regionId] || [];
    for (const spawn of spawns) {
      this.monsters.push(new Monster(spawn.type, spawn.x, spawn.y));
    }

    if (this.currentRegion.npcs) {
      for (const npcId of this.currentRegion.npcs) {
        const npcData = GameData.npcs[npcId];
        if (npcData) {
          this.npcs.push({
            id: npcId,
            ...npcData,
            interacted: false
          });
        }
      }
    }

    this.portals = this.currentRegion.portals || [];
    this.chests = (this.currentRegion.chests || []).map(c => ({ ...c, opened: false }));

    if (regionId === 'town') {
      this.monsters = [];
    }

    showNotification(`进入 ${this.currentRegion.name}`, 'success');
  },

  update(dt, player) {
    const platforms = this.platforms;

    this.monsters = this.monsters.filter(monster => {
      return !monster.update(dt, player, platforms);
    });

    if (this.currentRegion && this.currentRegion.boss && !this.bossSpawned && !this.bossDefeated) {
      if (player.x > (this.currentRegion.bossX || 2000) - 200) {
        const bossType = this.currentRegion.boss;
        const bossX = this.currentRegion.bossX || 2000;
        const boss = new Monster(bossType, bossX, 495);
        this.monsters.push(boss);
        this.bossSpawned = true;
        showNotification(`首领出现：${GameData.monsters[bossType].name}！`, 'warning');
        Renderer.shake(15, 500);
      }
    }

    if (this.currentRegion && this.currentRegion.boss2 && !this.boss2Spawned && !this.boss2Defeated && this.bossDefeated) {
      if (player.x > (this.currentRegion.boss2X || 2600) - 200) {
        const bossType = this.currentRegion.boss2;
        const bossX = this.currentRegion.boss2X || 2600;
        const boss = new Monster(bossType, bossX, 495);
        this.monsters.push(boss);
        this.boss2Spawned = true;
        showNotification(`首领出现：${GameData.monsters[bossType].name}！`, 'warning');
        Renderer.shake(15, 500);
      }
    }

    if (player.x < 0) player.x = 0;
    if (player.x > this.mapWidth - player.width) player.x = this.mapWidth - player.width;
  },

  renderBackground() {
    if (!this.currentRegion) return;

    const region = this.currentRegion;
    const ctx = Renderer.ctx;
    const camX = Renderer.cameraX;
    const camY = Renderer.cameraY;

    const gradient = ctx.createLinearGradient(0, 0, 0, Renderer.height);
    gradient.addColorStop(0, Renderer.lightenColor(region.bgColor, 30));
    gradient.addColorStop(1, region.bgColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, Renderer.width, Renderer.height);

    if (region.id === 'town') {
      ctx.fillStyle = 'rgba(135, 206, 235, 0.3)';
      for (let i = 0; i < 5; i++) {
        const x = (i * 300 - camX * 0.2) % (Renderer.width + 200) - 100;
        const y = 50 + i * 20;
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.arc(x + 25, y - 10, 25, 0, Math.PI * 2);
        ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.fillStyle = '#8b4513';
      for (let i = 0; i < 8; i++) {
        const x = 100 + i * 150 - camX * 0.5;
        if (x > -100 && x < Renderer.width + 100) {
          ctx.fillRect(x, 400, 80, 100);
          ctx.fillStyle = '#a0522d';
          ctx.beginPath();
          ctx.moveTo(x - 10, 400);
          ctx.lineTo(x + 40, 350);
          ctx.lineTo(x + 90, 400);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#8b4513';
          ctx.fillRect(x + 30, 460, 20, 40);
        }
      }
      
      ctx.fillStyle = '#4169e1';
      ctx.fillRect(0, 480, Renderer.width, 40);
    } else if (region.id === 'forest') {
      ctx.fillStyle = 'rgba(34, 139, 34, 0.2)';
      for (let i = 0; i < 15; i++) {
        const x = (i * 200 - camX * 0.3) % (Renderer.width + 200) - 100;
        const h = 150 + Math.sin(i) * 30;
        ctx.fillRect(x + 15, 520 - h + 20, 20, h - 20);
        ctx.beginPath();
        ctx.moveTo(x, 520 - h + 20);
        ctx.lineTo(x + 25, 520 - h - 40);
        ctx.lineTo(x + 50, 520 - h + 20);
        ctx.closePath();
        ctx.fill();
      }
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let i = 0; i < 20; i++) {
        const x = (i * 180 - camX * 0.1) % (Renderer.width + 100) - 50;
        ctx.fillRect(x, 0, 2, Renderer.height);
      }
    } else if (region.id === 'mine') {
      ctx.fillStyle = '#1a0f0f';
      ctx.fillRect(0, 0, Renderer.width, Renderer.height);
      
      ctx.fillStyle = '#2d2d2d';
      for (let i = 0; i < 30; i++) {
        const x = (i * 150 - camX * 0.1) % (Renderer.width + 100) - 50;
        const y = 50 + (i % 3) * 100;
        ctx.beginPath();
        ctx.arc(x, y, 3 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.fillStyle = '#ffd700';
      for (let i = 0; i < 10; i++) {
        const x = (i * 250 - camX * 0.4) % (Renderer.width + 100) - 50;
        const y = 200 + (i % 2) * 150;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (region.id === 'sky') {
      ctx.fillStyle = '#87ceeb';
      ctx.fillRect(0, 0, Renderer.width, Renderer.height);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 8; i++) {
        const x = (i * 200 - camX * 0.15 + Date.now() * 0.01) % (Renderer.width + 200) - 100;
        const y = 80 + (i % 3) * 60;
        ctx.beginPath();
        ctx.arc(x, y, 35, 0, Math.PI * 2);
        ctx.arc(x + 30, y - 15, 30, 0, Math.PI * 2);
        ctx.arc(x + 60, y, 35, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (region.id === 'tower') {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, Renderer.width, Renderer.height);
      
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) {
        const x = (i * 100 - camX * 0.3) % (Renderer.width + 100) - 50;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, Renderer.height);
        ctx.stroke();
      }
      
      ctx.fillStyle = '#00ffff';
      for (let i = 0; i < 15; i++) {
        const x = (i * 180 - camX * 0.5 + Date.now() * 0.02) % (Renderer.width + 100) - 50;
        const y = 100 + (i % 4) * 120;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (region.id === 'training') {
      ctx.fillStyle = '#2d2d2d';
      ctx.fillRect(0, 0, Renderer.width, Renderer.height);
      
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, Renderer.width, Renderer.height);
    }
  },

  render() {
    if (!this.currentRegion) return;

    const region = this.currentRegion;

    for (const platform of this.platforms) {
      Renderer.drawGradientRect(
        platform.x, platform.y, 
        platform.width, platform.height,
        region.groundColor,
        Renderer.darkenColor(region.groundColor, 20)
      );
      Renderer.drawStrokeRect(
        platform.x, platform.y,
        platform.width, platform.height,
        'rgba(0, 0, 0, 0.3)',
        1
      );
    }

    for (const npc of this.npcs) {
      this.renderNPC(npc);
    }

    for (const portal of this.portals) {
      this.renderPortal(portal);
    }

    for (const chest of this.chests) {
      if (!chest.opened) {
        this.renderChest(chest);
      }
    }

    for (const monster of this.monsters) {
      Renderer.drawMonster(monster);
    }
  },

  renderNPC(npc) {
    const { x, y, name, type } = npc;
    
    Renderer.drawShadow(x, y + 40, 40);
    Renderer.drawCircle(x, y - 10, 20, '#3498db');
    Renderer.drawCircle(x, y - 30, 15, '#ffdbac');
    Renderer.drawCircle(x, y - 35, 12, '#8b4513');
    
    let bodyColor = '#2ecc71';
    if (type === 'shop') bodyColor = '#f39c12';
    if (type === 'enhance') bodyColor = '#e74c3c';
    if (type === 'quest') bodyColor = '#9b59b6';
    if (type === 'talent') bodyColor = '#3498db';
    
    Renderer.drawRect(x - 18, y, 36, 40, bodyColor);
    
    const player = Game.player;
    if (player) {
      const dx = player.x - x;
      const dy = player.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        Renderer.drawText(`按 E 交互`, x, y - 70, '#f1c40f', 12, 'center');
      }
    }
    
    Renderer.drawText(name, x, y + 50, '#fff', 14, 'center');
    
    const exclaimY = y - 60 + Math.sin(Date.now() / 300) * 3;
    Renderer.drawText('!', x, exclaimY, '#f1c40f', 24, 'center', 'middle');
  },

  renderPortal(portal) {
    const { x, y, label } = portal;
    const glow = Math.sin(Date.now() / 200) * 0.3 + 0.7;
    
    Renderer.drawCircle(x, y, 35, `rgba(100, 200, 255, ${glow * 0.3})`);
    Renderer.drawStrokeCircle(x, y, 30, `rgba(100, 200, 255, ${glow})`, 3);
    Renderer.drawStrokeCircle(x, y, 20, `rgba(255, 255, 255, ${glow * 0.5})`, 2);
    
    for (let i = 0; i < 6; i++) {
      const angle = (Date.now() / 500 + i * Math.PI / 3) % (Math.PI * 2);
      const px = x + Math.cos(angle) * 25;
      const py = y + Math.sin(angle) * 25;
      Renderer.drawCircle(px, py, 3, '#fff');
    }
    
    const player = Game.player;
    if (player) {
      const dx = player.x + player.width / 2 - x;
      const dy = player.y + player.height / 2 - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 60) {
        Renderer.drawText(`按 E ${label}`, x, y - 50, '#4fc3f7', 12, 'center');
      }
    }
  },

  renderChest(chest) {
    const { x, y, locked } = chest;
    
    Renderer.drawShadow(x, y + 25, 35);
    Renderer.drawRect(x - 20, y, 40, 25, locked ? '#8b4513' : '#d2691e');
    Renderer.drawRect(x - 22, y - 15, 44, 18, locked ? '#a0522d' : '#cd853f');
    Renderer.drawStrokeRect(x - 22, y - 15, 44, 18, 'rgba(0, 0, 0, 0.5)', 1);
    
    if (locked) {
      Renderer.drawCircle(x, y - 5, 5, '#f1c40f');
      Renderer.drawRect(x - 2, y - 5, 4, 8, '#f39c12');
    } else {
      Renderer.drawCircle(x, y - 5, 5, '#2ecc71');
    }
    
    const player = Game.player;
    if (player) {
      const dx = player.x + player.width / 2 - x;
      const dy = player.y + player.height / 2 - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 50) {
        Renderer.drawText(locked ? '按 E 开启宝箱 (需要钥匙)' : '按 E 开启宝箱', x, y - 35, '#f1c40f', 12, 'center');
      }
    }
  },

  checkInteraction(player) {
    if (!Input.isInteractPressed()) return;

    for (const npc of this.npcs) {
      const dx = player.x + player.width / 2 - npc.x;
      const dy = player.y + player.height / 2 - npc.y;
      if (Math.sqrt(dx * dx + dy * dy) < 80) {
        this.handleNPCInteraction(npc, player);
        return;
      }
    }

    for (const portal of this.portals) {
      const dx = player.x + player.width / 2 - portal.x;
      const dy = player.y + player.height / 2 - portal.y;
      if (Math.sqrt(dx * dx + dy * dy) < 60) {
        Game.changeRegion(portal.to);
        return;
      }
    }

    for (const chest of this.chests) {
      if (chest.opened) continue;
      const dx = player.x + player.width / 2 - chest.x;
      const dy = player.y + player.height / 2 - chest.y;
      if (Math.sqrt(dx * dx + dy * dy) < 50) {
        this.openChest(chest, player);
        return;
      }
    }
  },

  handleNPCInteraction(npc, player) {
    switch (npc.type) {
      case 'shop':
        UI.openShop();
        break;
      case 'enhance':
        UI.openEnhance();
        break;
      case 'quest':
        UI.openQuests();
        break;
      case 'talent':
        UI.openTalents();
        break;
    }
  },

  openChest(chest, player) {
    if (chest.locked && !player.hasItem('hidden_key')) {
      showNotification('需要隐藏宝箱钥匙！', 'error');
      return;
    }

    if (chest.locked) {
      player.removeItem('hidden_key', 1);
    }

    chest.opened = true;
    showNotification('开启宝箱！', 'success');
    Renderer.shake(5, 200);

    for (const item of chest.loot) {
      if (item === 'gold') {
        player.gainGold(randomInt(50, 200));
      } else {
        player.addItem(item);
      }
    }

    Game.addEffect({ type: 'buff', x: chest.x, y: chest.y - 20, life: 800, maxLife: 800 });
  },

  respawnMonsters() {
    if (!this.currentRegion || this.currentRegion.id === 'town') return;
    
    const spawns = GameData.monsterSpawns[this.currentRegion.id] || [];
    for (const spawn of spawns) {
      if (!this.monsters.some(m => !m.isDead && Math.abs(m.x - spawn.x) < 50)) {
        this.monsters.push(new Monster(spawn.type, spawn.x, spawn.y));
      }
    }
  }
};
