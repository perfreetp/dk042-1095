const SkillManager = {
  projectiles: [],
  effects: [],
  
  init() {
    this.projectiles = [];
    this.effects = [];
  },
  
  update(dt, player, monsters) {
    this.projectiles = this.projectiles.filter(p => {
      p.x += p.vx * 60 * dt;
      p.y += p.vy * 60 * dt;
      p.distance += Math.abs(p.vx * 60 * dt) + Math.abs(p.vy * 60 * dt);
      
      if (p.distance > p.range) {
        return false;
      }
      
      if (p.isEnemy) {
        const playerRect = player.getRect();
        const dx = p.x - (playerRect.x + playerRect.width / 2);
        const dy = p.y - (playerRect.y + playerRect.height / 2);
        if (Math.sqrt(dx * dx + dy * dy) < 25) {
          player.takeDamage(p.damage);
          return false;
        }
      } else {
        for (const monster of monsters) {
          if (monster.isDead) continue;
          
          const monsterRect = monster.getRect();
          const dx = p.x - monster.x;
          const dy = p.y - (monster.y - monster.data.size / 2);
          if (Math.sqrt(dx * dx + dy * dy) < monster.data.size) {
            this.hitMonster(monster, p, player);
            return false;
          }
        }
      }
      
      return true;
    });
    
    this.effects = this.effects.filter(e => {
      e.life -= dt * 1000;
      return e.life > 0;
    });
  },
  
  hitMonster(monster, attack, player) {
    const isCrit = Math.random() * 100 < (attack.critChance || 5);
    const critMultiplier = isCrit ? (attack.critDamage || 2) : 1;
    const damage = monster.takeDamage(attack.damage * critMultiplier);
    
    if (isCrit) {
      const screenPos = Renderer.worldToScreen(monster.x, monster.y);
      createDamageText(screenPos.x, screenPos.y - 40, damage, true);
    }
    
    if (attack.lifesteal) {
      player.heal(damage * attack.lifesteal / 100);
    }
    
    if (attack.slow) {
      monster.applySlow(attack.slow, 3000);
    }
    
    if (attack.stun) {
      monster.applyStun(attack.stun);
    }
    
    if (attack.dot) {
      monster.addDebuff({
        type: 'poison',
        damage: attack.dot.damage,
        duration: attack.dot.duration
      });
    }
    
  },
  
  processMeleeAttack(attack, monsters, player) {
    const hitMonsters = [];
    
    for (const monster of monsters) {
      if (monster.isDead) continue;
      
      const dx = monster.x - attack.x;
      const dy = (monster.y - monster.data.size / 2) - attack.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (attack.type === 'backstab') {
        const behindCheck = (player.facingRight && dx < 0) || (!player.facingRight && dx > 0);
        if (!behindCheck) continue;
      }
      
      if (dist < attack.range + monster.data.size / 2) {
        hitMonsters.push(monster);
      }
    }
    
    for (const monster of hitMonsters) {
      this.hitMonster(monster, attack, player);
    }
    
    return hitMonsters.length;
  },
  
  processAOEAttack(attack, monsters, player) {
    let hitCount = 0;
    
    for (const monster of monsters) {
      if (monster.isDead) continue;
      
      const dx = monster.x - attack.x;
      const dy = (monster.y - monster.data.size / 2) - attack.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < attack.radius + monster.data.size / 2) {
        this.hitMonster(monster, attack, player);
        hitCount++;
      }
    }
    
    Game.addEffect({ type: 'explosion', x: attack.x, y: attack.y, life: 500, maxLife: 500 });
    
    return hitCount;
  },
  
  processChainAttack(attack, monsters, player) {
    let currentPos = { x: attack.x, y: attack.y };
    let remainingChains = attack.chains;
    const hitMonsters = new Set();
    
    while (remainingChains > 0 && monsters.length > 0) {
      let nearest = null;
      let nearestDist = Infinity;
      
      for (const monster of monsters) {
        if (monster.isDead || hitMonsters.has(monster)) continue;
        
        const dx = monster.x - currentPos.x;
        const dy = (monster.y - monster.data.size / 2) - currentPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < nearestDist && dist < attack.range) {
          nearestDist = dist;
          nearest = monster;
        }
      }
      
      if (!nearest) break;
      
      hitMonsters.add(nearest);
      this.hitMonster(nearest, attack, player);
      
      currentPos = { x: nearest.x, y: nearest.y - nearest.data.size / 2 };
      remainingChains--;
    }
    
    return hitMonsters.size;
  },
  
  addProjectile(projectile) {
    projectile.distance = 0;
    this.projectiles.push(projectile);
  },
  
  addEffect(effect) {
    this.effects.push(effect);
  },
  
  render() {
    for (const p of this.projectiles) {
      Renderer.drawProjectile(p);
    }
    
    for (const e of this.effects) {
      Renderer.drawEffect(e);
    }
  }
};
