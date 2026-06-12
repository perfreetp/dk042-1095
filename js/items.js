const ItemManager = {
  drops: [],
  
  init() {
    this.drops = [];
  },
  
  addDrop(itemType, x, y, count = 1) {
    this.drops.push({
      type: itemType,
      x,
      y,
      count,
      pickupTime: 0,
      vy: -3,
      onGround: false
    });
  },
  
  update(dt, player, platforms) {
    this.drops = this.drops.filter(drop => {
      if (!drop.onGround) {
        drop.vy += 0.2;
        drop.y += drop.vy;
        
        for (const platform of platforms) {
          if (drop.x > platform.x && drop.x < platform.x + platform.width &&
              drop.y >= platform.y - 10 && drop.y <= platform.y + 5) {
            drop.y = platform.y - 10;
            drop.onGround = true;
            break;
          }
        }
        
        if (drop.y > 700) {
          drop.onGround = true;
          drop.y = 700;
        }
      }
      
      const dx = player.x + player.width / 2 - drop.x;
      const dy = player.y + player.height / 2 - drop.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 80) {
        const pullSpeed = 8;
        drop.x += (dx / dist) * pullSpeed;
        drop.y += (dy / dist) * pullSpeed;
      }
      
      if (dist < 30) {
        if (drop.type === 'gold') {
          const goldAmount = 10 * drop.count;
          player.gainGold(goldAmount);
          Game.recordGoldPickup(goldAmount);
          Game.recordItemPickup('gold', drop.count);
        } else {
          player.addItem(drop.type, drop.count);
          Game.recordItemPickup(drop.type, drop.count);
        }
        return false;
      }
      
      drop.pickupTime += dt * 1000;
      return drop.pickupTime < 60000;
    });
  },
  
  render() {
    for (const drop of this.drops) {
      Renderer.drawItem(drop);
    }
  }
};

const EnhanceSystem = {
  enhance(player, itemIndex) {
    const item = player.inventory[itemIndex];
    if (!item) {
      showNotification('请选择要强化的物品', 'warning');
      return false;
    }
    
    const itemData = GameData.items[item.itemId];
    if (!itemData || !['weapon', 'armor', 'helmet', 'boots'].includes(itemData.type)) {
      showNotification('该物品无法强化', 'warning');
      return false;
    }
    
    const cost = getEnhanceCost(item.enhanceLevel || 0);
    if (player.gold < cost) {
      showNotification('金币不足', 'error');
      return false;
    }
    
    const successRate = getEnhanceSuccessRate(item.enhanceLevel || 0);
    player.gold -= cost;
    
    if (Math.random() < successRate) {
      item.enhanceLevel = (item.enhanceLevel || 0) + 1;
      showNotification(`强化成功！${itemData.name} +${item.enhanceLevel}`, 'success');
      return true;
    } else {
      showNotification('强化失败...', 'error');
      return false;
    }
  }
};
