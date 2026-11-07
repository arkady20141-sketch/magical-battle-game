// ===== CHARACTER DATA =====
// Jujutsu Kaisen (Магічна Битва) Characters with revealed abilities

const CHARACTERS = {
    gojo: {
        name: "Сатору Годжо",
        title: "Найсильніший",
        health: 120,
        mana: 100,
        speed: 8,
        
        // Sprite info
        sprite: {
            idle: { frames: [0, 1, 2, 3], speed: 0.1 },
            walk: { frames: [4, 5, 6, 7], speed: 0.1 },
            jump: { frames: [8, 9], speed: 0.1 },
            light: { frames: [10, 11, 12], speed: 0.08 },
            heavy: { frames: [13, 14, 15], speed: 0.1 },
            special: { frames: [16, 17, 18, 19], speed: 0.1 },
            block: { frames: [20, 21], speed: 0.1 },
            hit: { frames: [22, 23], speed: 0.1 },
            finish: { frames: [24, 25, 26, 27], speed: 0.15 }
        },
        
        // Colors for simple rendering
        colors: {
            body: '#ffffff',
            hair: '#ffffff',
            outfit: '#0000ff',
            eyes: '#000000'
        },
        
        // Abilities
        abilities: {
            light: {
                name: "Легкий удар",
                damage: 8,
                mana: 0,
                cooldown: 0.5,
                range: 40
            },
            heavy: {
                name: "Сильний удар",
                damage: 15,
                mana: 0,
                cooldown: 0.8,
                range: 50
            },
            special: {
                name: "Безмежний",
                damage: 30,
                mana: 30,
                cooldown: 3,
                range: 100,
                effect: 'stun'
            },
            finish: {
                name: "Пурпур",
                damage: 50,
                description: "Годжо активує свій Пурпур і знищує суперника"
            }
        },
        
        // AI behavior
        ai: {
            aggression: 0.7,
            defense: 0.3,
            comboChance: 0.6
        }
    },
    
    yuji: {
        name: "Юуджі Ітадорі",
        title: "Прокляття",
        health: 110,
        mana: 80,
        speed: 7,
        
        sprite: {
            idle: { frames: [0, 1, 2, 3], speed: 0.1 },
            walk: { frames: [4, 5, 6, 7], speed: 0.1 },
            jump: { frames: [8, 9], speed: 0.1 },
            light: { frames: [10, 11, 12], speed: 0.08 },
            heavy: { frames: [13, 14, 15], speed: 0.1 },
            special: { frames: [16, 17, 18, 19], speed: 0.1 },
            block: { frames: [20, 21], speed: 0.1 },
            hit: { frames: [22, 23], speed: 0.1 },
            finish: { frames: [24, 25, 26, 27], speed: 0.15 }
        },
        
        colors: {
            body: '#ffcc99',
            hair: '#333333',
            outfit: '#000000',
            eyes: '#ff0000'
        },
        
        abilities: {
            light: {
                name: "Кулак",
                damage: 10,
                mana: 0,
                cooldown: 0.4,
                range: 45
            },
            heavy: {
                name: "Потужний кулак",
                damage: 18,
                mana: 0,
                cooldown: 0.7,
                range: 55
            },
            special: {
                name: "Прокляття Сукuna",
                damage: 25,
                mana: 25,
                cooldown: 4,
                range: 60,
                effect: 'bleed'
            },
            finish: {
                name: "Розрив",
                damage: 50,
                description: "Юуджі розриває суперника на частини"
            }
        },
        
        ai: {
            aggression: 0.8,
            defense: 0.2,
            comboChance: 0.7
        }
    },
    
    megumi: {
        name: "Мегумі Фушігуро",
        title: "Чаклун",
        health: 100,
        mana: 120,
        speed: 6,
        
        sprite: {
            idle: { frames: [0, 1, 2, 3], speed: 0.1 },
            walk: { frames: [4, 5, 6, 7], speed: 0.1 },
            jump: { frames: [8, 9], speed: 0.1 },
            light: { frames: [10, 11, 12], speed: 0.08 },
            heavy: { frames: [13, 14, 15], speed: 0.1 },
            special: { frames: [16, 17, 18, 19], speed: 0.1 },
            block: { frames: [20, 21], speed: 0.1 },
            hit: { frames: [22, 23], speed: 0.1 },
            finish: { frames: [24, 25, 26, 27], speed: 0.15 }
        },
        
        colors: {
            body: '#cccccc',
            hair: '#000000',
            outfit: '#006633',
            eyes: '#00ff00'
        },
        
        abilities: {
            light: {
                name: "Ніж",
                damage: 7,
                mana: 0,
                cooldown: 0.3,
                range: 50,
                projectile: true
            },
            heavy: {
                name: "Чорна стріла",
                damage: 14,
                mana: 10,
                cooldown: 0.9,
                range: 100,
                projectile: true
            },
            special: {
                name: "10 Тіней",
                damage: 20,
                mana: 40,
                cooldown: 5,
                range: 200,
                effect: 'summon'
            },
            finish: {
                name: "Махоромат",
                damage: 50,
                description: "Мегумі призиває свого шікігамі для добивання"
            }
        },
        
        ai: {
            aggression: 0.5,
            defense: 0.5,
            comboChance: 0.4
        }
    },
    
    nobara: {
        name: "Нобара Куджо",
        title: "Мисливець",
        health: 95,
        mana: 90,
        speed: 7,
        
        sprite: {
            idle: { frames: [0, 1, 2, 3], speed: 0.1 },
            walk: { frames: [4, 5, 6, 7], speed: 0.1 },
            jump: { frames: [8, 9], speed: 0.1 },
            light: { frames: [10, 11, 12], speed: 0.08 },
            heavy: { frames: [13, 14, 15], speed: 0.1 },
            special: { frames: [16, 17, 18, 19], speed: 0.1 },
            block: { frames: [20, 21], speed: 0.1 },
            hit: { frames: [22, 23], speed: 0.1 },
            finish: { frames: [24, 25, 26, 27], speed: 0.15 }
        },
        
        colors: {
            body: '#ffcc99',
            hair: '#cc6600',
            outfit: '#ff6699',
            eyes: '#ff0066'
        },
        
        abilities: {
            light: {
                name: "Молот",
                damage: 9,
                mana: 0,
                cooldown: 0.5,
                range: 45
            },
            heavy: {
                name: "Цвях",
                damage: 16,
                mana: 5,
                cooldown: 0.8,
                range: 80,
                projectile: true
            },
            special: {
                name: "Молот Богini",
                damage: 28,
                mana: 35,
                cooldown: 4,
                range: 60,
                effect: 'stun'
            },
            finish: {
                name: "Смертельний удар",
                damage: 50,
                description: "Нобара вбиває суперника ударом молоту в голову"
            }
        },
        
        ai: {
            aggression: 0.6,
            defense: 0.4,
            comboChance: 0.5
        }
    },
    
    sukuna: {
        name: "Рюомен Сукuna",
        title: "Король Проклять",
        health: 130,
        mana: 70,
        speed: 9,
        
        sprite: {
            idle: { frames: [0, 1, 2, 3], speed: 0.1 },
            walk: { frames: [4, 5, 6, 7], speed: 0.1 },
            jump: { frames: [8, 9], speed: 0.1 },
            light: { frames: [10, 11, 12], speed: 0.08 },
            heavy: { frames: [13, 14, 15], speed: 0.1 },
            special: { frames: [16, 17, 18, 19], speed: 0.1 },
            block: { frames: [20, 21], speed: 0.1 },
            hit: { frames: [22, 23], speed: 0.1 },
            finish: { frames: [24, 25, 26, 27], speed: 0.15 }
        },
        
        colors: {
            body: '#ffffff',
            hair: '#333333',
            outfit: '#660000',
            eyes: '#ff0000'
        },
        
        abilities: {
            light: {
                name: "Кіготь",
                damage: 12,
                mana: 0,
                cooldown: 0.4,
                range: 50
            },
            heavy: {
                name: "Розрив",
                damage: 20,
                mana: 0,
                cooldown: 0.6,
                range: 60
            },
            special: {
                name: "Кров'яна атака",
                damage: 35,
                mana: 20,
                cooldown: 2.5,
                range: 80,
                effect: 'lifesteal'
            },
            finish: {
                name: "Вічне Прокляття",
                damage: 50,
                description: "Сукuna знищує суперника своїм прокляттям"
            }
        },
        
        ai: {
            aggression: 0.9,
            defense: 0.1,
            comboChance: 0.8
        }
    },
    
    toji: {
        name: "Тоджі Фушігуро",
        title: "Вбивця Проклять",
        health: 105,
        mana: 60,
        speed: 10,
        
        sprite: {
            idle: { frames: [0, 1, 2, 3], speed: 0.1 },
            walk: { frames: [4, 5, 6, 7], speed: 0.1 },
            jump: { frames: [8, 9], speed: 0.1 },
            light: { frames: [10, 11, 12], speed: 0.08 },
            heavy: { frames: [13, 14, 15], speed: 0.1 },
            special: { frames: [16, 17, 18, 19], speed: 0.1 },
            block: { frames: [20, 21], speed: 0.1 },
            hit: { frames: [22, 23], speed: 0.1 },
            finish: { frames: [24, 25, 26, 27], speed: 0.15 }
        },
        
        colors: {
            body: '#ffffff',
            hair: '#333333',
            outfit: '#888888',
            eyes: '#000000'
        },
        
        abilities: {
            light: {
                name: "Швидкий удар",
                damage: 8,
                mana: 0,
                cooldown: 0.3,
                range: 40
            },
            heavy: {
                name: "Комбо",
                damage: 12,
                mana: 0,
                cooldown: 0.5,
                range: 45
            },
            special: {
                name: "Беззбройний",
                damage: 25,
                mana: 15,
                cooldown: 3,
                range: 70,
                effect: 'disarm'
            },
            finish: {
                name: "Вбивчий удар",
                damage: 50,
                description: "Тоджі вбиває суперника одним ударом"
            }
        },
        
        ai: {
            aggression: 0.8,
            defense: 0.2,
            comboChance: 0.9
        }
    }
};

// Finish move descriptions
const FINISH_MOVES = {
    gojo: {
        name: "Пурпур",
        description: "Годжо активує свій Пурпур і перемагає суперника",
        animation: "purple"
    },
    yuji: {
        name: "Розрив Сукuna",
        description: "Юуджі використовує силу Сукuna для добивання",
        animation: "cleave"
    },
    megumi: {
        name: "Махоромат",
        description: "Мегумі призиває свого шікігамі для фінального удару",
        animation: "summon"
    },
    nobara: {
        name: "Смертельний Молот",
        description: "Нобара вбиває суперника ударом молоту",
        animation: "hammer"
    },
    sukuna: {
        name: "Вічне Прокляття",
        description: "Сукuna знищує суперника своїм прокляттям",
        animation: "cursed"
    },
    toji: {
        name: "Вбивчий Удар",
        description: "Тоджі вбиває суперника одним точним ударом",
        animation: "slice"
    }
};

// Character portraits (base64 encoded simple pixel art)
const PORTRAITS = {
    gojo: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23ffffff"/><circle cx="32" cy="20" r="8" fill="%23ffffff"/><path d="M20 30 Q32 40 44 30 Q32 50 20 30" fill="%230000ff"/><rect x="24" y="45" width="16" height="12" fill="%230000ff"/></svg>`)}`,
    yuji: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23ffcc99"/><circle cx="32" cy="20" r="8" fill="%23333333"/><path d="M20 30 Q32 40 44 30 Q32 50 20 30" fill="%23000000"/><rect x="24" y="45" width="16" height="12" fill="%23000000"/></svg>`)}`,
    megumi: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23cccccc"/><circle cx="32" cy="20" r="8" fill="%23000000"/><path d="M20 30 Q32 40 44 30 Q32 50 20 30" fill="%23006633"/><rect x="24" y="45" width="16" height="12" fill="%23006633"/></svg>`)}`,
    nobara: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23ffcc99"/><circle cx="32" cy="20" r="8" fill="%23cc6600"/><path d="M20 30 Q32 40 44 30 Q32 50 20 30" fill="%23ff6699"/><rect x="24" y="45" width="16" height="12" fill="%23ff6699"/></svg>`)}`,
    sukuna: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23ffffff"/><circle cx="32" cy="20" r="8" fill="%23333333"/><path d="M20 30 Q32 40 44 30 Q32 50 20 30" fill="%23660000"/><rect x="24" y="45" width="16" height="12" fill="%23660000"/></svg>`)}`,
    toji: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23ffffff"/><circle cx="32" cy="20" r="8" fill="%23333333"/><path d="M20 30 Q32 40 44 30 Q32 50 20 30" fill="%23888888"/><rect x="24" y="45" width="16" height="12" fill="%23888888"/></svg>`)}`
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CHARACTERS, FINISH_MOVES, PORTRAITS };
}

// Character portraits (SVG files)
const PORTRAITS = {
    gojo: 'sprites/gojo.svg',
    yuji: 'sprites/yuji.svg',
    megumi: 'sprites/megumi.svg',
    nobara: 'sprites/nobara.svg',
    sukuna: 'sprites/sukuna.svg',
    toji: 'sprites/toji.svg'
};

// Character sprites for in-game rendering
const SPRITES = {
    gojo: 'sprites/gojo.svg',
    yuji: 'sprites/yuji.svg',
    megumi: 'sprites/megumi.svg',
    nobara: 'sprites/nobara.svg',
    sukuna: 'sprites/sukuna.svg',
    toji: 'sprites/toji.svg'
};
