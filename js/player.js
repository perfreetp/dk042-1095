class Player {
  constructor(name, classId, subClassId = null) {
    this.name = name;
    this.classId = classId;
    this.subClassId = subClassId;
    this.classData = GameData.classes[classId];
    
    this.x = 200;
    this.y = 450;
    this.width = 40;
    this.height = 60;
    this.vx = 0;
    this.vy = 0;
    this.facingRight = true;
    this.onGround = false;
    this.currentState = 'idle';
    
    this.level = 1;
    this.exp = 0;
    this.expToNext = getExpForLevel(1);
    this.gold = 50;
    this.talentPoints = 0;
    
    this.baseStats = { ...this.classData.baseStats };
    if (subClassId && this.classData.subClasses[subClassId]) {
      const bonus = this.classData.subClasses[subClassId].bonusStats;
      for (const stat in bonus) {
        this.baseStats[stat] = (this.baseStats[stat] || 0) + bonus[stat];
      }
    }
    
    this.maxHP = this.baseStats.hp;
    this.currentHP = this.maxHP;
    this.maxMP = this.baseStats.mp;
    this.currentMP = this.maxMP;
    
    this.talents = {};
    this.equipment = {
      weapon: null,
      armor: null,
      helmet: null,
      boots: null
    };
    
    this.inventory = [];
    this.quests = {};
    this.monsterCodex = {};
    
    this.skills = ['basic_attack', ...this.classData.skills];
    this.skillCooldowns = {};
    this.skills.forEach(s => this.skillCooldowns[s] = 0);
    
    this.comboCount = 0;
    this.comboTimer = 0;
    this.maxCombo = 0;
    
    this.buffs = [];
    this.debuffs = [];
    
    this.attackFrame = 0;
    this.invincible = 0;
    
    this.mapWidth = 3000;
  }
  
  getStats() {
    const stats = { ...this.baseStats };
    
    for (const slot in this.equipment) {
      const item = this.equipment[slot];
      if (item) {
        const itemData = GameData.items[item.itemId];
        if (itemData && itemData.stats) {
          for (const stat in itemData.stats) {
            stats[stat] = (stats[stat] || 0) + itemData.stats[stat];
          }
          if (item.enhanceLevel) {
            const enhanceBonus = Math.floor((itemData.stats.atk || itemData.stats.def || 0) * 0.15 * item.enhanceLevel);
            if (itemData.type === 'weapon') {
              stats.atk = (stats.atk || 0) + enhanceBonus;
            } else {
              stats.def = (stats.def || 0) + enhanceBonus;
            }
          }
        }
      }
    }
    
    for (const talentId in this.talents) {
      const level = this.talents[talentId];
      const talent = GameData.talents[talentId];
      if (talent) {
        for (let i = 0; i < level; i++) {
          for (const stat in talent.effect) {
            const value = talent.effect[stat];
            if (typeof value === 'number' && value > 1 && stat !== 'crit' && stat !== 'lifesteal' && stat !== 'critDamage') {
              stats[stat] = (stats[stat] || 0) * value;
            } else {
              stats[stat] = (stats[stat] || 0) + value;
            }
          }
        }
      }
    }
    
    for (const buff of this.buffs) {
      if (buff.atk) stats.atk = (stats.atk || 0) * buff.atk;
      if (buff.def) stats.def = (stats.def || 0) * buff.def;
      if (buff.evasion) stats.evasion = (stats.evasion || 0) + buff.evasion;
    }
    
    stats.hp = this.maxHP;
    stats.mp = this.maxMP;
    
    return stats;
  }
  
  update(dt, platforms) {
    const stats = this.getStats();
    const { dx } = Input.getDirection();
    
    if (dx !== 0) {
      this.vx = dx * stats.spd * 60 * dt;
      this.facingRight = dx > 0;
      this.currentState = 'walk';
    } else {
      this.vx = 0;
      this.currentState = 'idle';
    }
    
    if (Input.isJumpPressed() && this.onGround) {
      this.vy = -12;
      this.onGround = false;
      this.currentState = 'jump';
    }
    
    this.vy += 0.5;
    if (this.vy > 15) this.vy = 15;
    
    this.x += this.vx;
    this.y += this.vy;
    
    this.onGround = false;
    for (const platform of platforms) {
      if (this.checkPlatformCollision(platform)) {
        if (this.vy > 0 && this.y + this.height - this.vy <= platform.y + 5) {
          this.y = platform.y - this.height;
          this.vy = 0;
          this.onGround = true;
        }
      }
    }
    
    this.x = clamp(this.x, 0, this.mapWidth - this.width);
    if (this.y > 720) {
      this.respawn();
    }
    
    for (const skill in this.skillCooldowns) {
      if (this.skillCooldowns[skill] > 0) {
        this.skillCooldowns[skill] -= dt * 1000;
      }
    }
    
    this.buffs = this.buffs.filter(b => {
      b.duration -= dt * 1000;
      return b.duration > 0;
    });
    
    this.debuffs = this.debuffs.filter(d => {
      d.duration -= dt * 1000;
      if (d.damage && d.tickTimer !== undefined) {
        d.tickTimer -= dt * 1000;
        if (d.tickTimer <= 0) {
          this.takeDamage(d.damage, true);
          d.tickTimer = 1000;
        }
      }
      return d.duration > 0;
    });
    
    if (this.comboTimer > 0) {
      this.comboTimer -= dt * 1000;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
      }
    }
    
    if (this.attackFrame > 0) {
      this.attackFrame -= dt * 5;
    }
    
    if (this.invincible > 0) {
      this.invincible -= dt * 1000;
    }
    
    this.currentMP = Math.min(this.maxMP, this.currentMP + 5 * dt);
  }
  
  checkPlatformCollision(platform) {
    return this.x < platform.x + platform.width &&
           this.x + this.width > platform.x &&
           this.y < platform.y + platform.height &&
           this.y + this.height > platform.y;
  }
  
  attack() {
    if (this.attackFrame > 0) return null;
    
    this.attackFrame = 1;
    this.comboCount++;
    this.comboTimer = 2000;
    this.maxCombo = Math.max(this.maxCombo, this.comboCount);
    
    const stats = this.getStats();
    const comboMultiplier = 1 + Math.min(this.comboCount * 0.1, 0.5);
    
    return {
      damage: stats.atk * comboMultiplier,
      range: 60,
      x: this.x + (this.facingRight ? this.width : 0),
      y: this.y + this.height / 2,
      critChance: stats.crit,
      critDamage: stats.critDamage || 2,
      lifesteal: stats.lifesteal || 0
    };
  }
  
  useSkill(skillIndex) {
    if (skillIndex < 0 || skillIndex >= this.skills.length) return null;
    
    const skillId = this.skills[skillIndex];
    const skill = GameData.skills[skillId];
    
    if (!skill) return null;
    if (this.skillCooldowns[skillId] > 0) return null;
    if (this.currentMP < skill.mpCost) {
      showNotification('魔力不足！', 'error');
      return null;
    }
    
    this.skillCooldowns[skillId] = skill.cooldown;
    this.currentMP -= skill.mpCost;
    this.attackFrame = 1;
    
    const stats = this.getStats();
    
    if (skill.buff) {
      this.addBuff({ ...skill.buff });
      Game.addEffect({ type: 'buff', x: this.x + this.width / 2, y: this.y, life: 1000, maxLife: 1000 });
      return { type: 'buff', skillId };
    }
    
    if (skill.teleport) {
      const teleportDistance = 150;
      this.x += this.facingRight ? teleportDistance : -teleportDistance;
      this.x = clamp(this.x, 0, this.mapWidth - this.width);
      if (skill.buff) this.addBuff({ ...skill.buff });
      return { type: 'teleport', skillId };
    }
    
    if (skill.projectile) {
      return {
        type: 'projectile',
        skillId,
        x: this.x + (this.facingRight ? this.width : 0),
        y: this.y + this.height / 2,
        vx: (this.facingRight ? 1 : -1) * 12,
        vy: 0,
        damage: stats.atk * skill.damage,
        range: skill.range,
        slow: skill.slow,
        critChance: stats.crit,
        critDamage: stats.critDamage || 2
      };
    }
    
    if (skill.projectiles) {
      const projectiles = [];
      const spread = 0.2;
      for (let i = 0; i < skill.projectiles; i++) {
        const angle = (i - (skill.projectiles - 1) / 2) * spread;
        projectiles.push({
          type: 'projectile',
          skillId,
          x: this.x + (this.facingRight ? this.width : 0),
          y: this.y + this.height / 2,
          vx: (this.facingRight ? 1 : -1) * 12 * Math.cos(angle),
          vy: 12 * Math.sin(angle),
          damage: stats.atk * skill.damage,
          range: skill.range,
          critChance: stats.crit,
          critDamage: stats.critDamage || 2
        });
      }
      return { type: 'multi_projectile', projectiles, skillId };
    }
    
    if (skill.aoe) {
      return {
        type: 'aoe',
        skillId,
        x: this.x + this.width / 2 + (this.facingRight ? skill.range / 2 : -skill.range / 2),
        y: this.y + this.height / 2,
        radius: skill.range / 2,
        damage: stats.atk * skill.damage,
        critChance: stats.crit,
        critDamage: stats.critDamage || 2
      };
    }
    
    if (skill.chain) {
      return {
        type: 'chain',
        skillId,
        x: this.x + (this.facingRight ? this.width : 0),
        y: this.y + this.height / 2,
        damage: stats.atk * skill.damage,
        range: skill.range,
        chains: skill.chain,
        critChance: stats.crit,
        critDamage: stats.critDamage || 2
      };
    }
    
    if (skill.stun) {
      return {
        type: 'melee',
        skillId,
        damage: stats.atk * skill.damage,
        range: skill.range,
        x: this.x + (this.facingRight ? this.width : 0),
        y: this.y + this.height / 2,
        stun: skill.stun,
        critChance: stats.crit,
        critDamage: stats.critDamage || 2
      };
    }
    
    if (skill.dot) {
      return {
        type: 'melee',
        skillId,
        damage: stats.atk * skill.damage,
        range: skill.range,
        x: this.x + (this.facingRight ? this.width : 0),
        y: this.y + this.height / 2,
        dot: {
          damage: stats.atk * skill.dot.damage,
          duration: skill.dot.duration
        },
        critChance: stats.crit,
        critDamage: stats.critDamage || 2
      };
    }
    
    if (skill.requireBehind) {
      return {
        type: 'backstab',
        skillId,
        damage: stats.atk * skill.damage,
        range: skill.range,
        x: this.x + (this.facingRight ? this.width : 0),
        y: this.y + this.height / 2,
        critChance: stats.crit + 30,
        critDamage: (stats.critDamage || 2) * 1.5
      };
    }
    
    return null;
  }
  
  takeDamage(damage, ignoreDefense = false) {
    if (this.invincible > 0) return 0;
    
    const stats = this.getStats();
    const evasion = stats.evasion || 0;
    
    if (Math.random() * 100 < evasion) {
      createDamageText(this.x + this.width / 2, this.y, 0, false, true);
      return 0;
    }
    
    let actualDamage = ignoreDefense ? damage : Math.max(1, damage - stats.def * 0.5);
    this.currentHP -= actualDamage;
    
    createDamageText(this.x + this.width / 2, this.y, actualDamage);
    this.invincible = 500;
    Renderer.shake(5, 100);
    
    if (this.currentHP <= 0) {
      this.currentHP = 0;
      this.onDeath();
    }
    
    return actualDamage;
  }
  
  heal(amount) {
    const oldHP = this.currentHP;
    this.currentHP = Math.min(this.maxHP, this.currentHP + amount);
    const healed = this.currentHP - oldHP;
    if (healed > 0) {
      createDamageText(this.x + this.width / 2, this.y, healed, false, false, true);
    }
    return healed;
  }
  
  restoreMP(amount) {
    this.currentMP = Math.min(this.maxMP, this.currentMP + amount);
  }
  
  addBuff(buff) {
    this.buffs.push(buff);
  }
  
  addDebuff(debuff) {
    debuff.tickTimer = 0;
    this.debuffs.push(debuff);
  }
  
  gainExp(amount) {
    const stats = this.getStats();
    const bonus = stats.expBonus || 1;
    const actualExp = Math.floor(amount * bonus);
    
    this.exp += actualExp;
    createFloatingText(this.x + this.width / 2, this.y - 20, `+${actualExp} EXP`, '#f1c40f');
    
    while (this.exp >= this.expToNext) {
      this.exp -= this.expToNext;
      this.levelUp();
    }
  }
  
  levelUp() {
    this.level++;
    this.talentPoints++;
    this.expToNext = getExpForLevel(this.level);
    
    const hpGain = Math.floor(this.baseStats.hp * 0.1);
    const mpGain = Math.floor(this.baseStats.mp * 0.1);
    const atkGain = Math.floor(this.baseStats.atk * 0.05);
    const defGain = Math.floor(this.baseStats.def * 0.05);
    
    this.baseStats.hp += hpGain;
    this.baseStats.mp += mpGain;
    this.baseStats.atk += atkGain;
    this.baseStats.def += defGain;
    
    this.maxHP = this.baseStats.hp;
    this.maxMP = this.baseStats.mp;
    this.currentHP = this.maxHP;
    this.currentMP = this.maxMP;
    
    Game.addEffect({ type: 'levelup', x: this.x + this.width / 2, y: this.y + this.height / 2, life: 1500, maxLife: 1500 });
    showNotification(`升级！等级 ${this.level}`, 'success');
  }
  
  gainGold(amount) {
    const stats = this.getStats();
    const bonus = stats.goldBonus || 1;
    const actualGold = Math.floor(amount * bonus);
    this.gold += actualGold;
    createFloatingText(this.x + this.width / 2, this.y, `+${actualGold} 金币`, '#f1c40f');
  }
  
  addItem(itemId, count = 1) {
    const existing = this.inventory.find(i => i.itemId === itemId);
    if (existing) {
      existing.count += count;
    } else {
      this.inventory.push({ itemId, count, enhanceLevel: 0 });
    }
    
    const itemData = GameData.items[itemId];
    if (itemData) {
      showNotification(`获得 ${itemData.name} x${count}`, 'success');
    }
    
    Quests.checkCollect(this, itemId, count);
  }
  
  removeItem(itemId, count = 1) {
    const index = this.inventory.findIndex(i => i.itemId === itemId);
    if (index === -1) return false;
    
    if (this.inventory[index].count > count) {
      this.inventory[index].count -= count;
    } else {
      this.inventory.splice(index, 1);
    }
    return true;
  }
  
  hasItem(itemId, count = 1) {
    const item = this.inventory.find(i => i.itemId === itemId);
    return item && item.count >= count;
  }
  
  equipItem(itemIndex) {
    const item = this.inventory[itemIndex];
    if (!item) return false;
    
    const itemData = GameData.items[item.itemId];
    if (!itemData) return false;
    
    const slot = itemData.type;
    if (!['weapon', 'armor', 'helmet', 'boots'].includes(slot)) return false;
    
    const oldItem = this.equipment[slot];
    if (oldItem) {
      this.inventory.push(oldItem);
    }
    
    this.equipment[slot] = item;
    this.inventory.splice(itemIndex, 1);
    
    showNotification(`已装备 ${itemData.name}`, 'success');
    return true;
  }
  
  useItem(itemIndex) {
    const item = this.inventory[itemIndex];
    if (!item) return false;
    
    const itemData = GameData.items[item.itemId];
    if (!itemData || itemData.type !== 'consumable') return false;
    
    if (itemData.effect.hp) {
      this.heal(itemData.effect.hp);
    }
    if (itemData.effect.mp) {
      this.restoreMP(itemData.effect.mp);
    }
    if (itemData.effect.teleport) {
      Game.changeRegion(itemData.effect.teleport);
    }
    
    this.removeItem(item.itemId, 1);
    return true;
  }
  
  learnTalent(talentId) {
    const talent = GameData.talents[talentId];
    if (!talent) return false;
    
    const currentLevel = this.talents[talentId] || 0;
    if (currentLevel >= talent.maxLevel) {
      showNotification('天赋已达最高等级', 'warning');
      return false;
    }
    
    if (this.talentPoints < talent.cost) {
      showNotification('天赋点数不足', 'error');
      return false;
    }
    
    this.talentPoints -= talent.cost;
    this.talents[talentId] = currentLevel + 1;
    
    showNotification(`学习了 ${talent.name} Lv.${currentLevel + 1}`, 'success');
    return true;
  }
  
  onDeath() {
    showNotification('你被击败了...', 'error');
    setTimeout(() => this.respawn(), 2000);
  }
  
  respawn() {
    this.x = 200;
    this.y = 450;
    this.currentHP = this.maxHP;
    this.currentMP = this.maxMP;
    this.vx = 0;
    this.vy = 0;
    Game.changeRegion('town');
  }
  
  discoverMonster(monsterId) {
    if (!this.monsterCodex[monsterId]) {
      this.monsterCodex[monsterId] = { kills: 0, firstKill: Date.now() };
      const monster = GameData.monsters[monsterId];
      if (monster) {
        showNotification(`图鉴：发现 ${monster.name}`, 'success');
      }
    }
    this.monsterCodex[monsterId].kills++;
  }
  
  getRect() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}
