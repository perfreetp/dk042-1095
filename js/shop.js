const Shop = {
  buyItem(player, itemId) {
    const itemData = GameData.items[itemId];
    if (!itemData) {
      showNotification('物品不存在', 'error');
      return false;
    }

    const price = itemData.price;
    if (!price) {
      showNotification('该物品无法购买', 'warning');
      return false;
    }

    if (player.gold < price) {
      showNotification('金币不足', 'error');
      return false;
    }

    player.gold -= price;
    player.addItem(itemId);
    return true;
  },

  sellItem(player, itemIndex) {
    const item = player.inventory[itemIndex];
    if (!item) {
      showNotification('请选择要出售的物品', 'warning');
      return false;
    }

    const itemData = GameData.items[item.itemId];
    if (!itemData) return false;

    if (itemData.type === 'currency') {
      showNotification('无法出售金币', 'warning');
      return false;
    }

    let sellPrice = Math.floor((itemData.price || 0) * 0.5 * item.count);
    if (item.enhanceLevel) {
      for (let i = 0; i < item.enhanceLevel; i++) {
        sellPrice += Math.floor(getEnhanceCost(i) * 0.3);
      }
    }

    if (sellPrice <= 0) {
      showNotification('该物品无法出售', 'warning');
      return false;
    }

    player.gold += sellPrice;
    player.inventory.splice(itemIndex, 1);
    
    showNotification(`出售 ${itemData.name} x${item.count}，获得 ${sellPrice} 金币`, 'success');
    return true;
  },

  getBuyPrice(itemId) {
    const itemData = GameData.items[itemId];
    return itemData ? itemData.price : 0;
  },

  getSellPrice(item) {
    const itemData = GameData.items[item.itemId];
    if (!itemData || !itemData.price) return 0;
    
    let price = Math.floor(itemData.price * 0.5 * item.count);
    if (item.enhanceLevel) {
      for (let i = 0; i < item.enhanceLevel; i++) {
        price += Math.floor(getEnhanceCost(i) * 0.3);
      }
    }
    return price;
  }
};
