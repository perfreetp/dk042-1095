const UI = {
  currentPanel: null,
  uiLayer: null,
  selectedItem: null,
  selectedClass: null,
  selectedSubClass: null,

  init() {
    this.uiLayer = document.getElementById('ui-layer');
    this.showMainMenu();
  },

  clearUI() {
    this.uiLayer.innerHTML = '';
    this.currentPanel = null;
    this.selectedItem = null;
  },

  closePanel() {
    if (this.currentPanel && this.currentPanel !== 'main_menu' && this.currentPanel !== 'game') {
      this.clearUI();
      this.currentPanel = 'game';
      Game.paused = false;
    }
  },

  closeAllPanels() {
    this.closePanel();
  },

  showMainMenu() {
    this.clearUI();
    
    const menu = document.createElement('div');
    menu.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      z-index: 100;
    `;
    
    const hasSave = loadFromStorage('player_save');
    
    menu.innerHTML = `
      <h1 class="ui-title" style="font-size: 56px; margin-bottom: 10px; text-shadow: 0 0 30px rgba(100, 150, 255, 0.8);">冒险岛</h1>
      <p class="ui-subtitle" style="font-size: 18px; margin-bottom: 60px; letter-spacing: 8px;">MAPLE ADVENTURE</p>
      <div style="display: flex; flex-direction: column; gap: 15px; align-items: center;">
        <button class="ui-button" onclick="UI.showCharacterCreate()">开始游戏</button>
        <button class="ui-button secondary" onclick="UI.showControls()">操作说明</button>
        ${hasSave ? '<button class="ui-button secondary" onclick="Game.loadGame()">继续游戏</button>' : ''}
      </div>
      <p style="margin-top: 60px; color: rgba(200, 220, 255, 0.5); font-size: 12px;">
        横版闯关 · 收集养成 · 冒险探索
      </p>
    `;
    
    this.uiLayer.appendChild(menu);
    this.currentPanel = 'main_menu';
  },

  showControls() {
    this.clearUI();
    
    const panel = document.createElement('div');
    panel.className = 'ui-panel';
    panel.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 30px;
      width: 550px;
      z-index: 100;
    `;
    
    panel.innerHTML = `
      <h2 class="ui-title" style="font-size: 24px; margin-bottom: 20px; text-align: center;">操作说明</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
        <div>
          <h3 style="color: #4fc3f7; margin-bottom: 10px; font-size: 14px;">移动控制</h3>
          <p style="font-size: 13px; margin: 5px 0;">← → 或 A D：左右移动</p>
          <p style="font-size: 13px; margin: 5px 0;">↑ 或 W 或 空格：跳跃</p>
        </div>
        <div>
          <h3 style="color: #4fc3f7; margin-bottom: 10px; font-size: 14px;">战斗控制</h3>
          <p style="font-size: 13px; margin: 5px 0;">J 或 Z：普通攻击</p>
          <p style="font-size: 13px; margin: 5px 0;">U / X：技能1</p>
          <p style="font-size: 13px; margin: 5px 0;">I / C：技能2</p>
          <p style="font-size: 13px; margin: 5px 0;">O / V：技能3</p>
          <p style="font-size: 13px; margin: 5px 0;">P / G：技能4</p>
        </div>
        <div>
          <h3 style="color: #4fc3f7; margin-bottom: 10px; font-size: 14px;">交互控制</h3>
          <p style="font-size: 13px; margin: 5px 0;">E：交互/拾取</p>
          <p style="font-size: 13px; margin: 5px 0;">ESC：暂停/关闭面板</p>
        </div>
        <div>
          <h3 style="color: #4fc3f7; margin-bottom: 10px; font-size: 14px;">界面控制</h3>
          <p style="font-size: 13px; margin: 5px 0;">B 或 Tab：背包</p>
          <p style="font-size: 13px; margin: 5px 0;">Q：任务面板</p>
          <p style="font-size: 13px; margin: 5px 0;">K：技能面板</p>
          <p style="font-size: 13px; margin: 5px 0;">M：地图</p>
          <p style="font-size: 13px; margin: 5px 0;">L：怪物图鉴</p>
          <p style="font-size: 13px; margin: 5px 0;">F：角色档案</p>
        </div>
      </div>
      <div style="text-align: center;">
        <button class="ui-button" onclick="UI.showMainMenu()">返回</button>
      </div>
    `;
    
    this.uiLayer.appendChild(panel);
    this.currentPanel = 'controls';
  },

  showCharacterCreate() {
    this.clearUI();
    
    const panel = document.createElement('div');
    panel.className = 'ui-panel';
    panel.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 30px;
      width: 750px;
      z-index: 100;
    `;
    
    const classes = Object.entries(GameData.classes);
    
    panel.innerHTML = `
      <h2 class="ui-title" style="font-size: 24px; margin-bottom: 10px; text-align: center;">创建角色</h2>
      <p class="ui-subtitle" style="text-align: center; margin-bottom: 25px;">选择你的职业</p>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; color: #a0c4ff; font-size: 14px;">角色名称</label>
        <input type="text" id="char-name" value="冒险者" maxlength="12" 
          style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(100, 150, 255, 0.4); 
                 background: rgba(0, 0, 0, 0.3); color: #fff; font-size: 16px; box-sizing: border-box;">
      </div>
      
      <div id="class-list" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
        ${classes.map(([id, cls]) => `
          <div class="class-option" data-class="${id}" onclick="UI.selectClass('${id}')"
            style="padding: 15px; border-radius: 10px; border: 2px solid rgba(255, 255, 255, 0.2); 
                   cursor: pointer; transition: all 0.2s; background: rgba(255, 255, 255, 0.03);">
            <div style="display: flex; align-items: center; gap: 15px;">
              <div style="width: 50px; height: 50px; border-radius: 50%; background: ${cls.color}; 
                         display: flex; align-items: center; justify-content: center; font-size: 24px;">
                ${id === 'warrior' ? '⚔' : id === 'mage' ? '🔮' : id === 'archer' ? '🏹' : '🗡'}
              </div>
              <div>
                <h3 style="color: ${cls.color}; margin: 0 0 5px 0; font-size: 16px;">${cls.name}</h3>
                <p style="font-size: 12px; color: rgba(200, 220, 255, 0.7); margin: 0;">${cls.description}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div id="subclass-section" style="display: none; margin-bottom: 25px;">
        <h3 style="color: #4fc3f7; margin-bottom: 15px; font-size: 14px;">选择职业分支</h3>
        <div id="subclass-list" style="display: flex; gap: 15px;"></div>
      </div>
      
      <div id="stats-preview" style="display: none; margin-bottom: 25px; padding: 15px; 
           background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
        <h3 style="color: #4fc3f7; margin-bottom: 10px; font-size: 14px;">基础属性</h3>
        <div id="stats-content" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;"></div>
      </div>
      
      <div style="display: flex; gap: 15px; justify-content: center;">
        <button class="ui-button secondary" onclick="UI.showMainMenu()">返回</button>
        <button id="start-btn" class="ui-button" onclick="UI.startGame()" disabled>开始冒险</button>
      </div>
    `;
    
    this.uiLayer.appendChild(panel);
    this.currentPanel = 'character_create';
    this.selectedClass = null;
    this.selectedSubClass = null;
  },

  selectClass(classId) {
    this.selectedClass = classId;
    this.selectedSubClass = null;
    
    document.querySelectorAll('.class-option').forEach(el => {
      el.style.borderColor = el.dataset.class === classId 
        ? 'rgba(100, 150, 255, 0.8)' 
        : 'rgba(255, 255, 255, 0.2)';
      el.style.background = el.dataset.class === classId 
        ? 'rgba(100, 150, 255, 0.1)' 
        : 'rgba(255, 255, 255, 0.03)';
    });
    
    const cls = GameData.classes[classId];
    const subClassSection = document.getElementById('subclass-section');
    const statsPreview = document.getElementById('stats-preview');
    const startBtn = document.getElementById('start-btn');
    
    subClassSection.style.display = 'block';
    statsPreview.style.display = 'block';
    startBtn.disabled = false;
    
    const subClassList = document.getElementById('subclass-list');
    subClassList.innerHTML = Object.entries(cls.subClasses).map(([id, sub]) => `
      <div class="subclass-option" data-subclass="${id}" onclick="UI.selectSubClass('${id}')"
        style="flex: 1; padding: 15px; border-radius: 10px; border: 2px solid rgba(255, 255, 255, 0.2); 
               cursor: pointer; transition: all 0.2s; background: rgba(255, 255, 255, 0.03);">
        <h4 style="color: ${cls.color}; margin: 0 0 5px 0; font-size: 14px;">${sub.name}</h4>
        <p style="font-size: 11px; color: rgba(200, 220, 255, 0.7); margin: 0;">${sub.description}</p>
      </div>
    `).join('');
    
    this.updateStatsPreview();
  },

  selectSubClass(subClassId) {
    this.selectedSubClass = subClassId;
    
    document.querySelectorAll('.subclass-option').forEach(el => {
      el.style.borderColor = el.dataset.subclass === subClassId 
        ? 'rgba(100, 150, 255, 0.8)' 
        : 'rgba(255, 255, 255, 0.2)';
      el.style.background = el.dataset.subclass === subClassId 
        ? 'rgba(100, 150, 255, 0.1)' 
        : 'rgba(255, 255, 255, 0.03)';
    });
    
    this.updateStatsPreview();
  },

  updateStatsPreview() {
    if (!this.selectedClass) return;
    
    const cls = GameData.classes[this.selectedClass];
    let stats = { ...cls.baseStats };
    
    if (this.selectedSubClass && cls.subClasses[this.selectedSubClass]) {
      const bonus = cls.subClasses[this.selectedSubClass].bonusStats;
      for (const s in bonus) {
        stats[s] = (stats[s] || 0) + bonus[s];
      }
    }
    
    const statsContent = document.getElementById('stats-content');
    statsContent.innerHTML = `
      <div style="font-size: 13px;">❤️ 生命: ${stats.hp}</div>
      <div style="font-size: 13px;">💧 魔力: ${stats.mp}</div>
      <div style="font-size: 13px;">⚔ 攻击: ${stats.atk}</div>
      <div style="font-size: 13px;">🛡 防御: ${stats.def}</div>
      <div style="font-size: 13px;">👟 速度: ${stats.spd}</div>
      <div style="font-size: 13px;">💥 暴击: ${stats.crit}%</div>
    `;
  },

  startGame() {
    const nameInput = document.getElementById('char-name');
    const name = nameInput.value.trim() || '冒险者';
    
    if (!this.selectedClass) {
      showNotification('请选择职业', 'warning');
      return;
    }
    
    Game.startNewGame(name, this.selectedClass, this.selectedSubClass);
  },

  showHUD() {
    this.clearUI();
    this.currentPanel = 'game';
  },

  renderHUD() {
    if (!Game.player) return;
    
    const player = Game.player;
    const stats = player.getStats();
    const region = MapManager.currentRegion;
    
    let hudHTML = `
      <div style="position: absolute; top: 15px; left: 15px; z-index: 50;">
        <div style="background: rgba(0, 0, 0, 0.7); padding: 12px 15px; border-radius: 10px; min-width: 220px; border: 1px solid rgba(100, 150, 255, 0.3);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <div style="width: 35px; height: 35px; border-radius: 50%; background: ${player.classData.color}; 
                       display: flex; align-items: center; justify-content: center; font-size: 18px;">
              ${player.classId === 'warrior' ? '⚔' : player.classId === 'mage' ? '🔮' : player.classId === 'archer' ? '🏹' : '🗡'}
            </div>
            <div>
              <div style="color: #fff; font-weight: bold; font-size: 14px;">${player.name}</div>
              <div style="color: ${player.classData.color}; font-size: 11px;">Lv.${player.level} ${player.classData.name}</div>
            </div>
          </div>
          
          <div style="margin-bottom: 6px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
              <span style="color: #e74c3c;">❤️ HP</span>
              <span style="color: #fff;">${Math.ceil(player.currentHP)}/${player.maxHP}</span>
            </div>
            <div style="background: rgba(0, 0, 0, 0.5); height: 14px; border-radius: 7px; overflow: hidden;">
              <div style="background: linear-gradient(90deg, #c0392b, #e74c3c); height: 100%; width: ${(player.currentHP / player.maxHP) * 100}%; transition: width 0.3s;"></div>
            </div>
          </div>
          
          <div style="margin-bottom: 6px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
              <span style="color: #3498db;">💧 MP</span>
              <span style="color: #fff;">${Math.ceil(player.currentMP)}/${player.maxMP}</span>
            </div>
            <div style="background: rgba(0, 0, 0, 0.5); height: 12px; border-radius: 6px; overflow: hidden;">
              <div style="background: linear-gradient(90deg, #2980b9, #3498db); height: 100%; width: ${(player.currentMP / player.maxMP) * 100}%; transition: width 0.3s;"></div>
            </div>
          </div>
          
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
              <span style="color: #f1c40f;">⭐ EXP</span>
              <span style="color: #fff;">${player.exp}/${player.expToNext}</span>
            </div>
            <div style="background: rgba(0, 0, 0, 0.5); height: 8px; border-radius: 4px; overflow: hidden;">
              <div style="background: linear-gradient(90deg, #f39c12, #f1c40f); height: 100%; width: ${(player.exp / player.expToNext) * 100}%; transition: width 0.3s;"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div style="position: absolute; top: 15px; right: 15px; z-index: 50;">
        <div style="background: rgba(0, 0, 0, 0.7); padding: 10px 15px; border-radius: 10px; text-align: right; border: 1px solid rgba(100, 150, 255, 0.3);">
          <div style="color: #4fc3f7; font-size: 14px; font-weight: bold;">${region ? region.name : ''}</div>
          <div style="color: #f1c40f; font-size: 13px;">💰 ${player.gold}</div>
        </div>
      </div>
      
      <div style="position: absolute; top: 15px; left: 50%; transform: translateX(-50%); z-index: 50;">
        ${player.comboCount > 0 ? `
          <div style="background: rgba(0, 0, 0, 0.7); padding: 8px 20px; border-radius: 20px; text-align: center; border: 2px solid #f39c12;">
            <span style="color: #f39c12; font-size: 20px; font-weight: bold;">${player.comboCount} COMBO!</span>
          </div>
        ` : ''}
      </div>
      
      <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 50;">
        <div style="display: flex; gap: 10px; background: rgba(0, 0, 0, 0.7); padding: 10px 15px; border-radius: 15px; border: 1px solid rgba(100, 150, 255, 0.3);">
          ${this.renderSkillBar(player)}
        </div>
      </div>
      
      <div style="position: absolute; bottom: 20px; right: 15px; z-index: 50;">
        <div style="background: rgba(0, 0, 0, 0.7); padding: 8px 12px; border-radius: 8px; font-size: 11px; color: rgba(200, 220, 255, 0.6); border: 1px solid rgba(100, 150, 255, 0.3);">
          <div>E:交互 | B:背包 | Q:任务 | K:技能 | M:地图 | L:图鉴 | F:档案</div>
        </div>
      </div>
    `;
    
    this.uiLayer.innerHTML = hudHTML;
  },

  renderSkillBar(player) {
    const keys = ['J', 'U', 'I', 'O', 'P'];
    const skills = player.skills.slice(0, 5);
    
    return skills.map((skillId, idx) => {
      const skill = GameData.skills[skillId];
      const cooldown = player.skillCooldowns[skillId] || 0;
      const onCD = cooldown > 0;
      const cdPercent = onCD ? (cooldown / skill.cooldown) * 100 : 0;
      
      return `
        <div style="width: 55px; height: 55px; background: rgba(255, 255, 255, 0.1); border-radius: 8px; 
                    position: relative; border: 2px solid ${onCD ? 'rgba(255, 100, 100, 0.5)' : 'rgba(100, 150, 255, 0.5)'};
                    display: flex; align-items: center; justify-content: center; flex-direction: column;">
          <div style="font-size: 22px;">${skill.name.includes('攻击') ? '⚔' : skill.name.includes('斩') ? '🗡' : skill.name.includes('火') ? '🔥' : skill.name.includes('冰') ? '❄️' : skill.name.includes('箭') ? '🏹' : skill.name.includes('刺') ? '🗡' : '✨'}</div>
          <div style="position: absolute; bottom: 2px; left: 2px; font-size: 10px; color: #a0c4ff; font-weight: bold;">${keys[idx]}</div>
          <div style="position: absolute; top: 2px; right: 4px; font-size: 10px; color: ${skill.mpCost > player.currentMP ? '#e74c3c' : '#3498db'};">${skill.mpCost}</div>
          ${onCD ? `
            <div style="position: absolute; inset: 0; background: rgba(0, 0, 0, 0.6); border-radius: 6px; display: flex; align-items: center; justify-content: center;">
              <span style="color: #fff; font-size: 12px; font-weight: bold;">${(cooldown / 1000).toFixed(1)}</span>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  },

  showPauseMenu() {
    const panel = document.createElement('div');
    panel.id = 'pause-menu';
    panel.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 200;
    `;
    
    const inner = document.createElement('div');
    inner.className = 'ui-panel';
    inner.style.cssText = 'padding: 30px; width: 350px; text-align: center;';
    
    inner.innerHTML = `
      <h2 class="ui-title" style="font-size: 24px; margin-bottom: 25px;">游戏暂停</h2>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <button class="ui-button" onclick="UI.closePauseMenu()">继续游戏</button>
        <button class="ui-button secondary" onclick="Game.saveGame(); showNotification('游戏已保存', 'success')">保存游戏</button>
        <button class="ui-button secondary" onclick="UI.showControls()">操作说明</button>
        <button class="ui-button danger" onclick="UI.confirmQuit()">返回主菜单</button>
      </div>
    `;
    
    panel.appendChild(inner);
    this.uiLayer.appendChild(panel);
    this.currentPanel = 'pause';
  },

  closePauseMenu() {
    const pauseMenu = document.getElementById('pause-menu');
    if (pauseMenu) pauseMenu.remove();
    this.currentPanel = 'game';
    Game.paused = false;
  },

  confirmQuit() {
    if (confirm('确定要返回主菜单吗？未保存的进度将丢失。')) {
      Game.paused = false;
      Game.state = 'menu';
      this.showMainMenu();
    }
  },

  showInventory() {
    this.clearUI();
    this.selectedItem = null;
    
    const panel = document.createElement('div');
    panel.className = 'ui-panel';
    panel.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 25px;
      width: 750px;
      z-index: 150;
      max-height: 85vh;
      overflow-y: auto;
    `;
    
    const player = Game.player;
    const slots = [];
    for (let i = 0; i < 30; i++) {
      const item = player.inventory[i];
      if (item) {
        const itemData = GameData.items[item.itemId];
        const rarityClass = itemData ? getRarityClass(itemData.rarity) : '';
        slots.push(`
          <div class="inventory-slot ${rarityClass}" onclick="UI.selectInventoryItem(${i})" 
               onmouseenter="UI.showItemTooltip(event, '${item.itemId}', ${item.enhanceLevel || 0})"
               onmouseleave="UI.hideTooltip()">
            <span style="font-size: 20px;">${itemData ? itemData.icon : '?'}</span>
            ${item.count > 1 ? `<span class="item-count">${item.count}</span>` : ''}
            ${item.enhanceLevel ? `<span style="position:absolute;top:0;right:2px;color:#f1c40f;font-size:10px;">+${item.enhanceLevel}</span>` : ''}
          </div>
        `);
      } else {
        slots.push('<div class="inventory-slot"></div>');
      }
    }
    
    const equipped = player.equipment;
    const getEquipDisplay = (slot) => {
      const item = equipped[slot];
      if (!item) return '<div class="inventory-slot"></div>';
      const itemData = GameData.items[item.itemId];
      const rarityClass = itemData ? getRarityClass(itemData.rarity) : '';
      return `
        <div class="inventory-slot ${rarityClass}" onclick="UI.unequipItem('${slot}')"
             onmouseenter="UI.showItemTooltip(event, '${item.itemId}', ${item.enhanceLevel || 0})"
             onmouseleave="UI.hideTooltip()">
          <span style="font-size: 20px;">${itemData ? itemData.icon : '?'}</span>
          ${item.enhanceLevel ? `<span style="position:absolute;top:0;right:2px;color:#f1c40f;font-size:10px;">+${item.enhanceLevel}</span>` : ''}
        </div>
      `;
    };
    
    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 class="ui-title" style="font-size: 20px;">🎒 背包</h2>
        <span style="color: #f1c40f; font-size: 16px;">💰 ${player.gold} 金币</span>
      </div>
      
      <div style="display: flex; gap: 25px;">
        <div style="flex: 0 0 140px;">
          <h3 style="color: #4fc3f7; margin-bottom: 10px; font-size: 14px;">装备栏</h3>
          <div style="display: flex; flex-direction: column; gap: 10px; align-items: center;">
            <div style="text-align: center;">
              <div style="font-size: 10px; color: #a0c4ff; margin-bottom: 3px;">武器</div>
              ${getEquipDisplay('weapon')}
            </div>
            <div style="text-align: center;">
              <div style="font-size: 10px; color: #a0c4ff; margin-bottom: 3px;">护甲</div>
              ${getEquipDisplay('armor')}
            </div>
            <div style="text-align: center;">
              <div style="font-size: 10px; color: #a0c4ff; margin-bottom: 3px;">头盔</div>
              ${getEquipDisplay('helmet')}
            </div>
            <div style="text-align: center;">
              <div style="font-size: 10px; color: #a0c4ff; margin-bottom: 3px;">靴子</div>
              ${getEquipDisplay('boots')}
            </div>
          </div>
        </div>
        
        <div style="flex: 1;">
          <h3 style="color: #4fc3f7; margin-bottom: 10px; font-size: 14px;">物品 (${player.inventory.length}/30)</h3>
          <div style="display: grid; grid-template-columns: repeat(6, 48px); gap: 8px;">
            ${slots.join('')}
          </div>
        </div>
      </div>
      
      <div id="item-actions" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); display: none;">
        <div id="item-info" style="margin-bottom: 10px; font-size: 13px;"></div>
        <div id="item-buttons" style="display: flex; gap: 10px;"></div>
      </div>
      
      <div style="margin-top: 20px; text-align: right;">
        <button class="ui-button secondary" onclick="UI.closePanel()">关闭 (ESC)</button>
      </div>
    `;
    
    this.uiLayer.appendChild(panel);
    this.currentPanel = 'inventory';
  },

  selectInventoryItem(index) {
    const player = Game.player;
    const item = player.inventory[index];
    if (!item) return;
    
    this.selectedItem = { index, item };
    const itemData = GameData.items[item.itemId];
    
    const itemActions = document.getElementById('item-actions');
    const itemInfo = document.getElementById('item-info');
    const itemButtons = document.getElementById('item-buttons');
    
    itemActions.style.display = 'block';
    
    const rarityColor = getRarityColor(itemData.rarity);
    const sellPrice = Shop.getSellPrice(item);
    
    let enhanceInfo = '';
    if (item.enhanceLevel && itemData.stats) {
      const mainStat = itemData.type === 'weapon' ? 'atk' : 'def';
      const baseVal = itemData.stats[mainStat] || 0;
      const bonus = Math.floor(baseVal * 0.15 * item.enhanceLevel);
      const statName = mainStat === 'atk' ? '攻击' : '防御';
      enhanceInfo = `<p style="color: #f1c40f; margin-top: 3px;">⚡ 强化 +${item.enhanceLevel}: ${statName} +${bonus}</p>`;
    }
    
    const sourceInfo = itemData.source
      ? `<p style="color: #f1c40f; margin-top: 3px;">🏅 来源: ${itemData.source}</p>`
      : '';
    
    const typeBadge = itemData.type === 'badge'
      ? '<span style="background: rgba(241, 196, 15, 0.2); color: #f1c40f; padding: 1px 6px; border-radius: 3px; font-size: 10px; margin-left: 8px;">徽章</span>'
      : '';
    
    itemInfo.innerHTML = `
      <span style="color: ${rarityColor}; font-weight: bold; font-size: 15px;">
        ${itemData.icon} ${itemData.name}${item.enhanceLevel ? ` <span style="color:#f1c40f;">+${item.enhanceLevel}</span>` : ''}${typeBadge}
      </span>
      <span style="color: #f1c40f; margin-left: 10px;">x${item.count}</span>
      <p style="color: rgba(200, 220, 255, 0.8); margin-top: 5px;">${itemData.description}</p>
      ${itemData.stats ? `<p style="color: #2ecc71; margin-top: 5px;">${this.formatStats(itemData.stats, item.enhanceLevel)}</p>` : ''}
      ${enhanceInfo}
      ${sourceInfo}
      ${itemData.price && itemData.type !== 'badge' ? `<p style="color: #f1c40f; margin-top: 5px;">💰 回收价: ${sellPrice} 金币${item.enhanceLevel ? ' (含强化)' : ''}</p>` : ''}
      ${itemData.type === 'badge' ? `<p style="color: #888; margin-top: 5px; font-size: 11px;">永久生效 · 不可出售 · 已自动激活加成</p>` : ''}
    `;
    
    let buttons = '';
    if (['weapon', 'armor', 'helmet', 'boots'].includes(itemData.type)) {
      buttons += `<button class="ui-button" onclick="UI.equipSelectedItem()">装备</button>`;
    }
    if (itemData.type === 'consumable') {
      buttons += `<button class="ui-button" onclick="UI.useSelectedItem()">使用</button>`;
    }
    if (itemData.price && itemData.type !== 'badge') {
      buttons += `<button class="ui-button secondary" onclick="UI.sellSelectedItem()">出售 (${Shop.getSellPrice(item)}金)</button>`;
    }
    
    itemButtons.innerHTML = buttons;
  },

  equipSelectedItem() {
    if (!this.selectedItem) return;
    if (Game.player.equipItem(this.selectedItem.index)) {
      this.showInventory();
    }
  },

  useSelectedItem() {
    if (!this.selectedItem) return;
    if (Game.player.useItem(this.selectedItem.index)) {
      this.showInventory();
    }
  },

  sellSelectedItem() {
    if (!this.selectedItem) return;
    if (Shop.sellItem(Game.player, this.selectedItem.index)) {
      this.showInventory();
    }
  },

  unequipItem(slot) {
    const player = Game.player;
    const item = player.equipment[slot];
    if (!item) return;
    
    if (player.inventory.length >= 30) {
      showNotification('背包已满', 'warning');
      return;
    }
    
    player.inventory.push(item);
    player.equipment[slot] = null;
    const itemData = GameData.items[item.itemId];
    showNotification(`已卸下 ${itemData.name}`, 'success');
    this.showInventory();
  },

  formatStats(stats, enhanceLevel = 0) {
    const parts = [];
    for (const stat in stats) {
      const statNames = {
        atk: '攻击', def: '防御', hp: '生命', mp: '魔力',
        spd: '速度', crit: '暴击率'
      };
      let value = stats[stat];
      let enhanceBonus = 0;
      if (enhanceLevel) {
        enhanceBonus = Math.floor((stats.atk || stats.def || 0) * 0.15 * enhanceLevel);
        value += enhanceBonus;
      }
      let text = `${statNames[stat] || stat} +${value}${stat === 'crit' ? '%' : ''}`;
      if (enhanceBonus > 0) {
        text = `${statNames[stat] || stat} +${stats[stat]}${stat === 'crit' ? '%' : ''} <span style="color:#f1c40f;">(+${enhanceBonus} 强化)</span>`;
      }
      parts.push(text);
    }
    return parts.join('，');
  },

  showItemTooltip(event, itemId, enhanceLevel = 0) {
    const itemData = GameData.items[itemId];
    if (!itemData) return;
    
    const tooltip = document.createElement('div');
    tooltip.id = 'item-tooltip';
    tooltip.className = 'tooltip';
    
    const rarityClass = getRarityClass(itemData.rarity);
    
    const tempItem = { itemId, count: 1, enhanceLevel };
    const sellPrice = Shop.getSellPrice(tempItem);
    
    const sourceInfo = itemData.source
      ? `<div style="margin-top: 4px; color: #f1c40f; font-size: 11px;">🏅 来源: ${itemData.source}</div>`
      : '';
    
    const typeBadge = itemData.type === 'badge'
      ? '<span style="background: rgba(241, 196, 15, 0.2); color: #f1c40f; padding: 1px 6px; border-radius: 3px; font-size: 10px; margin-left: 8px;">徽章</span>'
      : '';
    
    tooltip.innerHTML = `
      <div class="item-name ${rarityClass}">
        ${itemData.icon} ${itemData.name}${enhanceLevel ? ` <span style="color:#f1c40f;">+${enhanceLevel}</span>` : ''}${typeBadge}
      </div>
      <div class="item-desc">${itemData.description}</div>
      ${itemData.stats ? `<div class="item-stats">${this.formatStats(itemData.stats, enhanceLevel)}</div>` : ''}
      ${sourceInfo}
      ${itemData.price ? `<div style="margin-top: 8px; color: #f1c40f;">回收价: ${sellPrice} 金币${enhanceLevel ? ' <span style="color:#aaa;">(含强化)</span>' : ''}</div>` : ''}
      <div style="margin-top: 4px; color: #888; font-size: 11px;">
        ${itemData.type === 'badge' ? '永久生效 · 不可出售' : (['weapon', 'armor', 'helmet', 'boots'].includes(itemData.type) ? '可强化 · 可出售' : (itemData.type === 'consumable' ? '可使用' : ''))}
      </div>
    `;
    
    tooltip.style.left = `${event.clientX + 15}px`;
    tooltip.style.top = `${event.clientY + 15}px`;
    
    document.body.appendChild(tooltip);
  },

  hideTooltip() {
    const tooltip = document.getElementById('item-tooltip');
    if (tooltip) tooltip.remove();
  },

  showQuestPanel(npc) {
    this.clearUI();
    
    const panel = document.createElement('div');
    panel.className = 'ui-panel';
    panel.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 25px;
      width: 650px;
      z-index: 150;
      max-height: 85vh;
      overflow-y: auto;
    `;
    
    const player = Game.player;
    Quests.loadForPlayer(player);
    
    const getRegionInfo = (regionId) => {
      const region = GameData.regions[regionId];
      if (!region) return '';
      const icons = { town: '🏠', forest: '🌲', mine: '⛏️', sky: '☁️', tower: '🏰', training: '🎯' };
      return `<span style="color:${region.color};">${icons[regionId] || ''} ${region.name}</span>`;
    };
    
    const findNextQuest = (completedId) => {
      for (const [id, q] of Object.entries(GameData.quests)) {
        if (q.prereq === completedId) return { id, quest: q };
      }
      return null;
    };
    
    const availableQuests = Quests.availableQuests.map(id => {
      const q = GameData.quests[id];
      const canAccept = Quests.canAccept(player, id);
      return `
        <div class="quest-item ${canAccept ? '' : 'disabled'}" style="opacity: ${canAccept ? 1 : 0.5};">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <strong style="color: #4fc3f7;">${q.name}</strong>
                <span style="color: #888; font-size: 12px;">Lv.${q.level}</span>
                ${q.isBoss ? '<span style="background: rgba(231, 76, 60, 0.2); color: #e74c3c; padding: 1px 6px; border-radius: 3px; font-size: 10px;">BOSS</span>' : ''}
              </div>
              <p style="color: rgba(200, 220, 255, 0.7); font-size: 12px; margin: 5px 0;">${q.description}</p>
              ${q.region ? `<p style="font-size: 11px; margin-top: 3px;">📍 推荐区域: ${getRegionInfo(q.region)}</p>` : ''}
              <p style="color: #f1c40f; font-size: 11px; margin-top: 3px;">
                奖励: ${q.rewards.exp ? `${q.rewards.exp} EXP ` : ''}${q.rewards.gold ? `${q.rewards.gold} 金` : ''}
                ${q.rewards.items ? q.rewards.items.map(i => {
                  const item = GameData.items[i];
                  return item ? ` ${item.icon}${item.name}` : '';
                }).join('') : ''}
              </p>
            </div>
            ${canAccept ? `<button class="ui-button" style="padding: 6px 12px; font-size: 12px; flex-shrink: 0;" 
               onclick="UI.acceptQuest('${id}')">接取</button>` : ''}
          </div>
        </div>
      `;
    }).join('');
    
    let nextStepHint = '';
    if (Quests.activeQuests.length === 0 && Quests.availableQuests.filter(id => Quests.canAccept(player, id)).length === 0) {
      const allQuestIds = Object.keys(GameData.quests);
      const completedIds = Object.keys(player.quests).filter(id => player.quests[id].completed);
      const lastCompleted = completedIds.length > 0 ? completedIds[completedIds.length - 1] : null;
      const nextQuest = findNextQuest(lastCompleted);
      
      if (nextQuest) {
        const levelDiff = nextQuest.quest.level - player.level;
        const canAccept = Quests.canAccept(player, nextQuest.id);
        const region = GameData.regions[nextQuest.quest.region];
        const levelRangeStr = region ? region.levelRange : '';
        let levelUpHint = '';
        
        if (!canAccept && levelDiff > 0) {
          let bestGrindRegion = null;
          const playerLevel = player.level;
          const allRegions = ['forest', 'mine', 'sky', 'tower'];
          for (const rid of allRegions) {
            const r = GameData.regions[rid];
            if (!r) continue;
            const [minL, maxL] = r.levelRange.split('-').map(Number);
            if (playerLevel >= minL && playerLevel <= maxL) {
              bestGrindRegion = { id: rid, region: r };
              break;
            }
          }
          if (!bestGrindRegion && nextQuest.quest.region) {
            const nr = GameData.regions[nextQuest.quest.region];
            if (nr) bestGrindRegion = { id: nextQuest.quest.region, region: nr };
          }
          
          levelUpHint = `
            <div style="margin-top: 10px; padding: 10px; background: rgba(231, 76, 60, 0.1); border-radius: 6px;">
              <p style="color: #e74c3c; font-size: 12px; font-weight: bold;">⚠️ 等级不足</p>
              <p style="color: rgba(200, 220, 255, 0.8); font-size: 11px; margin-top: 3px;">
                还差 <strong style="color: #e74c3c;">${levelDiff}</strong> 级才能接取「${nextQuest.quest.name}」
              </p>
              ${bestGrindRegion ? `
                <p style="color: rgba(200, 220, 255, 0.8); font-size: 11px; margin-top: 3px;">
                  💡 推荐先去 <span style="color: ${bestGrindRegion.region.color};">${bestGrindRegion.region.name}</span> (Lv.${bestGrindRegion.region.levelRange}) 刷级
                </p>
              ` : ''}
            </div>
          `;
        }
        
        nextStepHint = `
          <div style="padding: 15px; background: rgba(52, 152, 219, 0.1); border: 2px solid rgba(52, 152, 219, 0.3); border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #3498db; font-size: 13px; font-weight: bold;">📌 下一步目标</p>
            <p style="color: rgba(200, 220, 255, 0.9); font-size: 12px; margin-top: 5px;">
              下一个任务: <strong style="color: #4fc3f7;">${nextQuest.quest.name}</strong>
              <span style="color: #888; margin-left: 8px;">(需要 Lv.${nextQuest.quest.level}${!canAccept ? `，当前 Lv.${player.level}` : ''})</span>
            </p>
            ${nextQuest.quest.region ? `<p style="color: rgba(200, 220, 255, 0.8); font-size: 11px; margin-top: 3px;">📍 推荐前往: ${getRegionInfo(nextQuest.quest.region)} (Lv.${levelRangeStr})</p>` : ''}
            ${levelUpHint}
          </div>
        `;
      } else {
        const allCompleted = allQuestIds.every(id => player.quests[id] && player.quests[id].completed);
        if (allCompleted) {
          nextStepHint = `
            <div style="padding: 15px; background: rgba(241, 196, 15, 0.1); border: 2px solid rgba(241, 196, 15, 0.3); border-radius: 8px; margin-bottom: 20px;">
              <p style="color: #f1c40f; font-size: 13px; font-weight: bold;">🎉 恭喜！你已完成所有主线任务</p>
              <p style="color: rgba(200, 220, 255, 0.7); font-size: 12px; margin-top: 5px;">
                可以前往训练场练习连招，或重游各区域收集怪物图鉴。
              </p>
            </div>
          `;
        }
      }
    }
    
    const activeQuests = Quests.activeQuests.map(aq => {
      const q = GameData.quests[aq.id];
      const progress = Quests.getProgress(aq);
      const canComplete = Quests.isQuestComplete(aq, q);
      const nextQuest = findNextQuest(aq.id);
      let nextHint = '';
      if (canComplete && nextQuest) {
        nextHint = `
          <p style="font-size: 11px; margin-top: 6px; padding-top: 6px; border-top: 1px dashed rgba(255,255,255,0.1);">
            <span style="color: #2ecc71;">➡️ 完成后下一任务: </span>
            <strong style="color: #4fc3f7;">${nextQuest.quest.name}</strong>
            ${nextQuest.quest.region ? `（${getRegionInfo(nextQuest.quest.region)}）` : ''}
          </p>
        `;
      } else if (canComplete && !nextQuest) {
        nextHint = `
          <p style="font-size: 11px; margin-top: 6px; padding-top: 6px; border-top: 1px dashed rgba(255,255,255,0.1);">
            <span style="color: #f1c40f;">🏆 这是最终任务！完成后通关全部主线。</span>
          </p>
        `;
      }
      return `
        <div class="quest-item ${canComplete ? 'completed' : 'active'}">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <strong style="color: #fff;">${q.name}</strong>
                ${q.isBoss ? '<span style="background: rgba(231, 76, 60, 0.2); color: #e74c3c; padding: 1px 6px; border-radius: 3px; font-size: 10px;">BOSS</span>' : ''}
                <span style="color: ${canComplete ? '#2ecc71' : '#f1c40f'}; font-size: 12px;">
                  进度: ${progress}
                </span>
              </div>
              <p style="color: rgba(200, 220, 255, 0.7); font-size: 12px; margin: 5px 0;">${q.description}</p>
              ${q.region ? `<p style="font-size: 11px;">📍 推荐区域: ${getRegionInfo(q.region)}</p>` : ''}
              ${nextHint}
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px; flex-shrink: 0;">
              ${canComplete ? `<button class="ui-button success" style="padding: 6px 12px; font-size: 12px;" 
                 onclick="UI.completeQuest('${aq.id}')">完成</button>` : ''}
              <button class="ui-button danger" style="padding: 6px 12px; font-size: 12px;" 
                 onclick="UI.abandonQuest('${aq.id}')">放弃</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    panel.innerHTML = `
      <h2 class="ui-title" style="font-size: 20px; margin-bottom: 15px;">📜 任务</h2>
      
      ${nextStepHint}
      
      <div style="margin-bottom: 20px;">
        <h3 style="color: #2ecc71; margin-bottom: 10px; font-size: 14px;">进行中 (${Quests.activeQuests.length})</h3>
        <div class="quest-panel">
          ${activeQuests || '<p style="color: #888; font-size: 13px; padding: 15px; text-align: center;">暂无进行中的任务</p>'}
        </div>
      </div>
      
      <div>
        <h3 style="color: #f1c40f; margin-bottom: 10px; font-size: 14px;">可接取 (${Quests.availableQuests.length})</h3>
        <div class="quest-panel">
          ${availableQuests || '<p style="color: #888; font-size: 13px; padding: 15px; text-align: center;">暂无可接取的任务</p>'}
        </div>
      </div>
      
      <div style="margin-top: 20px; text-align: right;">
        <button class="ui-button secondary" onclick="UI.closePanel()">关闭 (ESC)</button>
      </div>
    `;
    
    this.uiLayer.appendChild(panel);
    this.currentPanel = 'quest';
  },

  acceptQuest(questId) {
    if (Quests.acceptQuest(Game.player, questId)) {
      this.showQuestPanel(null);
    }
  },

  completeQuest(questId) {
    if (Quests.completeQuest(Game.player, questId)) {
      this.showQuestPanel(null);
    }
  },

  abandonQuest(questId) {
    if (confirm('确定要放弃这个任务吗？')) {
      if (Quests.abandonQuest(Game.player, questId)) {
        this.showQuestPanel(null);
      }
    }
  },

  showShop(npc) {
    this.clearUI();
    
    const panel = document.createElement('div');
    panel.className = 'ui-panel';
    panel.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 25px;
      width: 700px;
      z-index: 150;
      max-height: 85vh;
      overflow-y: auto;
    `;
    
    const player = Game.player;
    const shopItems = npc.items.map(itemId => {
      const itemData = GameData.items[itemId];
      const rarityClass = itemData ? getRarityClass(itemData.rarity) : '';
      const canAfford = player.gold >= itemData.price;
      return `
        <div class="inventory-slot ${rarityClass}" 
             onclick="UI.buyItem('${itemId}')"
             onmouseenter="UI.showItemTooltip(event, '${itemId}')"
             onmouseleave="UI.hideTooltip()"
             style="opacity: ${canAfford ? 1 : 0.5}; cursor: ${canAfford ? 'pointer' : 'not-allowed'};">
          <span style="font-size: 22px;">${itemData.icon}</span>
          <span class="item-count" style="color: #f1c40f; font-size: 11px;">${itemData.price}</span>
        </div>
      `;
    }).join('');
    
    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 class="ui-title" style="font-size: 20px;">🏪 ${npc.name}</h2>
        <span style="color: #f1c40f; font-size: 16px;">💰 ${player.gold} 金币</span>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="color: #4fc3f7; margin-bottom: 10px; font-size: 14px;">商品列表</h3>
        <div style="display: grid; grid-template-columns: repeat(8, 50px); gap: 10px;">
          ${shopItems}
        </div>
      </div>
      
      <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
        <p style="color: rgba(200, 220, 255, 0.7); font-size: 13px;">
          💡 提示：点击物品购买。出售物品请打开背包（B键 或 Tab键）。
        </p>
      </div>
      
      <div style="margin-top: 20px; text-align: right;">
        <button class="ui-button secondary" onclick="UI.closePanel()">关闭 (ESC)</button>
      </div>
    `;
    
    this.uiLayer.appendChild(panel);
    this.currentPanel = 'shop';
  },

  buyItem(itemId) {
    if (Shop.buyItem(Game.player, itemId)) {
      const npc = MapManager.npcs.find(n => n.type === 'shop');
      this.showShop(npc);
    }
  },

  showEnhance() {
    this.clearUI();
    this.selectedItem = null;
    
    const panel = document.createElement('div');
    panel.className = 'ui-panel';
    panel.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 25px;
      width: 600px;
      z-index: 150;
      max-height: 85vh;
      overflow-y: auto;
    `;
    
    const player = Game.player;
    const equipItems = player.inventory.filter((item, idx) => {
      const itemData = GameData.items[item.itemId];
      return itemData && ['weapon', 'armor', 'helmet', 'boots'].includes(itemData.type);
    });
    
    let listHTML = '';
    if (equipItems.length === 0) {
      listHTML = '<p style="color: #888; font-size: 13px; padding: 20px; text-align: center;">没有可强化的装备</p>';
    } else {
      listHTML = equipItems.map((item, arrayIdx) => {
        const actualIdx = player.inventory.indexOf(item);
        const itemData = GameData.items[item.itemId];
        const rarityClass = getRarityClass(itemData.rarity);
        const curLv = item.enhanceLevel || 0;
        const cost = getEnhanceCost(curLv);
        const rate = Math.floor(getEnhanceSuccessRate(curLv) * 100);
        const canAfford = player.gold >= cost;
        
        const mainStat = itemData.type === 'weapon' ? 'atk' : 'def';
        const baseVal = itemData.stats ? (itemData.stats[mainStat] || 0) : 0;
        const currentBonus = curLv > 0 ? Math.floor(baseVal * 0.15 * curLv) : 0;
        const nextBonus = Math.floor(baseVal * 0.15 * (curLv + 1));
        const statName = mainStat === 'atk' ? '攻击' : '防御';
        
        return `
          <div style="display: flex; align-items: center; gap: 15px; padding: 12px; 
               background: rgba(255, 255, 255, 0.03); border-radius: 8px; margin-bottom: 10px;">
            <div class="inventory-slot ${rarityClass}" style="width: 50px; height: 50px; flex-shrink: 0;">
              <span style="font-size: 22px;">${itemData.icon}</span>
              ${curLv > 0 ? `<span style="position:absolute;top:0;right:2px;color:#f1c40f;font-size:10px;">+${curLv}</span>` : ''}
            </div>
            <div style="flex: 1;">
              <strong style="color: ${getRarityColor(itemData.rarity)}; font-size: 14px;">
                ${itemData.name}${curLv > 0 ? ` <span style="color:#f1c40f;">+${curLv}</span>` : ''}
              </strong>
              <div style="font-size: 12px; color: rgba(200, 220, 255, 0.7); margin-top: 3px;">
                费用: <span style="color: ${canAfford ? '#f1c40f' : '#e74c3c'};">${cost} 金币</span>
                <span style="margin-left: 15px;">成功率: <span style="color: ${rate >= 50 ? '#2ecc71' : '#e74c3c'};">${rate}%</span></span>
              </div>
              ${itemData.stats ? `
                <div style="font-size: 11px; color: #2ecc71; margin-top: 3px;">
                  当前: ${statName} +${baseVal + currentBonus}${curLv > 0 ? ` <span style="color:#f1c40f;">(强化+${currentBonus})</span>` : ''}
                  <span style="color: #888; margin: 0 6px;">→</span>
                  下一级: <span style="color:#f1c40f;">${statName} +${baseVal + nextBonus}</span>
                </div>
              ` : ''}
            </div>
            <button class="ui-button" style="padding: 8px 16px; font-size: 12px; opacity: ${canAfford ? 1 : 0.5};" 
                    onclick="UI.enhanceItem(${actualIdx})" ${canAfford ? '' : 'disabled'}>
              强化 +${curLv + 1}
            </button>
          </div>
        `;
      }).join('');
    }
    
    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 class="ui-title" style="font-size: 20px;">🔨 装备强化</h2>
        <span style="color: #f1c40f; font-size: 16px;">💰 ${player.gold} 金币</span>
      </div>
      
      <div style="margin-bottom: 15px;">
        ${listHTML}
      </div>
      
      <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
        <p style="color: rgba(200, 220, 255, 0.7); font-size: 12px; line-height: 1.6;">
          💡 提示：强化成功后装备属性提升15%。强化失败不会损坏装备，但金币不会退还。
          强化等级越高，费用越高，成功率越低。
        </p>
      </div>
      
      <div style="margin-top: 20px; text-align: right;">
        <button class="ui-button secondary" onclick="UI.closePanel()">关闭 (ESC)</button>
      </div>
    `;
    
    this.uiLayer.appendChild(panel);
    this.currentPanel = 'enhance';
  },

  enhanceItem(index) {
    const result = EnhanceSystem.enhance(Game.player, index);
    if (result !== undefined) {
      this.showEnhance();
    }
  },

  showTalentPanel() {
    this.clearUI();
    
    const panel = document.createElement('div');
    panel.className = 'ui-panel';
    panel.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 25px;
      width: 650px;
      z-index: 150;
      max-height: 85vh;
      overflow-y: auto;
    `;
    
    const player = Game.player;
    const talents = Object.entries(GameData.talents);
    
    const talentHTML = talents.map(([id, talent]) => {
      const currentLevel = player.talents[id] || 0;
      const maxed = currentLevel >= talent.maxLevel;
      const canLearn = player.talentPoints >= talent.cost && !maxed;
      const totalEffect = {};
      for (const stat in talent.effect) {
        const value = talent.effect[stat];
        if (typeof value === 'number' && value > 1) {
          totalEffect[stat] = Math.pow(value, currentLevel);
        } else {
          totalEffect[stat] = value * currentLevel;
        }
      }
      const effectText = this.formatStats(totalEffect);
      
      return `
        <div style="padding: 15px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; margin-bottom: 10px;
                    border: 2px solid ${currentLevel > 0 ? 'rgba(155, 89, 182, 0.5)' : 'rgba(255, 255, 255, 0.1)'};">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <strong style="color: #9b59b6; font-size: 14px;">${talent.name}</strong>
                <span style="color: ${maxed ? '#2ecc71' : '#f1c40f'}; font-size: 12px;">
                  Lv.${currentLevel}/${talent.maxLevel}
                </span>
              </div>
              <p style="color: rgba(200, 220, 255, 0.7); font-size: 12px; margin: 5px 0;">${talent.description}</p>
              ${currentLevel > 0 ? `<p style="color: #2ecc71; font-size: 11px;">当前效果: ${effectText}</p>` : ''}
            </div>
            <button class="ui-button" style="padding: 6px 12px; font-size: 12px; opacity: ${canLearn ? 1 : 0.5};" 
                    onclick="UI.learnTalent('${id}')" ${canLearn ? '' : 'disabled'}>
              学习 (${talent.cost}点)
            </button>
          </div>
        </div>
      `;
    }).join('');
    
    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 class="ui-title" style="font-size: 20px;">🌟 天赋树</h2>
        <span style="color: #9b59b6; font-size: 16px;">可用点数: ${player.talentPoints}</span>
      </div>
      
      <div style="margin-bottom: 15px;">
        ${talentHTML}
      </div>
      
      <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
        <p style="color: rgba(200, 220, 255, 0.7); font-size: 12px; line-height: 1.6;">
          💡 提示：每次升级获得1点天赋点数。天赋效果可以叠加，合理分配天赋点数可以大幅提升战斗力！
        </p>
      </div>
      
      <div style="margin-top: 20px; text-align: right;">
        <button class="ui-button secondary" onclick="UI.closePanel()">关闭 (ESC)</button>
      </div>
    `;
    
    this.uiLayer.appendChild(panel);
    this.currentPanel = 'talent';
  },

  learnTalent(talentId) {
    if (Game.player.learnTalent(talentId)) {
      this.showTalentPanel();
    }
  },

  showSkillPanel() {
    this.clearUI();
    
    const panel = document.createElement('div');
    panel.className = 'ui-panel';
    panel.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 25px;
      width: 600px;
      z-index: 150;
      max-height: 85vh;
      overflow-y: auto;
    `;
    
    const player = Game.player;
    const keys = ['J', 'U', 'I', 'O', 'P'];
    
    const skillHTML = player.skills.map((skillId, idx) => {
      const skill = GameData.skills[skillId];
      if (!skill) return '';
      
      const cooldown = (skill.cooldown / 1000).toFixed(1);
      
      return `
        <div style="padding: 15px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; margin-bottom: 10px;
                    border-left: 4px solid ${player.classData.color};">
          <div style="display: flex; align-items: flex-start; gap: 15px;">
            <div style="width: 50px; height: 50px; background: rgba(255, 255, 255, 0.1); border-radius: 8px; 
                        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
                        border: 2px solid rgba(100, 150, 255, 0.5);">
              <span style="font-size: 24px;">${skill.name.includes('攻击') ? '⚔' : skill.name.includes('斩') ? '🗡' : skill.name.includes('旋风') ? '🌀' : skill.name.includes('狂暴') ? '💢' : skill.name.includes('盾') ? '🛡' : skill.name.includes('火') ? '🔥' : skill.name.includes('冰') ? '❄️' : skill.name.includes('闪电') ? '⚡' : skill.name.includes('陨石') ? '☄️' : skill.name.includes('箭') ? '🏹' : skill.name.includes('闪避') ? '💨' : skill.name.includes('雨') ? '🌧️' : skill.name.includes('刺') ? '🗡' : skill.name.includes('毒') ? '☠️' : skill.name.includes('暗影') ? '👤' : skill.name.includes('背刺') ? '🗡' : '✨'}</span>
            </div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <strong style="color: ${player.classData.color}; font-size: 15px;">${skill.name}</strong>
                <span style="background: rgba(100, 150, 255, 0.2); color: #a0c4ff; padding: 2px 8px; border-radius: 4px; font-size: 11px;">
                  ${keys[idx] || ''}
                </span>
              </div>
              <p style="color: rgba(200, 220, 255, 0.7); font-size: 12px; margin: 5px 0;">${this.getSkillDescription(skill)}</p>
              <div style="display: flex; gap: 15px; font-size: 11px; margin-top: 5px;">
                <span style="color: #3498db;">💧 MP: ${skill.mpCost}</span>
                <span style="color: #e67e22;">⏱️ CD: ${cooldown}s</span>
                ${skill.damage ? `<span style="color: #e74c3c;">⚔ 伤害: ${Math.floor(skill.damage * 100)}%</span>` : ''}
                ${skill.range ? `<span style="color: #2ecc71;">📏 范围: ${skill.range}</span>` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    panel.innerHTML = `
      <h2 class="ui-title" style="font-size: 20px; margin-bottom: 20px;">⚔️ 技能列表</h2>
      
      <div style="margin-bottom: 15px;">
        ${skillHTML}
      </div>
      
      <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
        <p style="color: rgba(200, 220, 255, 0.7); font-size: 12px; line-height: 1.6;">
          💡 提示：合理使用技能连招可以造成更高伤害！普通攻击可以积累连击数，连击越高伤害加成越大。
        </p>
      </div>
      
      <div style="margin-top: 20px; text-align: right;">
        <button class="ui-button secondary" onclick="UI.closePanel()">关闭 (ESC)</button>
      </div>
    `;
    
    this.uiLayer.appendChild(panel);
    this.currentPanel = 'skills';
  },

  getSkillDescription(skill) {
    if (skill.buff) return '为自己施加增益效果';
    if (skill.teleport) return '瞬间移动并获得增益';
    if (skill.aoe) return '对范围内所有敌人造成伤害';
    if (skill.chain) return '闪电在多个敌人之间跳跃';
    if (skill.projectiles) return '发射多枚投射物';
    if (skill.projectile) return '发射一枚投射物';
    if (skill.stun) return '攻击敌人并使其眩晕';
    if (skill.dot) return '造成持续中毒伤害';
    if (skill.requireBehind) return '从背后攻击造成巨额伤害';
    return '基础攻击技能';
  },

  showMap() {
    this.clearUI();
    
    const panel = document.createElement('div');
    panel.className = 'ui-panel';
    panel.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 25px;
      width: 750px;
      max-height: 85vh;
      overflow-y: auto;
      z-index: 150;
    `;
    
    const regions = ['town', 'forest', 'mine', 'sky', 'tower', 'training'];
    const currentRegion = MapManager.currentRegion ? MapManager.currentRegion.id : 'town';
    
    const gradeColors = { S: '#f1c40f', A: '#e74c3c', B: '#3498db', C: '#2ecc71', D: '#95a5a6' };
    
    const formatTime = (ms) => {
      if (!ms) return '--:--';
      const m = Math.floor(ms / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      return `${m}:${s.toString().padStart(2, '0')}`;
    };
    
    const getBossRecord = (bossType) => {
      return Game.player && Game.player.bossRecords && Game.player.bossRecords[bossType];
    };
    
    const mapHTML = regions.map(regionId => {
      const region = GameData.regions[regionId];
      const isCurrent = regionId === currentRegion;
      const isLocked = false;
      
      const bosses = [];
      if (region.boss) bosses.push(region.boss);
      if (region.boss2) bosses.push(region.boss2);
      
      const regionCleared = bosses.length > 0 ? bosses.every(b => getBossRecord(b)) : true;
      
      const bossesHTML = bosses.map(bossType => {
        const monster = GameData.monsters[bossType];
        const record = getBossRecord(bossType);
        const bossName = monster ? monster.name : bossType;
        return `
          <div style="padding: 8px 10px; background: rgba(0, 0, 0, 0.2); border-radius: 6px; margin: 5px 0;
                      display: flex; align-items: center; gap: 10px; font-size: 11px; flex-wrap: wrap;">
            <span style="color: ${record ? '#2ecc71' : '#e74c3c'};">
              ${record ? '✅' : '⏳'}
            </span>
            <span style="color: #e74c3c; font-weight: bold;">👹 ${bossName}</span>
            <span style="color: #888;">
              评价:
              <span style="color: ${record && record.bestGrade ? gradeColors[record.bestGrade] : '#555'}; font-weight: bold;">
                ${record && record.bestGrade ? record.bestGrade : '—'}
              </span>
            </span>
            <span style="color: #888;">
              时间:
              <span style="color: ${record && record.bestTime ? '#4fc3f7' : '#555'}; font-weight: bold;">
                ${formatTime(record ? record.bestTime : null)}
              </span>
            </span>
            ${record && record.killCount > 1 ? `<span style="color: #888;">击杀: ${record.killCount}次</span>` : ''}
          </div>
        `;
      }).join('');
      
      return `
        <div style="padding: 15px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; margin-bottom: 10px;
                    border: 2px solid ${isCurrent ? region.color : 'rgba(255, 255, 255, 0.1)'};
                    opacity: ${isLocked ? 0.5 : 1};">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 15px;">
            <div style="display: flex; align-items: flex-start; gap: 15px; flex: 1;">
              <div style="width: 50px; height: 50px; border-radius: 50%; background: ${region.color};
                          display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">
                ${regionId === 'town' ? '🏠' : regionId === 'forest' ? '🌲' : regionId === 'mine' ? '⛏️' : regionId === 'sky' ? '☁️' : regionId === 'tower' ? '🏰' : '🎯'}
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                  <strong style="color: ${region.color}; font-size: 15px;">${region.name}</strong>
                  ${isCurrent ? '<span style="background: #2ecc71; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 10px;">当前</span>' : ''}
                  <span style="color: #888; font-size: 11px;">Lv.${region.levelRange}</span>
                  ${bosses.length > 0 ? (regionCleared
                    ? '<span style="background: rgba(46, 204, 113, 0.2); color: #2ecc71; padding: 2px 8px; border-radius: 4px; font-size: 10px;">✅ 区域通关</span>'
                    : '<span style="background: rgba(231, 76, 60, 0.2); color: #e74c3c; padding: 2px 8px; border-radius: 4px; font-size: 10px;">未通关</span>') : ''}
                </div>
                <p style="color: rgba(200, 220, 255, 0.7); font-size: 12px; margin: 5px 0;">${region.description}</p>
                ${bosses.length > 0 ? `<div>${bossesHTML}</div>` : ''}
              </div>
            </div>
            ${!isCurrent && !isLocked ? `
              <button class="ui-button" style="padding: 8px 16px; font-size: 12px; flex-shrink: 0;"
                      onclick="UI.teleportToRegion('${regionId}')">前往</button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
    
    panel.innerHTML = `
      <h2 class="ui-title" style="font-size: 20px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
        <span>🗺️ 世界地图</span>
        <button class="ui-button" style="padding: 6px 14px; font-size: 12px;" onclick="UI.showCharacterProfile()">📋 查看档案</button>
      </h2>

      <div style="margin-bottom: 15px;">
        ${mapHTML}
      </div>

      <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
        <p style="color: rgba(200, 220, 255, 0.7); font-size: 12px; line-height: 1.6;">
          💡 提示：击败区域首领后才能前往下一个区域。双首领区域需要击败所有首领才算通关。
        </p>
      </div>

      <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
        <button class="ui-button" onclick="UI.showCharacterProfile()">📋 角色档案</button>
        <button class="ui-button secondary" onclick="UI.closePanel()">关闭 (ESC)</button>
      </div>
    `;
    
    this.uiLayer.appendChild(panel);
    this.currentPanel = 'map';
  },

  teleportToRegion(regionId) {
    Game.changeRegion(regionId);
    this.closePanel();
  },

  showCodex() {
    this.clearUI();
    
    const panel = document.createElement('div');
    panel.className = 'ui-panel';
    panel.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 25px;
      width: 700px;
      z-index: 150;
      max-height: 85vh;
      overflow-y: auto;
    `;
    
    const player = Game.player;
    const monsters = Object.entries(GameData.monsters);
    
    const discovered = monsters.filter(([id]) => player.monsterCodex && player.monsterCodex[id]);
    const undiscovered = monsters.filter(([id]) => !player.monsterCodex || !player.monsterCodex[id]);
    
    const codexHTML = monsters.map(([id, monster]) => {
      const discovered = player.monsterCodex && player.monsterCodex[id];
      const isBoss = monster.isBoss;
      const isDummy = monster.isDummy;
      
      if (isDummy) return '';
      
      return `
        <div style="padding: 15px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; margin-bottom: 10px;
                    border: 2px solid ${isBoss ? 'rgba(231, 76, 60, 0.5)' : 'rgba(255, 255, 255, 0.1)'};
                    opacity: ${discovered ? 1 : 0.4};">
          <div style="display: flex; align-items: center; gap: 15px;">
            <div style="width: 50px; height: 50px; border-radius: 50%; background: ${discovered ? monster.color : '#333'}; 
                        display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">
              ${discovered ? (isBoss ? '👹' : monster.flying ? '🦅' : '👾') : '?'}
            </div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 3px;">
                <strong style="color: ${discovered ? (isBoss ? '#e74c3c' : '#fff') : '#666'}; font-size: 15px;">
                  ${discovered ? monster.name : '???'}
                </strong>
                ${isBoss ? '<span style="background: #e74c3c; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 10px;">BOSS</span>' : ''}
                ${monster.flying ? '<span style="background: #3498db; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 10px;">飞行</span>' : ''}
              </div>
              ${discovered ? `
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; font-size: 11px; margin-top: 5px;">
                  <span style="color: #e74c3c;">❤️ HP: ${monster.hp}</span>
                  <span style="color: #e67e22;">⚔ ATK: ${monster.atk}</span>
                  <span style="color: #3498db;">🛡 DEF: ${monster.def}</span>
                  <span style="color: #2ecc71;">👟 SPD: ${monster.spd}</span>
                </div>
                <div style="font-size: 11px; margin-top: 5px;">
                  <span style="color: #f1c40f;">💰 金币: ${monster.gold}</span>
                  <span style="color: #9b59b6; margin-left: 15px;">⭐ EXP: ${monster.exp}</span>
                </div>
                ${monster.drops.length > 0 ? `
                  <div style="font-size: 11px; margin-top: 5px; color: rgba(200, 220, 255, 0.7);">
                    掉落: ${monster.drops.map(d => {
                      const item = GameData.items[d.item];
                      return item ? `${item.icon}${item.name}` : d.item;
                    }).join(', ')}
                  </div>
                ` : ''}
              ` : `
                <p style="color: #666; font-size: 12px; margin-top: 5px;">尚未发现，击败后解锁信息</p>
              `}
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 class="ui-title" style="font-size: 20px;">📖 怪物图鉴</h2>
        <span style="color: #4fc3f7; font-size: 14px;">已发现: ${discovered.length}/${monsters.length - 1}</span>
      </div>
      
      <div style="margin-bottom: 15px;">
        ${codexHTML}
      </div>
      
      <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
        <p style="color: rgba(200, 220, 255, 0.7); font-size: 12px; line-height: 1.6;">
          💡 提示：击败怪物即可解锁图鉴信息。收集所有怪物可以获得成就奖励！
        </p>
      </div>
      
      <div style="margin-top: 20px; text-align: right;">
        <button class="ui-button secondary" onclick="UI.closePanel()">关闭 (ESC)</button>
      </div>
    `;
    
    this.uiLayer.appendChild(panel);
    this.currentPanel = 'codex';
  },

  showCharacterProfile() {
    this.clearUI();
    if (!Game.player) return;

    const panel = document.createElement('div');
    panel.className = 'ui-panel';
    panel.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 25px;
      width: 750px;
      max-height: 85vh;
      overflow-y: auto;
      z-index: 150;
    `;

    const player = Game.player;
    const gradeColors = { S: '#f1c40f', A: '#e74c3c', B: '#3498db', C: '#2ecc71', D: '#95a5a6' };

    const formatTime = (ms) => {
      if (!ms) return '--:--';
      const m = Math.floor(ms / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return '—';
      const d = new Date(timestamp);
      return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
    };

    const allBosses = ['mushroom_king', 'spider_queen', 'stone_giant', 'sky_dragon', 'mecha_boss'];
    const bossRegionMap = {
      mushroom_king: 'forest',
      spider_queen: 'mine',
      stone_giant: 'sky',
      sky_dragon: 'tower',
      mecha_boss: 'tower'
    };

    const totalBossKills = allBosses.reduce((sum, b) => {
      const rec = player.bossRecords && player.bossRecords[b];
      return sum + (rec ? rec.killCount : 0);
    }, 0);

    const totalCleared = allBosses.filter(b => player.bossRecords && player.bossRecords[b]).length;

    const badges = player.inventory.filter(item => {
      const data = GameData.items[item.itemId];
      return data && data.type === 'badge';
    });

    const bossRows = allBosses.map(bossType => {
      const monster = GameData.monsters[bossType];
      const region = GameData.regions[bossRegionMap[bossType]];
      const record = player.bossRecords && player.bossRecords[bossType];
      const bossName = monster ? monster.name : bossType;
      const regionName = region ? region.name : '—';
      const regionColor = region ? region.color : '#888';
      const badgeId = `badge_${bossType}`;
      const hasBadge = player.hasItem(badgeId);
      const badgeData = GameData.items[badgeId];

      return `
        <div style="padding: 12px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; margin-bottom: 8px;
                    display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 20px;">
            ${record ? '✅' : '🔒'}
          </span>
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <strong style="color: #e74c3c;">👹 ${bossName}</strong>
              <span style="color: ${regionColor}; font-size: 11px;">📍 ${regionName}</span>
              ${hasBadge && badgeData ? `<span style="background: rgba(241, 196, 15, 0.2); color: #f1c40f; padding: 1px 6px; border-radius: 3px; font-size: 10px;">🏅 ${badgeData.icon} ${badgeData.name}</span>` : ''}
            </div>
            ${record ? `
              <div style="display: flex; gap: 18px; margin-top: 5px; font-size: 11px; color: #888; flex-wrap: wrap;">
                <span>评价: <strong style="color: ${gradeColors[record.bestGrade]};">${record.bestGrade}</strong></span>
                <span>最快: <strong style="color: #4fc3f7;">${formatTime(record.bestTime)}</strong></span>
                <span>击杀: <strong style="color: #ecf0f1;">${record.killCount} 次</strong></span>
                <span>首杀: <strong style="color: #bdc3c7;">${formatDate(record.firstKill)}</strong></span>
              </div>
            ` : `
              <div style="color: #666; font-size: 11px; margin-top: 5px;">尚未击败</div>
            `}
          </div>
        </div>
      `;
    }).join('');

    const stats = player.getStats();
    const statLabels = {
      atk: '攻击', def: '防御', hp: '生命', mp: '魔力',
      spd: '速度', crit: '暴击率', critDamage: '暴击伤害',
      lifesteal: '生命偷取', evasion: '闪避率',
      expBonus: '经验加成', goldBonus: '金币加成'
    };

    const statsHTML = Object.keys(statLabels).map(key => {
      if (stats[key] === undefined || stats[key] === null) return '';
      let value = stats[key];
      let suffix = '';
      if (key === 'crit' || key === 'evasion' || key === 'lifesteal') {
        value = (value * 100).toFixed(0);
        suffix = '%';
      }
      if (key === 'critDamage') {
        value = (value * 100).toFixed(0);
        suffix = '%';
      }
      if (key === 'expBonus' || key === 'goldBonus') {
        if (value === 1 || value === undefined) return '';
        value = ((value - 1) * 100).toFixed(0);
        suffix = '%';
      }
      return `<div style="flex: 1; min-width: 80px; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 6px; text-align: center;">
        <div style="color: #888; font-size: 10px;">${statLabels[key]}</div>
        <div style="color: #ecf0f1; font-size: 14px; font-weight: bold;">${value}${suffix}</div>
      </div>`;
    }).filter(h => h).join('');

    const badgesHTML = badges.length > 0 ? badges.map(item => {
      const data = GameData.items[item.itemId];
      const statText = data.stats ? Object.keys(data.stats).map(k => {
        let v = data.stats[k];
        if (v > 1 && k !== 'crit' && k !== 'lifesteal' && k !== 'critDamage') {
          return `+${((v - 1) * 100).toFixed(0)}% ${statLabels[k] || k}`;
        }
        return `+${v} ${statLabels[k] || k}`;
      }).join(' ') : '';
      return `
        <div style="flex: 1; min-width: 150px; padding: 10px; background: rgba(241, 196, 15, 0.08); 
                    border: 1px solid rgba(241, 196, 15, 0.3); border-radius: 6px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px;">${data.icon}</span>
            <div>
              <div style="color: #f1c40f; font-weight: bold; font-size: 12px;">${data.name}</div>
              <div style="color: #888; font-size: 10px;">${data.source}</div>
            </div>
          </div>
          ${statText ? `<div style="color: #2ecc71; font-size: 11px; margin-top: 5px;">${statText}</div>` : ''}
        </div>
      `;
    }).join('') : '<div style="color: #666; font-size: 12px; padding: 10px;">还没有获得任何首领徽章，去击败区域首领吧！</div>';

    panel.innerHTML = `
      <h2 class="ui-title" style="font-size: 20px; margin-bottom: 20px;">📋 角色档案</h2>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
        <div style="padding: 15px; background: rgba(0, 0, 0, 0.2); border-radius: 8px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
            <div style="width: 50px; height: 50px; border-radius: 50%; background: #3498db;
                        display: flex; align-items: center; justify-content: center; font-size: 24px;">
              ⚔️
            </div>
            <div>
              <div style="font-size: 16px; font-weight: bold;">${player.name}</div>
              <div style="color: #888; font-size: 12px;">Lv.${player.level} ${player.subClassId || player.classId}</div>
            </div>
          </div>
          <div style="display: flex; gap: 10px; font-size: 11px; color: #888;">
            <span>👑 金币: <strong style="color: #f1c40f;">${player.gold}</strong></span>
            <span>💰 累计收入: <strong style="color: #f1c40f;">${player.totalGoldEarned || 0}</strong></span>
          </div>
        </div>

        <div style="padding: 15px; background: rgba(0, 0, 0, 0.2); border-radius: 8px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; text-align: center;">
            <div>
              <div style="color: #e74c3c; font-size: 20px; font-weight: bold;">${totalCleared}/${allBosses.length}</div>
              <div style="color: #888; font-size: 11px;">首领通关</div>
            </div>
            <div>
              <div style="color: #f1c40f; font-size: 20px; font-weight: bold;">${totalBossKills}</div>
              <div style="color: #888; font-size: 11px;">首领总击杀</div>
            </div>
            <div>
              <div style="color: #3498db; font-size: 20px; font-weight: bold;">${player.totalKills || 0}</div>
              <div style="color: #888; font-size: 11px;">累计击杀</div>
            </div>
          </div>
        </div>
      </div>

      <h3 style="color: #3498db; margin: 15px 0 10px; font-size: 14px;">⚔️ 当前属性</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
        ${statsHTML}
      </div>

      <h3 style="color: #e74c3c; margin: 15px 0 10px; font-size: 14px;">🏆 首领挑战记录</h3>
      <div style="margin-bottom: 20px;">
        ${bossRows}
      </div>

      <h3 style="color: #f1c40f; margin: 15px 0 10px; font-size: 14px;">🏅 首领徽章收藏 (${badges.length}/5)</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
        ${badgesHTML}
      </div>

      <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
        <button class="ui-button" onclick="UI.showMap()">🗺️ 查看地图</button>
        <button class="ui-button secondary" onclick="UI.closePanel()">关闭 (ESC)</button>
      </div>
    `;

    this.uiLayer.appendChild(panel);
    this.currentPanel = 'profile';
  },

  showLevelResult(report) {
    this.clearUI();
    Game.paused = true;

    const { victory, clearTime, maxCombo, monstersKilled, itemsPickedUp, goldChange, expGained, grade, regionId } = report;
    const region = MapManager.currentRegion;
    
    const panel = document.createElement('div');
    panel.className = 'ui-panel';
    panel.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 30px;
      width: 620px;
      z-index: 200;
      max-height: 88vh;
      overflow-y: auto;
      animation: fadeIn 0.5s ease-out;
    `;
    
    const minutes = Math.floor(clearTime / 60000);
    const seconds = Math.floor((clearTime % 60000) / 1000);
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const gradeColors = { S: '#f1c40f', A: '#e74c3c', B: '#3498db', C: '#2ecc71', D: '#95a5a6' };
    
    const killsArr = Object.entries(monstersKilled || {});
    const totalKills = killsArr.reduce((sum, [, v]) => sum + v.count, 0);
    const killsHTML = totalKills > 0 ? killsArr.map(([type, info]) => `
      <div style="display: flex; align-items: center; gap: 10px; padding: 6px 10px;
                  background: rgba(255, 255, 255, 0.03); border-radius: 6px; margin-bottom: 4px;">
        <div style="width: 26px; height: 26px; border-radius: 50%; background: ${info.color || '#555'};
                    display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0;">
          ${info.isBoss ? '👹' : '👾'}
        </div>
        <span style="color: ${info.isBoss ? '#e74c3c' : '#e0e8ff'}; flex: 1; font-size: 13px;">${info.name}</span>
        <span style="color: #f39c12; font-size: 13px; font-weight: bold;">x${info.count}</span>
      </div>
    `).join('') : '<p style="color: #666; text-align: center; padding: 15px; font-size: 12px;">本关未击败任何怪物</p>';
    
    const itemsArr = Object.entries(itemsPickedUp || {});
    const regularItems = itemsArr.filter(([itemId]) => {
      const data = GameData.items[itemId];
      return data && data.type !== 'badge';
    });
    const badgeItems = itemsArr.filter(([itemId]) => {
      const data = GameData.items[itemId];
      return data && data.type === 'badge';
    });
    
    const regularItemsHTML = regularItems.length > 0 ? regularItems.map(([itemId, count]) => {
      const itemData = GameData.items[itemId];
      if (!itemData) return '';
      const rarityColor = getRarityColor(itemData.rarity);
      return `
        <div style="display: flex; align-items: center; gap: 10px; padding: 6px 10px; 
                    background: rgba(255, 255, 255, 0.03); border-radius: 6px; margin-bottom: 4px;">
          <span style="font-size: 16px;">${itemData.icon}</span>
          <span style="color: ${rarityColor}; flex: 1; font-size: 13px;">${itemData.name}</span>
          <span style="color: #f1c40f; font-size: 13px; font-weight: bold;">x${count}</span>
        </div>
      `;
    }).join('') : '<p style="color: #666; text-align: center; padding: 15px; font-size: 12px;">本关未获得物品</p>';
    
    const badgesHTML = badgeItems.length > 0 ? `
      <div style="margin-top: 15px; padding: 12px; background: rgba(241, 196, 15, 0.08); 
                  border: 2px solid rgba(241, 196, 15, 0.4); border-radius: 8px;">
        <h4 style="color: #f1c40f; margin: 0 0 8px; font-size: 13px;">🏅 获得首领徽章！</h4>
        ${badgeItems.map(([itemId, count]) => {
          const itemData = GameData.items[itemId];
          if (!itemData) return '';
          const statText = itemData.stats ? Object.keys(itemData.stats).map(k => {
            const statNames = { atk: '攻击', def: '防御', hp: '生命', mp: '魔力', spd: '速度', expBonus: '经验加成', goldBonus: '金币加成' };
            let v = itemData.stats[k];
            if (v > 1 && k !== 'crit' && k !== 'lifesteal' && k !== 'critDamage') {
              return `+${((v - 1) * 100).toFixed(0)}% ${statNames[k] || k}`;
            }
            return `+${v} ${statNames[k] || k}`;
          }).join(' ') : '';
          return `
            <div style="display: flex; align-items: center; gap: 10px; padding: 6px 10px;
                        background: rgba(0, 0, 0, 0.2); border-radius: 6px; margin-bottom: 4px;">
              <span style="font-size: 20px;">${itemData.icon}</span>
              <div style="flex: 1;">
                <div style="color: #f1c40f; font-weight: bold; font-size: 13px;">${itemData.name}</div>
                ${statText ? `<div style="color: #2ecc71; font-size: 11px;">${statText}</div>` : ''}
                ${itemData.source ? `<div style="color: #888; font-size: 10px;">来源: ${itemData.source}</div>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    ` : '';
    
    panel.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 class="ui-title" style="font-size: 28px; margin-bottom: 8px; 
            color: ${victory ? '#2ecc71' : '#e74c3c'};">
          ${victory ? '🏆 通关成功' : '💀 挑战失败'}
        </h2>
        <p style="color: rgba(200, 220, 255, 0.6); font-size: 12px;">${region ? region.name : ''}</p>
        ${victory && grade ? `
          <div style="font-size: 56px; font-weight: bold; color: ${gradeColors[grade]}; 
                      text-shadow: 0 0 20px ${gradeColors[grade]}; margin: 10px 0;">
            ${grade}
          </div>
        ` : ''}
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px;">
        <div style="padding: 12px 10px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; text-align: center;">
          <div style="color: #888; font-size: 11px; margin-bottom: 3px;">通关时间</div>
          <div style="color: #4fc3f7; font-size: 18px; font-weight: bold;">${timeStr}</div>
        </div>
        <div style="padding: 12px 10px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; text-align: center;">
          <div style="color: #888; font-size: 11px; margin-bottom: 3px;">最大连击</div>
          <div style="color: #f39c12; font-size: 18px; font-weight: bold;">${maxCombo}</div>
        </div>
        <div style="padding: 12px 10px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; text-align: center;">
          <div style="color: #888; font-size: 11px; margin-bottom: 3px;">金币变化</div>
          <div style="color: ${goldChange >= 0 ? '#f1c40f' : '#e74c3c'}; font-size: 18px; font-weight: bold;">
            ${goldChange >= 0 ? '+' : ''}${goldChange}
          </div>
        </div>
        <div style="padding: 12px 10px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; text-align: center;">
          <div style="color: #888; font-size: 11px; margin-bottom: 3px;">获得经验</div>
          <div style="color: #9b59b6; font-size: 18px; font-weight: bold;">+${expGained}</div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
        <div>
          <h3 style="color: #4fc3f7; margin-bottom: 8px; font-size: 13px;">⚔️ 击败怪物 (${totalKills})</h3>
          <div style="max-height: 160px; overflow-y: auto; padding-right: 4px;">
            ${killsHTML}
          </div>
        </div>
        <div>
          <h3 style="color: #4fc3f7; margin-bottom: 8px; font-size: 13px;">📦 获得物品 (已进背包)</h3>
          <div style="max-height: 160px; overflow-y: auto; padding-right: 4px;">
            ${regularItemsHTML}
          </div>
          ${badgesHTML}
        </div>
      </div>
      
      <div style="padding: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; margin-bottom: 20px;">
        <p style="color: rgba(200, 220, 255, 0.7); font-size: 12px; line-height: 1.6;">
          ${victory ? `✅ 已击败区域首领，可以前往下一区域了！` : `💡 可以继续挑战或返回城镇休整。`}
        </p>
      </div>

      <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        <button class="ui-button" onclick="UI.returnToTown()">返回城镇</button>
        <button class="ui-button" onclick="UI.showCharacterProfile()">📋 查看档案</button>
        ${victory ? `
          <button class="ui-button secondary" onclick="UI.continueExploring()">继续探索</button>
        ` : `
          <button class="ui-button secondary" onclick="UI.retryLevel()">重新挑战</button>
        `}
        <button class="ui-button secondary" onclick="UI.retryLevel()">🔄 再挑战一次</button>
      </div>
    `;
    
    this.uiLayer.appendChild(panel);
    this.currentPanel = 'level_result';
  },

  calculateGrade(clearTime, maxCombo) {
    if (clearTime < 60000 && maxCombo >= 50) return 'S';
    if (clearTime < 120000 && maxCombo >= 30) return 'A';
    if (clearTime < 180000 && maxCombo >= 15) return 'B';
    if (clearTime < 300000 && maxCombo >= 5) return 'C';
    return 'D';
  },

  returnToTown() {
    Game.changeRegion('town');
    Game.paused = false;
    this.showHUD();
  },

  continueExploring() {
    Game.paused = false;
    this.showHUD();
  },

  retryLevel() {
    const currentRegion = MapManager.currentRegion;
    if (currentRegion) {
      MapManager.loadRegion(currentRegion.id);
      Game.player.x = 200;
      Game.player.y = 450;
      Game.player.currentHP = Game.player.maxHP;
      Game.player.currentMP = Game.player.maxMP;
      Game.player.comboCount = 0;
      Game.player.maxCombo = 0;
      Game.startLevel();
    }
    Game.paused = false;
    this.showHUD();
  }
};