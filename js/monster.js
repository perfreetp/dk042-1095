class Monster {
  constructor(type, x, y) {
    this.type = type;
    this.data = GameData.monsters[type];
    this.x = x;
    this.y = y;
    this.currentHP = this.data.hp;
    this.maxHP = this.data.hp;
    this.isBoss = this.data.isBoss;
    this.isDummy = this.data.isDummy;
    this.facingRight = false;
    this.state = 'idle';
    this.hitFlash = 0;
    this.stunned = 0;
    this.slowed = 0;
    this.slowAmount = 1;
    this.attackCooldown = 0;
    this.debuffs = [];
    this.detectionRange = this.isBoss ? 400 : 200;
    this.attackRange = this.isBoss ? 80 : 50;
    this.projectileRange = this.isBoss ? 300 : 0;
    this.patrolX = x;
    this.patrolDirection = Math.random() > 0.5 ? 1 : -1;
    this.patrolTimer = 0;
    this.isDead = false;
    this.deathTimer = 0;
  }
  
  update(dt, player, platforms) {
    if (this.isDead) {
      this.deathTimer += dt * 1000;
      return this.deathTimer > 500;
    }
    
    if (this.hitFlash > 0) {
      this.hitFlash -= dt * 1000;
    }
    
    if (this.stunned > 0) {
      this.stunned -= dt * 1000;
      return false;
    }
    
    if (this.slowed > 0) {
      this.slowed -= dt * 1000;
      if (this.slowed <= 0) {
        this.slowAmount = 1;
      }
    }
    
    this.attackCooldown -= dt * 1000;
    
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
    
    if (this.isDummy) return false;
    
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < this.detectionRange) {
      this.state = 'chase';
      this.facingRight = dx > 0;
      
      if (dist > this.attackRange) {
        const speed = this.data.spd * 60 * dt * this.slowAmount;
        this.x += dx > 0 ? speed : -speed;
      } else if (this.attackCooldown <= 0) {
        this.state = 'attack';
        this.attackCooldown = this.isBoss ? 2000 : 1500;
        this.performAttack(player);
      }
    } else {
      this.state = 'patrol';
      this.patrolTimer -= dt * 1000;
      
      if (this.patrolTimer <= 0) {
        this.patrolDirection *= -1;
        this.patrolTimer = random(2000, 4000);
      }
      
      const speed = this.data.spd * 30 * dt * this.slowAmount;
      this.x += this.patrolDirection * speed;
      this.facingRight = this.patrolDirection > 0;
      
      if (Math.abs(this.x - this.patrolX) > 150) {
        this.patrolDirection *= -1;
      }
    }
    
    if (!this.data.flying) {
      let onGround = false;
      for (const platform of platforms) {
        if (this.x > platform.x && this.x < platform.x + platform.width &&
            this.y + this.data.size >= platform.y &&
            this.y + this.data.size <= platform.y + 10) {
          this.y = platform.y - this.data.size;
          onGround = true;
          break;
        }
      }
      if (!onGround) {
        this.y += 3;
      }
    }
    
    return false;
  }
  
  performAttack(player) {
    if (this.isBoss) {
      const attackType = randomInt(0, 2);
      
      if (attackType === 0) {
        player.takeDamage(this.data.atk * 1.5);
        Renderer.shake(8, 200);
      } else if (attackType === 1 && this.projectileRange > 0) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        SkillManager.projectiles.push({
          x: this.x,
          y: this.y - this.data.size / 2,
          vx: (dx / dist) * 6,
          vy: (dy / dist) * 6,
          damage: this.data.atk,
          isEnemy: true,
          range: this.projectileRange,
          distance: 0,
          skill: 'enemy'
        });
      } else {
        const aoeDamage = this.data.atk;
        const aoeRange = 100;
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        if (Math.sqrt(dx * dx + dy * dy) < aoeRange) {
          player.takeDamage(aoeDamage * 1.2);
          Renderer.shake(10, 300);
        }
        Game.addEffect({ type: 'explosion', x: this.x, y: this.y - this.data.size / 2, life: 500, maxLife: 500 });
      }
    } else {
      player.takeDamage(this.data.atk);
    }
  }
  
  takeDamage(damage, isMagic = false) {
    if (this.isDead) return 0;
    
    let actualDamage = isMagic ? damage : Math.max(1, damage - this.data.def * 0.5);
    
    this.currentHP -= actualDamage;
    this.hitFlash = 150;
    
    Game.addEffect({ type: 'hit', x: this.x, y: this.y - this.data.size / 2, life: 200, maxLife: 200 });
    
    createDamageText(this.x, this.y - this.data.size, actualDamage);
    
    if (this.currentHP <= 0 && !this.isDummy) {
      this.die();
    }
    
    return actualDamage;
  }
  
  applySlow(amount, duration) {
    this.slowAmount = amount;
    this.slowed = duration;
  }
  
  applyStun(duration) {
    this.stunned = duration;
  }
  
  addDebuff(debuff) {
    debuff.tickTimer = 0;
    this.debuffs.push(debuff);
  }
  
  die() {
    this.isDead = true;
    this.deathTimer = 0;
  }
  
  getRect() {
    return {
      x: this.x - this.data.size / 2,
      y: this.y - this.data.size,
      width: this.data.size,
      height: this.data.size
    };
  }
}
