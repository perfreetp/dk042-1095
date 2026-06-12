const Game = {
  state: 'menu',
  player: null,
  effects: [],
  damageTexts: [],
  floatingTexts: [],
  
  lastTime: 0,
  deltaTime: 0,
  
  levelStartTime: 0,
  levelDrops: [],
  levelStartGold: 0,
  levelStartTotalExp: 0,
  levelMonstersKilled: {},
  levelItemsPickedUp: {},
  levelGoldPickedUp: 0,
  levelExpGained: 0,
  paused: false,
  
  init() {
    Renderer.init();
    Input.init();
    SkillManager.init();
    ItemManager.init();
    MapManager.init();
    Quests.init();
    UI.init();
    
    this.effects = [];
    this.damageTexts = [];
    this.floatingTexts = [];
    
    requestAnimationFrame((time) => this.gameLoop(time));
  },
  
  gameLoop(currentTime) {
    this.deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;
    
    if (this.state === 'playing' && !this.paused) {
      this.update(this.deltaTime);
    }
    
    this.render();
    Input.update();
    
    requestAnimationFrame((time) => this.gameLoop(time));
  },
  
  update(dt) {
    if (!this.player) return;
    
    this.player.update(dt, MapManager.platforms);
    MapManager.update(dt, this.player);
    SkillManager.update(dt, this.player, MapManager.monsters);
    ItemManager.update(dt, this.player, MapManager.platforms);
    
    this.handlePlayerAttack();
    this.handleSkillUse();
    this.handleInteraction();
    this.handleUIInput();
    
    this.effects = this.effects.filter(e => {
      e.life -= dt * 1000;
      return e.life > 0;
    });
    
    this.damageTexts = this.damageTexts.filter(t => {
      t.life -= dt * 1000;
      t.y -= 30 * dt;
      return t.life > 0;
    });
    
    this.floatingTexts = this.floatingTexts.filter(t => {
      t.life -= dt * 1000;
      t.y -= 25 * dt;
      return t.life > 0;
    });
    
    Renderer.follow(this.player, MapManager.mapWidth);
    
    if (this.player.currentHP <= 0) {
      this.endLevel(false);
    }
  },
  
  handlePlayerAttack() {
    if (Input.isAttackPressed() && this.player.currentHP > 0) {
      const attack = this.player.attack();
      if (attack) {
        this.processMeleeAttack(attack, this.player, MapManager.monsters);
      }
    }
  },
  
  handleSkillUse() {
    const skillIndex = Input.getSkillKey();
    if (skillIndex >= 0 && this.player.currentHP > 0) {
      const result = this.player.useSkill(skillIndex);
      if (result) {
        this.processSkillResult(result, this.player, MapManager.monsters);
      }
    }
  },
  
  processSkillResult(result, player, monsters) {
    if (result.type === 'projectile') {
      SkillManager.projectiles.push(result);
    } else if (result.type === 'multi_projectile') {
      SkillManager.projectiles.push(...result.projectiles);
    } else if (result.type === 'aoe') {
      this.processAOEAttack(result, player, monsters);
    } else if (result.type === 'chain') {
      this.processChainAttack(result, player, monsters);
    } else if (result.type === 'melee' || result.type === 'backstab') {
      this.processMeleeAttack(result, player, monsters);
    } else if (result.type === 'buff') {
      const skill = GameData.skills[result.skillId];
      if (skill && skill.buff) {
        player.addBuff({ ...skill.buff });
      }
    }
  },
  
  processMeleeAttack(attack, player, monsters) {
    for (const monster of monsters) {
      if (monster.isDead) continue;
      
      const dx = monster.x - attack.x;
      const dy = (monster.y - monster.data.size / 2) - attack.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < attack.range + monster.data.size) {
        const isBehind = attack.type === 'backstab' && 
          ((player.facingRight && dx < 0) || (!player.facingRight && dx > 0));
        
        if (attack.type === 'backstab' && !isBehind) continue;
        
        SkillManager.hitMonster(monster, attack, player);
        
        if (attack.stun) {
          monster.applyStun(attack.stun);
        }
        if (attack.dot) {
          monster.addDebuff({ ...attack.dot });
        }
        
        if (monster.isDead) {
          this.onMonsterDeath(monster);
        }
      }
    }
    
    this.addEffect({
      type: 'slash',
      x: attack.x,
      y: attack.y,
      facingRight: player.facingRight,
      life: 200,
      maxLife: 200
    });
  },
  
  processAOEAttack(attack, player, monsters) {
    for (const monster of monsters) {
      if (monster.isDead) continue;
      
      const dx = monster.x - attack.x;
      const dy = (monster.y - monster.data.size / 2) - attack.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < attack.radius + monster.data.size) {
        SkillManager.hitMonster(monster, attack, player);
        
        if (monster.isDead) {
          this.onMonsterDeath(monster);
        }
      }
    }
    
    this.addEffect({
      type: 'aoe',
      x: attack.x,
      y: attack.y,
      radius: attack.radius,
      life: 300,
      maxLife: 300
    });
    
    Renderer.shake(8, 200);
  },
  
  processChainAttack(attack, player, monsters) {
    let targets = [...monsters].filter(m => !m.isDead);
    let currentX = attack.x;
    let currentY = attack.y;
    let chainsLeft = attack.chains;
    
    while (chainsLeft > 0 && targets.length > 0) {
      let nearest = null;
      let nearestDist = Infinity;
      
      for (const monster of targets) {
        const dx = monster.x - currentX;
        const dy = (monster.y - monster.data.size / 2) - currentY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < attack.range && dist < nearestDist) {
          nearest = monster;
          nearestDist = dist;
        }
      }
      
      if (!nearest) break;
      
      this.addEffect({
        type: 'chain',
        x1: currentX,
        y1: currentY,
        x2: nearest.x,
        y2: nearest.y - nearest.data.size / 2,
        life: 200,
        maxLife: 200
      });
      
      SkillManager.hitMonster(nearest, attack, player);
      
      if (nearest.isDead) {
        this.onMonsterDeath(nearest);
      }
      
      currentX = nearest.x;
      currentY = nearest.y - nearest.data.size / 2;
      targets = targets.filter(t => t !== nearest);
      chainsLeft--;
    }
  },
  
  onMonsterDeath(monster) {
    this.player.discoverMonster(monster.type);
    Quests.checkKill(this.player, monster.type);
    this.recordMonsterKill(monster);
    
    const stats = this.player.getStats();
    const goldBonus = stats.goldBonus || 1;
    const expBonus = stats.expBonus || 1;
    
    const goldDrop = Math.floor(monster.data.gold * goldBonus);
    const expDrop = Math.floor(monster.data.exp * expBonus);
    
    const actualDrops = [];
    
    if (goldDrop > 0) {
      ItemManager.addDrop('gold', monster.x, monster.y - 20, Math.ceil(goldDrop / 10));
      actualDrops.push('gold');
    }
    
    if (expDrop > 0) {
      this.player.gainExp(expDrop);
      this.recordExpGained(expDrop);
    }
    
    for (const drop of monster.data.drops) {
      if (Math.random() < drop.chance) {
        ItemManager.addDrop(drop.item, monster.x + randomRange(-20, 20), monster.y - 20);
        actualDrops.push(drop.item);
      }
    }
    
    if (actualDrops.length > 0) {
      this.levelDrops.push({
        monster: monster.data.name,
        drops: actualDrops
      });
    }
    
    if (monster.isBoss) {
      const clearTime = Date.now() - this.levelStartTime;
      const maxCombo = this.player.maxCombo;
      const grade = UI.calculateGrade(clearTime, maxCombo);
      this.recordBossKill(monster.type, clearTime, grade);
      
      if (MapManager.currentRegion && MapManager.currentRegion.boss2 && !MapManager.bossDefeated) {
        MapManager.bossDefeated = true;
        showNotification('第一首领已击败！继续深入挑战第二首领！', 'success');
        this.awardBossBadge(monster.type);
      } else if (MapManager.currentRegion && MapManager.currentRegion.boss2 && MapManager.bossDefeated && !MapManager.boss2Defeated) {
        MapManager.boss2Defeated = true;
        this.awardBossBadge(monster.type);
        this.endLevel(true);
      } else {
        MapManager.bossDefeated = true;
        this.awardBossBadge(monster.type);
        this.endLevel(true);
      }
    }
    
    this.addEffect({
      type: 'death',
      x: monster.x,
      y: monster.y - monster.data.size / 2,
      color: monster.data.color,
      size: monster.data.size,
      life: 500,
      maxLife: 500
    });
  },
  
  handleInteraction() {
    if (!Input.isInteractPressed()) return;
    
    for (const npc of MapManager.npcs) {
      const dist = Math.abs(this.player.x - npc.x);
      if (dist < 80) {
        this.interactWithNPC(npc);
        return;
      }
    }
    
    for (const portal of MapManager.portals) {
      const dist = Math.abs(this.player.x - portal.x);
      if (dist < 50) {
        this.changeRegion(portal.to);
        return;
      }
    }
    
    for (const chest of MapManager.chests) {
      if (chest.opened) continue;
      const dist = Math.abs(this.player.x - chest.x);
      if (dist < 60) {
        this.openChest(chest);
        return;
      }
    }
  },
  
  interactWithNPC(npc) {
    if (npc.type === 'shop') {
      UI.showShop(npc);
    } else if (npc.type === 'enhance') {
      UI.showEnhance();
    } else if (npc.type === 'quest') {
      UI.showQuestPanel(npc);
    } else if (npc.type === 'talent') {
      UI.showTalentPanel();
    }
  },
  
  openChest(chest) {
    if (chest.locked && !this.player.hasItem('hidden_key')) {
      showNotification('需要隐藏宝箱钥匙才能打开', 'warning');
      return;
    }
    
    chest.opened = true;
    if (chest.locked) {
      this.player.removeItem('hidden_key');
    }
    
    const chestDrops = [];
    for (const item of chest.loot) {
      if (item === 'gold') {
        const amount = Math.floor(randomRange(50, 200));
        this.player.gainGold(amount);
        this.recordGoldPickup(amount);
        this.recordItemPickup('gold', 1);
        chestDrops.push('gold');
      } else {
        this.player.addItem(item);
        this.recordItemPickup(item, 1);
        chestDrops.push(item);
      }
    }
    
    if (chestDrops.length > 0) {
      this.levelDrops.push({ monster: '宝箱', drops: chestDrops });
    }
    
    this.addEffect({
      type: 'chest_open',
      x: chest.x,
      y: chest.y,
      life: 500,
      maxLife: 500
    });
    
    showNotification('打开了宝箱！', 'success');
  },
  
  handleUIInput() {
    if (Input.isKeyPressed('KeyB') || Input.isKeyPressed('Tab')) {
      if (UI.currentPanel === 'inventory') {
        UI.closePanel();
      } else {
        UI.showInventory();
      }
    }
    
    if (Input.isKeyPressed('KeyQ')) {
      if (UI.currentPanel === 'quest') {
        UI.closePanel();
      } else {
        UI.showQuestPanel(null);
      }
    }
    
    if (Input.isKeyPressed('KeyK')) {
      if (UI.currentPanel === 'skills') {
        UI.closePanel();
      } else {
        UI.showSkillPanel();
      }
    }
    
    if (Input.isKeyPressed('KeyM')) {
      if (UI.currentPanel === 'map') {
        UI.closePanel();
      } else {
        UI.showMap();
      }
    }
    
    if (Input.isKeyPressed('KeyL')) {
      if (UI.currentPanel === 'codex') {
        UI.closePanel();
      } else {
        UI.showCodex();
      }
    }
    
    if (Input.isKeyPressed('KeyF')) {
      if (UI.currentPanel === 'profile') {
        UI.closePanel();
      } else {
        UI.showCharacterProfile();
      }
    }
    
    if (Input.isEscapePressed()) {
      if (UI.currentPanel && UI.currentPanel !== 'main_menu') {
        UI.closePanel();
      } else if (this.state === 'playing') {
        this.paused = !this.paused;
        if (this.paused) {
          UI.showPauseMenu();
        } else {
          UI.closePanel();
        }
      }
    }
  },
  
  changeRegion(regionId) {
    const oldRegion = MapManager.currentRegion;
    
    const hasUndefeatedBoss = oldRegion && oldRegion.boss && !MapManager.bossDefeated && oldRegion.id !== 'town' && oldRegion.id !== 'training';
    const hasUndefeatedBoss2 = oldRegion && oldRegion.boss2 && !MapManager.boss2Defeated;
    if (hasUndefeatedBoss || hasUndefeatedBoss2) {
      showNotification('请先击败区域首领再离开', 'warning');
      return;
    }
    
    MapManager.loadRegion(regionId);
    this.player.mapWidth = MapManager.mapWidth;
    
    if (regionId === 'town') {
      this.player.x = 200;
    } else {
      const fromPortal = MapManager.portals.find(p => p.to === (oldRegion ? oldRegion.id : 'town'));
      this.player.x = fromPortal ? fromPortal.x : 200;
    }
    
    this.player.y = 450;
    this.player.vx = 0;
    this.player.vy = 0;
    
    ItemManager.drops = [];
    SkillManager.projectiles = [];
    
    if (regionId !== 'town' && regionId !== 'training') {
      this.startLevel();
    }
    
    Quests.loadForPlayer(this.player);
  },
  
  startLevel() {
    this.levelStartTime = Date.now();
    this.levelDrops = [];
    this.levelStartGold = this.player ? this.player.gold : 0;
    this.levelStartTotalExp = this.player ? this.player.getTotalExp() : 0;
    this.levelMonstersKilled = {};
    this.levelItemsPickedUp = {};
    this.levelGoldPickedUp = 0;
    this.levelExpGained = 0;
    this.player.comboCount = 0;
    this.player.maxCombo = 0;
  },

  recordMonsterKill(monster) {
    const type = monster.type;
    if (!this.levelMonstersKilled[type]) {
      this.levelMonstersKilled[type] = {
        name: monster.data.name,
        color: monster.data.color,
        isBoss: monster.isBoss,
        count: 0
      };
    }
    this.levelMonstersKilled[type].count++;
  },

  recordExpGained(amount) {
    this.levelExpGained += amount;
  },

  recordItemPickup(itemId, count = 1) {
    if (!this.levelItemsPickedUp[itemId]) {
      this.levelItemsPickedUp[itemId] = 0;
    }
    this.levelItemsPickedUp[itemId] += count;
  },

  recordGoldPickup(amount) {
    this.levelGoldPickedUp += amount;
  },

  endLevel(victory) {
    const clearTime = Date.now() - this.levelStartTime;
    const maxCombo = this.player.maxCombo;
    const goldChange = this.player.gold - this.levelStartGold;
    const expChange = this.player.getTotalExp() - this.levelStartTotalExp;
    
    const regionId = MapManager.currentRegion ? MapManager.currentRegion.id : '';
    const grade = victory ? UI.calculateGrade(clearTime, maxCombo) : null;
    
    UI.showLevelResult({
      victory,
      clearTime,
      maxCombo,
      drops: this.levelDrops,
      monstersKilled: this.levelMonstersKilled,
      itemsPickedUp: this.levelItemsPickedUp,
      goldPickedUp: this.levelGoldPickedUp,
      goldChange,
      expGained: expChange > 0 ? expChange : this.levelExpGained,
      grade,
      regionId
    });
    
    if (victory) {
      const region = MapManager.currentRegion;
      if (region && region.boss) {
        this.player.addItem('hidden_key');
      }
    }
    
    this.saveGame();
  },

  recordBossKill(bossType, clearTime, grade) {
    if (!this.player.bossRecords) {
      this.player.bossRecords = {};
    }
    
    const gradeOrder = { S: 5, A: 4, B: 3, C: 2, D: 1 };
    
    if (!this.player.bossRecords[bossType]) {
      this.player.bossRecords[bossType] = {
        killed: true,
        killCount: 1,
        bestGrade: grade,
        bestTime: clearTime,
        firstKill: Date.now()
      };
    } else {
      const rec = this.player.bossRecords[bossType];
      rec.killCount++;
      const oldBest = rec.bestGrade;
      if (!oldBest || gradeOrder[grade] > gradeOrder[oldBest]) {
        rec.bestGrade = grade;
      }
      if (clearTime < rec.bestTime) {
        rec.bestTime = clearTime;
      }
    }
    
    if (!this.player.totalKills) this.player.totalKills = 0;
    this.player.totalKills++;
  },

  awardBossBadge(bossType) {
    const badgeId = `badge_${bossType}`;
    if (GameData.items[badgeId] && !this.player.hasItem(badgeId)) {
      this.player.addItem(badgeId);
      showNotification(`🏅 获得首领徽章：${GameData.items[badgeId].name}！`, 'success');
    }
  },

  isRegionCleared(regionId) {
    const region = GameData.regions[regionId];
    if (!region || !region.boss) return true;
    
    const boss1Defeated = this.player.bossRecords && this.player.bossRecords[region.boss];
    if (!region.boss2) {
      return !!boss1Defeated;
    }
    
    const boss2Defeated = this.player.bossRecords && this.player.bossRecords[region.boss2];
    return !!boss1Defeated && !!boss2Defeated;
  },

  isBossDefeated(bossType) {
    return !!(this.player.bossRecords && this.player.bossRecords[bossType]);
  },

  getRegionBosses(regionId) {
    const region = GameData.regions[regionId];
    if (!region) return [];
    const bosses = [];
    if (region.boss) bosses.push(region.boss);
    if (region.boss2) bosses.push(region.boss2);
    return bosses;
  },
  
  startNewGame(playerName, classId, subClassId) {
    this.player = new Player(playerName, classId, subClassId);
    this.state = 'playing';
    
    const starterWeapon = {
      warrior: 'basic_sword',
      mage: 'basic_staff',
      archer: 'basic_bow',
      thief: 'basic_dagger'
    };
    
    this.player.addItem(starterWeapon[classId] || 'basic_sword');
    this.player.addItem('cloth_armor');
    this.player.addItem('hp_potion_small', 5);
    this.player.addItem('mp_potion_small', 3);
    
    MapManager.loadRegion('town');
    Quests.loadForPlayer(this.player);
    UI.showHUD();
    
    this.saveGame();
  },
  
  saveGame() {
    if (!this.player) return;
    
    const saveData = {
      player: {
        name: this.player.name,
        classId: this.player.classId,
        subClassId: this.player.subClassId,
        level: this.player.level,
        exp: this.player.exp,
        expToNext: this.player.expToNext,
        gold: this.player.gold,
        talentPoints: this.player.talentPoints,
        baseStats: this.player.baseStats,
        maxHP: this.player.maxHP,
        maxMP: this.player.maxMP,
        currentHP: this.player.currentHP,
        currentMP: this.player.currentMP,
        talents: this.player.talents,
        equipment: this.player.equipment,
        inventory: this.player.inventory,
        quests: this.player.quests,
        monsterCodex: this.player.monsterCodex,
        skills: this.player.skills,
        bossRecords: this.player.bossRecords,
        totalKills: this.player.totalKills,
        totalGoldEarned: this.player.totalGoldEarned
      },
      currentRegion: MapManager.currentRegion ? MapManager.currentRegion.id : 'town',
      timestamp: Date.now()
    };
    
    saveToStorage('player_save', saveData);
  },
  
  loadGame() {
    const saveData = loadFromStorage('player_save');
    if (!saveData) {
      showNotification('没有找到存档', 'error');
      return false;
    }
    
    const p = saveData.player;
    this.player = new Player(p.name, p.classId, p.subClassId);
    
    this.player.level = p.level;
    this.player.exp = p.exp;
    this.player.expToNext = p.expToNext;
    this.player.gold = p.gold;
    this.player.talentPoints = p.talentPoints;
    this.player.baseStats = p.baseStats;
    this.player.maxHP = p.maxHP;
    this.player.maxMP = p.maxMP;
    this.player.currentHP = p.currentHP;
    this.player.currentMP = p.currentMP;
    this.player.talents = p.talents;
    this.player.equipment = p.equipment;
    this.player.inventory = p.inventory;
    this.player.quests = p.quests;
    this.player.monsterCodex = p.monsterCodex;
    this.player.skills = p.skills;
    this.player.bossRecords = p.bossRecords || {};
    this.player.totalKills = p.totalKills || 0;
    this.player.totalGoldEarned = p.totalGoldEarned || 0;
    
    this.state = 'playing';
    MapManager.loadRegion(saveData.currentRegion || 'town');
    this.player.mapWidth = MapManager.mapWidth;
    Quests.loadForPlayer(this.player);
    UI.showHUD();
    
    showNotification('存档已加载', 'success');
    return true;
  },
  
  addEffect(effect) {
    this.effects.push(effect);
  },
  
  render() {
    if (this.state === 'menu') {
      Renderer.clear('#0a0a1a');
      return;
    }
    
    const region = MapManager.currentRegion;
    if (region) {
      Renderer.clear(region.bgColor);
    } else {
      Renderer.clear('#0a0a1a');
    }
    
    Renderer.begin();
    
    if (region) {
      Renderer.drawBackground(region);
    }
    
    for (const platform of MapManager.platforms) {
      Renderer.drawPlatform(platform, region ? region.groundColor : '#4a4a4a');
    }
    
    for (const portal of MapManager.portals) {
      Renderer.drawPortal(portal);
    }
    
    for (const chest of MapManager.chests) {
      Renderer.drawChest(chest);
    }
    
    for (const npc of MapManager.npcs) {
      Renderer.drawNPC(npc);
    }
    
    ItemManager.render();
    
    for (const monster of MapManager.monsters) {
      Renderer.drawMonster(monster);
    }
    
    if (this.player) {
      Renderer.drawPlayer(this.player);
    }
    
    SkillManager.render();
    
    for (const effect of this.effects) {
      Renderer.drawEffect(effect);
    }
    
    for (const text of this.damageTexts) {
      Renderer.drawDamageText(text);
    }
    
    for (const text of this.floatingTexts) {
      Renderer.drawFloatingText(text);
    }
    
    Renderer.end();
    
    if (this.state === 'playing' && !UI.currentPanel) {
      UI.renderHUD();
    }
  }
};

window.addEventListener('load', () => {
  Game.init();
});
