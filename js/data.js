const GameData = {
  classes: {
    warrior: {
      name: '战士',
      description: '近战物理输出，高生命值和防御',
      baseStats: { hp: 150, mp: 50, atk: 15, def: 12, spd: 4, crit: 5 },
      skills: ['slash', 'whirlwind', 'rage', 'shield_bash'],
      color: '#e74c3c',
      subClasses: {
        berserker: { name: '狂战士', bonusStats: { atk: 5, hp: 20 }, description: '高攻击，牺牲防御换取伤害' },
        paladin: { name: '圣骑士', bonusStats: { def: 5, hp: 30 }, description: '高防御，拥有治疗和保护能力' }
      }
    },
    mage: {
      name: '法师',
      description: '远程魔法输出，高伤害但脆弱',
      baseStats: { hp: 80, mp: 150, atk: 20, def: 5, spd: 5, crit: 8 },
      skills: ['fireball', 'ice_spike', 'lightning', 'meteor'],
      color: '#3498db',
      subClasses: {
        fireMage: { name: '火法师', bonusStats: { atk: 5, mp: 20 }, description: '火焰系魔法，高爆发伤害' },
        iceMage: { name: '冰法师', bonusStats: { def: 3, mp: 30 }, description: '冰霜系魔法，可减速敌人' }
      }
    },
    archer: {
      name: '弓箭手',
      description: '远程物理输出，高攻速和暴击',
      baseStats: { hp: 100, mp: 80, atk: 18, def: 7, spd: 6, crit: 15 },
      skills: ['arrow_shot', 'multi_shot', 'evasion', 'arrow_rain'],
      color: '#2ecc71',
      subClasses: {
        hunter: { name: '猎人', bonusStats: { crit: 5, spd: 1 }, description: '高暴击，擅长追踪猎物' },
        ranger: { name: '游侠', bonusStats: { atk: 3, def: 3 }, description: '平衡型，适合各种战斗场景' }
      }
    },
    thief: {
      name: '飞侠',
      description: '近战敏捷输出，高暴击和闪避',
      baseStats: { hp: 90, mp: 70, atk: 16, def: 6, spd: 7, crit: 20 },
      skills: ['quick_stab', 'poison_dagger', 'shadow_step', 'backstab'],
      color: '#9b59b6',
      subClasses: {
        assassin: { name: '刺客', bonusStats: { crit: 8, atk: 3 }, description: '超高暴击，一击必杀' },
        rogue: { name: '盗贼', bonusStats: { spd: 2, def: 2 }, description: '高机动性，擅长躲避和偷窃' }
      }
    }
  },

  skills: {
    basic_attack: { name: '普通攻击', damage: 1, cooldown: 0, mpCost: 0, range: 60 },
    slash: { name: '斩击', damage: 1.5, cooldown: 1000, mpCost: 5, range: 70 },
    whirlwind: { name: '旋风斩', damage: 2, cooldown: 3000, mpCost: 15, range: 100, aoe: true },
    rage: { name: '狂暴', damage: 0, cooldown: 10000, mpCost: 20, range: 0, buff: { atk: 1.5, duration: 5000 } },
    shield_bash: { name: '盾击', damage: 1.2, cooldown: 2000, mpCost: 10, range: 50, stun: 1000 },
    fireball: { name: '火球术', damage: 2.5, cooldown: 1500, mpCost: 15, range: 200, projectile: true },
    ice_spike: { name: '冰锥术', damage: 1.8, cooldown: 1200, mpCost: 12, range: 180, projectile: true, slow: 0.5 },
    lightning: { name: '闪电链', damage: 2, cooldown: 2500, mpCost: 20, range: 250, chain: 3 },
    meteor: { name: '陨石术', damage: 4, cooldown: 8000, mpCost: 40, range: 300, aoe: true },
    arrow_shot: { name: '射箭', damage: 1.5, cooldown: 500, mpCost: 3, range: 250, projectile: true },
    multi_shot: { name: '多重射击', damage: 1, cooldown: 2000, mpCost: 12, range: 200, projectiles: 3 },
    evasion: { name: '闪避', damage: 0, cooldown: 5000, mpCost: 10, range: 0, buff: { evasion: 100, duration: 2000 } },
    arrow_rain: { name: '箭雨', damage: 1.5, cooldown: 6000, mpCost: 25, range: 250, aoe: true },
    quick_stab: { name: '快刺', damage: 1.2, cooldown: 400, mpCost: 4, range: 50 },
    poison_dagger: { name: '毒刃', damage: 1, cooldown: 2000, mpCost: 12, range: 55, dot: { damage: 0.3, duration: 5000 } },
    shadow_step: { name: '暗影步', damage: 0, cooldown: 4000, mpCost: 15, range: 0, teleport: true, buff: { atk: 1.3, duration: 3000 } },
    backstab: { name: '背刺', damage: 3, cooldown: 5000, mpCost: 20, range: 50, requireBehind: true }
  },

  monsters: {
    slime: {
      name: '蓝史莱姆',
      hp: 30, atk: 5, def: 2, spd: 1.5, exp: 10, gold: 5,
      drops: [{ item: 'slime_gel', chance: 0.3 }],
      color: '#3498db', size: 25, isBoss: false
    },
    mushroom: {
      name: '蘑菇怪',
      hp: 45, atk: 8, def: 3, spd: 1.2, exp: 15, gold: 8,
      drops: [{ item: 'mushroom_cap', chance: 0.4 }],
      color: '#e74c3c', size: 28, isBoss: false
    },
    pig: {
      name: '野猪',
      hp: 60, atk: 12, def: 5, spd: 2.5, exp: 25, gold: 12,
      drops: [{ item: 'leather', chance: 0.5 }],
      color: '#8b4513', size: 35, isBoss: false
    },
    bat: {
      name: '蝙蝠',
      hp: 35, atk: 10, def: 2, spd: 4, exp: 18, gold: 10,
      drops: [{ item: 'bat_wing', chance: 0.35 }],
      color: '#2c3e50', size: 22, isBoss: false, flying: true
    },
    skeleton: {
      name: '骷髅兵',
      hp: 80, atk: 15, def: 8, spd: 2, exp: 35, gold: 18,
      drops: [{ item: 'bone', chance: 0.45 }],
      color: '#ecf0f1', size: 32, isBoss: false
    },
    golem: {
      name: '石头人',
      hp: 150, atk: 20, def: 15, spd: 1, exp: 50, gold: 25,
      drops: [{ item: 'stone_fragment', chance: 0.5 }],
      color: '#7f8c8d', size: 45, isBoss: false
    },
    harpy: {
      name: '哈比',
      hp: 100, atk: 22, def: 10, spd: 4.5, exp: 60, gold: 30,
      drops: [{ item: 'feather', chance: 0.4 }],
      color: '#e91e63', size: 30, isBoss: false, flying: true
    },
    robot: {
      name: '机械兵',
      hp: 120, atk: 25, def: 12, spd: 2.5, exp: 70, gold: 35,
      drops: [{ item: 'metal_plate', chance: 0.55 }],
      color: '#607d8b', size: 38, isBoss: false
    },
    spider: {
      name: '洞穴蜘蛛',
      hp: 70, atk: 13, def: 5, spd: 3, exp: 30, gold: 15,
      drops: [{ item: 'spider_silk', chance: 0.15 }],
      color: '#6a1b9a', size: 26, isBoss: false
    },
    mushroom_king: {
      name: '蘑菇王',
      hp: 300, atk: 25, def: 10, spd: 1.5, exp: 200, gold: 150,
      drops: [{ item: 'crown_mushroom', chance: 1 }, { item: 'hp_potion_large', chance: 0.5 }],
      color: '#c0392b', size: 60, isBoss: true
    },
    spider_queen: {
      name: '蜘蛛女王',
      hp: 500, atk: 35, def: 15, spd: 2.5, exp: 400, gold: 300,
      drops: [{ item: 'spider_silk', chance: 1 }, { item: 'rare_helmet', chance: 0.3 }],
      color: '#4a148c', size: 70, isBoss: true
    },
    stone_giant: {
      name: '石巨人',
      hp: 800, atk: 45, def: 25, spd: 1, exp: 600, gold: 500,
      drops: [{ item: 'giant_heart', chance: 1 }, { item: 'rare_armor', chance: 0.3 }],
      color: '#5d4037', size: 80, isBoss: true
    },
    sky_dragon: {
      name: '天空龙',
      hp: 1200, atk: 60, def: 20, spd: 5, exp: 1000, gold: 800,
      drops: [{ item: 'dragon_scale', chance: 1 }, { item: 'rare_boots', chance: 0.3 }],
      color: '#00bcd4', size: 90, isBoss: true, flying: true
    },
    mecha_boss: {
      name: '机甲巨兽',
      hp: 2000, atk: 80, def: 30, spd: 2, exp: 2000, gold: 1500,
      drops: [{ item: 'mecha_core', chance: 1 }, { item: 'legendary_weapon', chance: 0.2 }],
      color: '#ff5722', size: 100, isBoss: true
    },
    training_dummy: {
      name: '训练木桩',
      hp: 99999, atk: 0, def: 0, spd: 0, exp: 0, gold: 0,
      drops: [], color: '#8d6e63', size: 40, isBoss: false, isDummy: true
    }
  },

  items: {
    gold: { name: '金币', type: 'currency', description: '通用货币', color: '#f1c40f', icon: '●' },
    slime_gel: { name: '史莱姆凝胶', type: 'material', description: '黏糊糊的凝胶，可用于制作药水', color: '#3498db', icon: '◆', price: 10 },
    mushroom_cap: { name: '蘑菇盖', type: 'material', description: '蘑菇的伞盖，有药用价值', color: '#e74c3c', icon: '▲', price: 15 },
    leather: { name: '皮革', type: 'material', description: '兽皮制作的皮革', color: '#8b4513', icon: '■', price: 20 },
    bat_wing: { name: '蝙蝠翅膀', type: 'material', description: '蝙蝠的翅膀，轻而坚韧', color: '#2c3e50', icon: '✦', price: 25 },
    bone: { name: '骨头', type: 'material', description: '骷髅兵的骨头', color: '#ecf0f1', icon: '✧', price: 18 },
    stone_fragment: { name: '石头碎片', type: 'material', description: '石头人身上的碎石', color: '#7f8c8d', icon: '◆', price: 30 },
    feather: { name: '哈比羽毛', type: 'material', description: '彩色的羽毛', color: '#e91e63', icon: '✦', price: 35 },
    metal_plate: { name: '金属板', type: 'material', description: '机械兵的装甲板', color: '#607d8b', icon: '■', price: 40 },
    crown_mushroom: { name: '王冠蘑菇', type: 'material', description: '蘑菇王的王冠，珍贵材料', color: '#f1c40f', icon: '♔', price: 200, rarity: 'rare' },
    spider_silk: { name: '蜘蛛丝', type: 'material', description: '蜘蛛女王的丝线，非常坚韧', color: '#9c27b0', icon: '✧', price: 350, rarity: 'rare' },
    giant_heart: { name: '巨人心脏', type: 'material', description: '石巨人的核心', color: '#e91e63', icon: '♥', price: 500, rarity: 'epic' },
    dragon_scale: { name: '龙鳞', type: 'material', description: '天空龙的鳞片', color: '#00bcd4', icon: '◆', price: 800, rarity: 'epic' },
    mecha_core: { name: '机甲核心', type: 'material', description: '机甲巨兽的能量核心', color: '#ff5722', icon: '◎', price: 1500, rarity: 'legendary' },
    hp_potion_small: { name: '小型生命药水', type: 'consumable', description: '恢复50点生命值', color: '#e74c3c', icon: '⚗', price: 20, effect: { hp: 50 } },
    hp_potion_medium: { name: '中型生命药水', type: 'consumable', description: '恢复150点生命值', color: '#c0392b', icon: '⚗', price: 60, effect: { hp: 150 } },
    hp_potion_large: { name: '大型生命药水', type: 'consumable', description: '恢复300点生命值', color: '#922b21', icon: '⚗', price: 150, effect: { hp: 300 } },
    mp_potion_small: { name: '小型魔法药水', type: 'consumable', description: '恢复30点魔法值', color: '#3498db', icon: '⚗', price: 25, effect: { mp: 30 } },
    mp_potion_medium: { name: '中型魔法药水', type: 'consumable', description: '恢复80点魔法值', color: '#2980b9', icon: '⚗', price: 70, effect: { mp: 80 } },
    basic_sword: { name: '新手剑', type: 'weapon', description: '新手使用的剑', color: '#bdc3c7', icon: '⚔', price: 100, stats: { atk: 5 }, rarity: 'common' },
    steel_sword: { name: '钢剑', type: 'weapon', description: '钢制的长剑', color: '#95a5a6', icon: '⚔', price: 300, stats: { atk: 12 }, rarity: 'common' },
    flame_sword: { name: '烈焰剑', type: 'weapon', description: '燃烧着火焰的剑', color: '#e74c3c', icon: '⚔', price: 800, stats: { atk: 25 }, rarity: 'rare' },
    thunder_blade: { name: '雷霆之刃', type: 'weapon', description: '附带雷电的长刀', color: '#f1c40f', icon: '⚔', price: 2000, stats: { atk: 45, crit: 5 }, rarity: 'epic' },
    legendary_weapon: { name: '创世神兵', type: 'weapon', description: '传说中的神器', color: '#f39c12', icon: '⚔', price: 5000, stats: { atk: 80, crit: 10, spd: 2 }, rarity: 'legendary' },
    basic_staff: { name: '新手法杖', type: 'weapon', description: '新手使用的法杖', color: '#8b4513', icon: '🪄', price: 100, stats: { atk: 5, mp: 10 }, rarity: 'common' },
    basic_bow: { name: '新手弓', type: 'weapon', description: '新手使用的弓', color: '#8d6e63', icon: '🏹', price: 100, stats: { atk: 5, crit: 3 }, rarity: 'common' },
    basic_dagger: { name: '新手匕首', type: 'weapon', description: '新手使用的匕首', color: '#7f8c8d', icon: '🗡', price: 100, stats: { atk: 5, spd: 1 }, rarity: 'common' },
    cloth_armor: { name: '布甲', type: 'armor', description: '布料制作的护甲', color: '#ecf0f1', icon: '🛡', price: 80, stats: { def: 3, hp: 20 }, rarity: 'common' },
    leather_armor: { name: '皮甲', type: 'armor', description: '皮革制作的护甲', color: '#8b4513', icon: '🛡', price: 250, stats: { def: 8, hp: 50 }, rarity: 'common' },
    chain_mail: { name: '锁子甲', type: 'armor', description: '铁链编织的护甲', color: '#95a5a6', icon: '🛡', price: 600, stats: { def: 15, hp: 80 }, rarity: 'rare' },
    plate_armor: { name: '板甲', type: 'armor', description: '全身金属板甲', color: '#7f8c8d', icon: '🛡', price: 1500, stats: { def: 25, hp: 150 }, rarity: 'epic' },
    rare_armor: { name: '龙鳞甲', type: 'armor', description: '用龙鳞制作的护甲', color: '#00bcd4', icon: '🛡', price: 3000, stats: { def: 40, hp: 200, mp: 50 }, rarity: 'legendary' },
    basic_helmet: { name: '布帽', type: 'helmet', description: '普通的布帽', color: '#ecf0f1', icon: '⛑', price: 50, stats: { def: 1, hp: 10 }, rarity: 'common' },
    iron_helmet: { name: '铁盔', type: 'helmet', description: '铁制头盔', color: '#7f8c8d', icon: '⛑', price: 180, stats: { def: 5, hp: 30 }, rarity: 'common' },
    rare_helmet: { name: '王者头盔', type: 'helmet', description: '镶嵌宝石的头盔', color: '#f39c12', icon: '⛑', price: 1200, stats: { def: 12, hp: 60, crit: 3 }, rarity: 'epic' },
    basic_boots: { name: '布靴', type: 'boots', description: '普通的布靴', color: '#8b4513', icon: '👢', price: 50, stats: { spd: 1, def: 1 }, rarity: 'common' },
    leather_boots: { name: '皮靴', type: 'boots', description: '皮革制作的靴子', color: '#6d4c41', icon: '👢', price: 150, stats: { spd: 2, def: 2 }, rarity: 'common' },
    rare_boots: { name: '疾风之靴', type: 'boots', description: '增加移动速度的魔法靴', color: '#4fc3f7', icon: '👢', price: 1000, stats: { spd: 5, def: 5, hp: 30 }, rarity: 'epic' },
    hidden_key: { name: '隐藏宝箱钥匙', type: 'key', description: '可以打开隐藏宝箱', color: '#f39c12', icon: '🗝', price: 0 },
    teleport_scroll: { name: '传送卷轴', type: 'consumable', description: '返回城镇', color: '#9b59b6', icon: '📜', price: 50, effect: { teleport: 'town' } },
    badge_mushroom_king: { name: '蘑菇王徽章', type: 'badge', description: '击败蘑菇王获得。永久 +2 攻击', color: '#27ae60', icon: '🍄', price: 0, stats: { atk: 2 }, source: '蘑菇森林·蘑菇王' },
    badge_spider_queen: { name: '蜘蛛女王徽章', type: 'badge', description: '击败蜘蛛女王获得。永久 +3 防御', color: '#8e44ad', icon: '🕷️', price: 0, stats: { def: 3 }, source: '废弃矿洞·蜘蛛女王' },
    badge_stone_giant: { name: '石巨人徽章', type: 'badge', description: '击败石巨人获得。永久 +50 生命上限', color: '#795548', icon: '🗿', price: 0, stats: { maxHp: 50 }, source: '天空栈道·石巨人' },
    badge_sky_dragon: { name: '天空龙徽章', type: 'badge', description: '击败天空龙获得。永久 5% 金币加成', color: '#00bcd4', icon: '🐉', price: 0, stats: { goldBonus: 1.05 }, source: '机械塔·天空龙' },
    badge_mecha_boss: { name: '机甲巨兽徽章', type: 'badge', description: '击败机甲巨兽获得。永久 5% 经验加成', color: '#ff5722', icon: '🤖', price: 0, stats: { expBonus: 1.05 }, source: '机械塔·机甲巨兽' }
  },

  regions: {
    town: {
      id: 'town',
      name: '港口小镇',
      description: '宁静的海边小镇，冒险者的起点',
      color: '#3498db',
      bgColor: '#1a3a5c',
      groundColor: '#8b7355',
      levelRange: '1-10',
      monsters: [],
      npcs: ['shop_owner', 'blacksmith', 'quest_giver', 'talent_master'],
      portals: [{ to: 'forest', x: 1200, y: 450, label: '→ 蘑菇森林' }],
      chests: []
    },
    forest: {
      id: 'forest',
      name: '蘑菇森林',
      description: '充满蘑菇和怪物的神秘森林',
      color: '#27ae60',
      bgColor: '#1a3a2e',
      groundColor: '#4a6741',
      levelRange: '5-15',
      monsters: ['slime', 'mushroom', 'pig'],
      boss: 'mushroom_king',
      bossX: 2000,
      npcs: [],
      portals: [
        { to: 'town', x: 50, y: 450, label: '← 港口小镇' },
        { to: 'mine', x: 2500, y: 450, label: '→ 废弃矿洞' }
      ],
      chests: [{ x: 1500, y: 480, loot: ['hp_potion_medium', 'gold'], locked: false }]
    },
    mine: {
      id: 'mine',
      name: '废弃矿洞',
      description: '阴暗潮湿的废弃矿洞',
      color: '#8b4513',
      bgColor: '#2d1f1f',
      groundColor: '#3d2b1f',
      levelRange: '12-25',
      monsters: ['bat', 'skeleton', 'spider'],
      boss: 'spider_queen',
      bossX: 2200,
      npcs: [],
      portals: [
        { to: 'forest', x: 50, y: 450, label: '← 蘑菇森林' },
        { to: 'sky', x: 2700, y: 450, label: '→ 天空栈道' }
      ],
      chests: [{ x: 1800, y: 480, loot: ['mp_potion_medium', 'gold', 'gold'], locked: true }]
    },
    sky: {
      id: 'sky',
      name: '天空栈道',
      description: '漂浮在云端的神秘栈道',
      color: '#00bcd4',
      bgColor: '#87ceeb',
      groundColor: '#e0e0e0',
      levelRange: '20-40',
      monsters: ['harpy', 'golem'],
      boss: 'stone_giant',
      bossX: 2400,
      npcs: [],
      portals: [
        { to: 'mine', x: 50, y: 450, label: '← 废弃矿洞' },
        { to: 'tower', x: 2900, y: 450, label: '→ 机械塔' }
      ],
      chests: [{ x: 2000, y: 480, loot: ['chain_mail', 'gold', 'gold', 'gold'], locked: true }]
    },
    tower: {
      id: 'tower',
      name: '机械塔',
      description: '充满机械造物的高塔',
      color: '#ff5722',
      bgColor: '#2d2d2d',
      groundColor: '#424242',
      levelRange: '35-60',
      monsters: ['robot', 'golem'],
      boss: 'sky_dragon',
      boss2: 'mecha_boss',
      bossX: 2400,
      boss2X: 2600,
      npcs: [],
      portals: [
        { to: 'sky', x: 50, y: 450, label: '← 天空栈道' }
      ],
      chests: [{ x: 2200, y: 480, loot: ['thunder_blade', 'gold', 'gold', 'gold', 'gold'], locked: true }]
    },
    training: {
      id: 'training',
      name: '训练场',
      description: '测试伤害的地方',
      color: '#9e9e9e',
      bgColor: '#424242',
      groundColor: '#616161',
      levelRange: '任何等级',
      monsters: ['training_dummy'],
      npcs: [],
      portals: [{ to: 'town', x: 50, y: 450, label: '← 港口小镇' }],
      chests: []
    }
  },

  quests: {
    q1: {
      id: 'q1',
      name: '初出茅庐',
      description: '击败5只史莱姆',
      type: 'kill',
      target: { monster: 'slime', count: 5 },
      rewards: { exp: 50, gold: 100, items: ['hp_potion_small'] },
      level: 1,
      npc: 'quest_giver',
      region: 'forest'
    },
    q2: {
      id: 'q2',
      name: '蘑菇猎人',
      description: '收集3个蘑菇盖',
      type: 'collect',
      target: { item: 'mushroom_cap', count: 3 },
      rewards: { exp: 80, gold: 150 },
      level: 5,
      npc: 'quest_giver',
      prereq: 'q1',
      region: 'forest'
    },
    q3: {
      id: 'q3',
      name: '野猪之患',
      description: '击败3只野猪',
      type: 'kill',
      target: { monster: 'pig', count: 3 },
      rewards: { exp: 120, gold: 200, items: ['leather_boots'] },
      level: 8,
      npc: 'quest_giver',
      prereq: 'q2',
      region: 'forest'
    },
    q4: {
      id: 'q4',
      name: '蘑菇王',
      description: '击败蘑菇王',
      type: 'kill',
      target: { monster: 'mushroom_king', count: 1 },
      rewards: { exp: 300, gold: 500, items: ['steel_sword'] },
      level: 12,
      npc: 'quest_giver',
      prereq: 'q3',
      region: 'forest',
      isBoss: true
    },
    q5: {
      id: 'q5',
      name: '矿洞探险',
      description: '收集5块骨头',
      type: 'collect',
      target: { item: 'bone', count: 5 },
      rewards: { exp: 200, gold: 300 },
      level: 15,
      npc: 'quest_giver',
      prereq: 'q4',
      region: 'mine'
    },
    q6: {
      id: 'q6',
      name: '蜘蛛女王',
      description: '击败蜘蛛女王',
      type: 'kill',
      target: { monster: 'spider_queen', count: 1 },
      rewards: { exp: 600, gold: 1000, items: ['chain_mail'] },
      level: 20,
      npc: 'quest_giver',
      prereq: 'q5',
      region: 'mine',
      isBoss: true
    },
    q7: {
      id: 'q7',
      name: '材料收集',
      description: '收集3块石头碎片',
      type: 'collect',
      target: { item: 'stone_fragment', count: 3 },
      rewards: { exp: 400, gold: 500 },
      level: 25,
      npc: 'quest_giver',
      prereq: 'q6',
      region: 'sky'
    },
    q8: {
      id: 'q8',
      name: '石巨人',
      description: '击败石巨人',
      type: 'kill',
      target: { monster: 'stone_giant', count: 1 },
      rewards: { exp: 1000, gold: 2000, items: ['plate_armor'] },
      level: 30,
      npc: 'quest_giver',
      prereq: 'q7',
      region: 'sky',
      isBoss: true
    },
    q9: {
      id: 'q9',
      name: '天空的威胁',
      description: '收集5根哈比羽毛',
      type: 'collect',
      target: { item: 'feather', count: 5 },
      rewards: { exp: 800, gold: 1000 },
      level: 35,
      npc: 'quest_giver',
      prereq: 'q8',
      region: 'tower'
    },
    q10: {
      id: 'q10',
      name: '天空龙',
      description: '击败天空龙',
      type: 'kill',
      target: { monster: 'sky_dragon', count: 1 },
      rewards: { exp: 2000, gold: 4000, items: ['thunder_blade'] },
      level: 40,
      npc: 'quest_giver',
      prereq: 'q9',
      region: 'tower',
      isBoss: true
    },
    q11: {
      id: 'q11',
      name: '机械零件',
      description: '收集5块金属板',
      type: 'collect',
      target: { item: 'metal_plate', count: 5 },
      rewards: { exp: 1500, gold: 2000 },
      level: 45,
      npc: 'quest_giver',
      prereq: 'q10',
      region: 'tower'
    },
    q12: {
      id: 'q12',
      name: '最终决战',
      description: '击败机甲巨兽',
      type: 'kill',
      target: { monster: 'mecha_boss', count: 1 },
      rewards: { exp: 5000, gold: 10000, items: ['legendary_weapon'] },
      level: 55,
      npc: 'quest_giver',
      prereq: 'q11',
      region: 'tower',
      isBoss: true,
      isFinal: true
    }
  },

  talents: {
    t1: { id: 't1', name: '力量强化', description: '攻击力 +10%', effect: { atk: 1.1 }, cost: 1, maxLevel: 5 },
    t2: { id: 't2', name: '生命强化', description: '生命值 +15%', effect: { hp: 1.15 }, cost: 1, maxLevel: 5 },
    t3: { id: 't3', name: '防御强化', description: '防御力 +10%', effect: { def: 1.1 }, cost: 1, maxLevel: 5 },
    t4: { id: 't4', name: '暴击精通', description: '暴击率 +3%', effect: { crit: 3 }, cost: 2, maxLevel: 5 },
    t5: { id: 't5', name: '迅捷', description: '移动速度 +5%', effect: { spd: 1.05 }, cost: 2, maxLevel: 5 },
    t6: { id: 't6', name: '魔力精通', description: '魔法值 +20%', effect: { mp: 1.2 }, cost: 1, maxLevel: 5 },
    t7: { id: 't7', name: '吸血', description: '攻击吸血 +2%', effect: { lifesteal: 2 }, cost: 3, maxLevel: 3 },
    t8: { id: 't8', name: '暴击伤害', description: '暴击伤害 +20%', effect: { critDamage: 1.2 }, cost: 3, maxLevel: 3 },
    t9: { id: 't9', name: '经验加成', description: '获得经验 +10%', effect: { expBonus: 1.1 }, cost: 2, maxLevel: 3 },
    t10: { id: 't10', name: '金币加成', description: '获得金币 +15%', effect: { goldBonus: 1.15 }, cost: 2, maxLevel: 3 }
  },

  npcs: {
    shop_owner: {
      name: '杂货商人',
      type: 'shop',
      items: [
        'hp_potion_small', 'hp_potion_medium', 'hp_potion_large',
        'mp_potion_small', 'mp_potion_medium',
        'basic_sword', 'basic_staff', 'basic_bow', 'basic_dagger',
        'cloth_armor', 'leather_armor', 'basic_helmet', 'basic_boots',
        'teleport_scroll'
      ],
      x: 300,
      y: 450
    },
    blacksmith: {
      name: '铁匠',
      type: 'enhance',
      x: 500,
      y: 450
    },
    quest_giver: {
      name: '镇长',
      type: 'quest',
      x: 700,
      y: 450
    },
    talent_master: {
      name: '天赋导师',
      type: 'talent',
      x: 900,
      y: 450
    }
  },

  platforms: {
    town: [
      { x: 0, y: 520, width: 3000, height: 200 },
      { x: 400, y: 420, width: 150, height: 20 },
      { x: 650, y: 350, width: 150, height: 20 },
      { x: 900, y: 280, width: 150, height: 20 }
    ],
    forest: [
      { x: 0, y: 520, width: 3000, height: 200 },
      { x: 300, y: 420, width: 120, height: 20 },
      { x: 550, y: 380, width: 120, height: 20 },
      { x: 800, y: 440, width: 120, height: 20 },
      { x: 1050, y: 360, width: 120, height: 20 },
      { x: 1300, y: 400, width: 120, height: 20 },
      { x: 1600, y: 350, width: 120, height: 20 },
      { x: 1900, y: 420, width: 120, height: 20 },
      { x: 2200, y: 380, width: 150, height: 20 }
    ],
    mine: [
      { x: 0, y: 520, width: 3000, height: 200 },
      { x: 250, y: 440, width: 100, height: 20 },
      { x: 450, y: 380, width: 100, height: 20 },
      { x: 650, y: 440, width: 100, height: 20 },
      { x: 900, y: 350, width: 120, height: 20 },
      { x: 1150, y: 420, width: 100, height: 20 },
      { x: 1400, y: 360, width: 120, height: 20 },
      { x: 1700, y: 400, width: 120, height: 20 },
      { x: 2000, y: 350, width: 150, height: 20 }
    ],
    sky: [
      { x: 0, y: 520, width: 3000, height: 200 },
      { x: 200, y: 450, width: 100, height: 20 },
      { x: 400, y: 380, width: 100, height: 20 },
      { x: 600, y: 310, width: 100, height: 20 },
      { x: 850, y: 380, width: 100, height: 20 },
      { x: 1100, y: 440, width: 100, height: 20 },
      { x: 1350, y: 350, width: 120, height: 20 },
      { x: 1600, y: 280, width: 120, height: 20 },
      { x: 1900, y: 350, width: 120, height: 20 },
      { x: 2200, y: 420, width: 150, height: 20 }
    ],
    tower: [
      { x: 0, y: 520, width: 3000, height: 200 },
      { x: 300, y: 430, width: 120, height: 20 },
      { x: 550, y: 360, width: 120, height: 20 },
      { x: 800, y: 300, width: 120, height: 20 },
      { x: 1050, y: 380, width: 120, height: 20 },
      { x: 1300, y: 450, width: 120, height: 20 },
      { x: 1600, y: 350, width: 150, height: 20 },
      { x: 1900, y: 280, width: 150, height: 20 },
      { x: 2200, y: 360, width: 150, height: 20 }
    ],
    training: [
      { x: 0, y: 520, width: 1500, height: 200 },
      { x: 300, y: 420, width: 100, height: 20 },
      { x: 600, y: 360, width: 100, height: 20 }
    ]
  },

  monsterSpawns: {
    forest: [
      { x: 400, y: 495, type: 'slime' },
      { x: 700, y: 495, type: 'mushroom' },
      { x: 1000, y: 495, type: 'slime' },
      { x: 1300, y: 495, type: 'pig' },
      { x: 1600, y: 495, type: 'mushroom' },
      { x: 1800, y: 495, type: 'slime' }
    ],
    mine: [
      { x: 400, y: 495, type: 'bat' },
      { x: 700, y: 495, type: 'skeleton' },
      { x: 1000, y: 495, type: 'bat' },
      { x: 1300, y: 495, type: 'skeleton' },
      { x: 1600, y: 495, type: 'bat' },
      { x: 1900, y: 495, type: 'skeleton' }
    ],
    sky: [
      { x: 400, y: 495, type: 'harpy' },
      { x: 700, y: 495, type: 'golem' },
      { x: 1000, y: 495, type: 'harpy' },
      { x: 1300, y: 495, type: 'golem' },
      { x: 1600, y: 495, type: 'harpy' },
      { x: 2000, y: 495, type: 'golem' }
    ],
    tower: [
      { x: 400, y: 495, type: 'robot' },
      { x: 700, y: 495, type: 'golem' },
      { x: 1000, y: 495, type: 'robot' },
      { x: 1300, y: 495, type: 'robot' },
      { x: 1600, y: 495, type: 'golem' },
      { x: 2000, y: 495, type: 'robot' }
    ],
    training: [
      { x: 800, y: 495, type: 'training_dummy' }
    ]
  }
};

function getExpForLevel(level) {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

function getEnhanceCost(level) {
  return Math.floor(100 * Math.pow(1.8, level));
}

function getEnhanceSuccessRate(level) {
  return Math.max(0.1, 1 - level * 0.08);
}
