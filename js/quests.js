const Quests = {
  availableQuests: [],
  activeQuests: [],
  completedQuests: [],

  init() {
    this.availableQuests = [];
    this.activeQuests = [];
    this.completedQuests = [];
  },

  loadForPlayer(player) {
    this.availableQuests = [];
    this.activeQuests = player.quests.active || [];
    this.completedQuests = player.quests.completed || [];

    for (const questId in GameData.quests) {
      const quest = GameData.quests[questId];
      if (!this.canAccept(player, questId)) continue;
      if (this.isActive(questId) || this.isCompleted(questId)) continue;
      this.availableQuests.push(questId);
    }
  },

  canAccept(player, questId) {
    const quest = GameData.quests[questId];
    if (!quest) return false;
    if (player.level < quest.level) return false;
    if (quest.prereq && !this.isCompleted(quest.prereq)) return false;
    return true;
  },

  isActive(questId) {
    return this.activeQuests.some(q => q.id === questId);
  },

  isCompleted(questId) {
    return this.completedQuests.includes(questId);
  },

  acceptQuest(player, questId) {
    if (!this.canAccept(player, questId)) return false;
    if (this.isActive(questId)) return false;
    if (this.isCompleted(questId)) return false;

    const quest = GameData.quests[questId];
    const progress = quest.type === 'kill' ? { kills: {} } : { collected: {} };
    
    this.activeQuests.push({
      id: questId,
      progress,
      acceptedAt: Date.now()
    });

    player.quests.active = this.activeQuests;
    showNotification(`接取任务：${quest.name}`, 'success');
    
    const index = this.availableQuests.indexOf(questId);
    if (index > -1) {
      this.availableQuests.splice(index, 1);
    }
    
    return true;
  },

  completeQuest(player, questId) {
    const questIndex = this.activeQuests.findIndex(q => q.id === questId);
    if (questIndex === -1) return false;

    const quest = GameData.quests[questId];
    const activeQuest = this.activeQuests[questIndex];

    if (!this.isQuestComplete(activeQuest, quest)) return false;

    if (quest.rewards.exp) {
      player.gainExp(quest.rewards.exp);
    }
    if (quest.rewards.gold) {
      player.gainGold(quest.rewards.gold);
    }
    if (quest.rewards.items) {
      for (const item of quest.rewards.items) {
        player.addItem(item);
      }
    }

    this.activeQuests.splice(questIndex, 1);
    this.completedQuests.push(questId);
    player.quests.active = this.activeQuests;
    player.quests.completed = this.completedQuests;

    showNotification(`任务完成：${quest.name}`, 'success');
    return true;
  },

  isQuestComplete(activeQuest, quest) {
    if (quest.type === 'kill') {
      const target = quest.target;
      const kills = activeQuest.progress.kills[target.monster] || 0;
      return kills >= target.count;
    } else if (quest.type === 'collect') {
      const target = quest.target;
      const collected = activeQuest.progress.collected[target.item] || 0;
      return collected >= target.count;
    }
    return false;
  },

  checkKill(player, monsterType) {
    for (const activeQuest of this.activeQuests) {
      const quest = GameData.quests[activeQuest.id];
      if (quest.type !== 'kill') continue;
      if (quest.target.monster !== monsterType) continue;

      activeQuest.progress.kills[monsterType] = (activeQuest.progress.kills[monsterType] || 0) + 1;

      if (this.isQuestComplete(activeQuest, quest)) {
        showNotification(`任务目标已完成：${quest.name}`, 'success');
      }
    }
    player.quests.active = this.activeQuests;
  },

  checkCollect(player, itemId, count) {
    for (const activeQuest of this.activeQuests) {
      const quest = GameData.quests[activeQuest.id];
      if (quest.type !== 'collect') continue;
      if (quest.target.item !== itemId) continue;

      activeQuest.progress.collected[itemId] = (activeQuest.progress.collected[itemId] || 0) + count;

      if (this.isQuestComplete(activeQuest, quest)) {
        showNotification(`任务目标已完成：${quest.name}`, 'success');
      }
    }
    player.quests.active = this.activeQuests;
  },

  getProgress(activeQuest) {
    const quest = GameData.quests[activeQuest.id];
    if (quest.type === 'kill') {
      const target = quest.target;
      const kills = activeQuest.progress.kills[target.monster] || 0;
      return `${kills}/${target.count}`;
    } else if (quest.type === 'collect') {
      const target = quest.target;
      const collected = activeQuest.progress.collected[target.item] || 0;
      return `${collected}/${target.count}`;
    }
    return '0/0';
  },

  abandonQuest(player, questId) {
    const questIndex = this.activeQuests.findIndex(q => q.id === questId);
    if (questIndex === -1) return false;

    this.activeQuests.splice(questIndex, 1);
    player.quests.active = this.activeQuests;
    
    const quest = GameData.quests[questId];
    showNotification(`放弃任务：${quest.name}`, 'warning');
    
    return true;
  }
};
