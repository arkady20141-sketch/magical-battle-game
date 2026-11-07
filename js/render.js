// ===== RENDERING ENGINE =====
// Handles all visual rendering for the game

// ===== PARTICLE SYSTEM =====
class Particle {
    constructor(x, y, color, size, velocity, lifetime) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.velocity = velocity;
        this.lifetime = lifetime;
        this.maxLifetime = lifetime;
        this.gravity = 0.2;
    }
    
    update() {
        this.lifetime -= 1/60;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        return this.lifetime > 0;
    }
    
    draw(ctx) {
        const alpha = this.lifetime / this.maxLifetime;
        ctx.fillStyle = this.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
        ctx.fill();
    }
}

let particles = [];

function addParticle(x, y, color, size = 3, velocity = {x: 0, y: 0}, lifetime = 1) {
    particles.push(new Particle(x, y, color, size, velocity, lifetime));
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        if (!particles[i].update()) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles(ctx) {
    particles.forEach(particle => particle.draw(ctx));
}

// ===== HIT EFFECTS =====
function spawnHitEffect(x, y, damage) {
    // Blood particles
    for (let i = 0; i < 10; i++) {
        addParticle(
            x, y,
            'rgb(255, 0, 0)',
            Math.random() * 3 + 1,
            {
                x: (Math.random() - 0.5) * 5,
                y: (Math.random() - 0.5) * 5 - 2
            },
            0.5
        );
    }
    
    // Damage number
    spawnDamageNumber(x, y, damage);
}

// ===== DAMAGE NUMBERS =====
class DamageNumber {
    constructor(x, y, damage) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.lifetime = 1;
        this.velocity = { x: 0, y: -2 };
        this.size = 1;
    }
    
    update() {
        this.lifetime -= 1/60;
        this.y += this.velocity.y;
        this.velocity.y += 0.1;
        this.size = 1 + (1 - this.lifetime);
        return this.lifetime > 0;
    }
    
    draw(ctx) {
        ctx.font = `bold ${16 * this.size}px Arial`;
        ctx.fillStyle = this.damage > 15 ? '#ff0000' : 
                       this.damage > 10 ? '#ff8800' : '#ffff00';
        ctx.textAlign = 'center';
        ctx.fillText(this.damage, this.x, this.y);
        ctx.textAlign = 'left';
    }
}

let damageNumbers = [];

function spawnDamageNumber(x, y, damage) {
    damageNumbers.push(new DamageNumber(x, y, damage));
}

function updateDamageNumbers() {
    for (let i = damageNumbers.length - 1; i >= 0; i--) {
        if (!damageNumbers[i].update()) {
            damageNumbers.splice(i, 1);
        }
    }
}

function drawDamageNumbers(ctx) {
    damageNumbers.forEach(dn => dn.draw(ctx));
}

// ===== SPECIAL EFFECTS =====
class SpecialEffect {
    constructor(type, x, y, targetX, targetY) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.progress = 0;
        this.duration = 0.5;
        this.active = true;
    }
    
    update() {
        this.progress += 1/60;
        if (this.progress >= this.duration) {
            this.active = false;
        }
        return this.active;
    }
    
    draw(ctx) {
        const interp = this.progress / this.duration;
        const currentX = this.x + (this.targetX - this.x) * interp;
        const currentY = this.y + (this.targetY - this.y) * interp;
        
        switch (this.type) {
            case 'fireball':
                ctx.fillStyle = 'rgba(255, 100, 0, 0.8)';
                ctx.beginPath();
                ctx.arc(currentX, currentY, 15 * (1 - interp), 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = 'rgba(255, 200, 0, 0.6)';
                ctx.beginPath();
                ctx.arc(currentX, currentY, 10 * (1 - interp), 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'ice':
                ctx.fillStyle = 'rgba(0, 200, 255, 0.8)';
                ctx.beginPath();
                ctx.arc(currentX, currentY, 15 * (1 - interp), 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'lightning':
                ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(currentX, currentY);
                ctx.stroke();
                break;
        }
    }
}

let specialEffects = [];

function createSpecialEffect(type, startX, startY, targetX, targetY) {
    specialEffects.push(new SpecialEffect(type, startX, startY, targetX, targetY));
}

function updateSpecialEffects() {
    for (let i = specialEffects.length - 1; i >= 0; i--) {
        if (!specialEffects[i].update()) {
            specialEffects.splice(i, 1);
        }
    }
}

function drawSpecialEffects(ctx) {
    specialEffects.forEach(effect => effect.draw(ctx));
}

// ===== FINISH EFFECTS =====
class FinishEffect {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.progress = 0;
        this.duration = 2;
        this.active = true;
    }
    
    update() {
        this.progress += 1/60;
        if (this.progress >= this.duration) {
            this.active = false;
        }
        return this.active;
    }
    
    draw(ctx) {
        const interp = this.progress / this.duration;
        
        switch (this.type) {
            case 'purple':
                // Gojo's Purple
                ctx.fillStyle = `rgba(150, 0, 255, ${0.3 * (1 - interp)})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 200 * interp, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = `rgba(255, 0, 255, ${0.5 * (1 - interp)})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 100 * interp, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'cleave':
                // Yuji's Cleave
                ctx.fillStyle = `rgba(255, 0, 0, ${0.5 * (1 - interp)})`;
                ctx.beginPath();
                ctx.moveTo(this.x - 100, this.y - 100);
                ctx.lineTo(this.x + 100, this.y + 100);
                ctx.lineTo(this.x - 100, this.y + 100);
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'summon':
                // Megumi's Summon
                ctx.fillStyle = `rgba(0, 100, 0, ${0.4 * (1 - interp)})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 150 * interp, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'hammer':
                // Nobara's Hammer
                ctx.fillStyle = `rgba(255, 200, 0, ${0.6 * (1 - interp)})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 120 * interp, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'cursed':
                // Sukuna's Cursed
                ctx.fillStyle = `rgba(100, 0, 0, ${0.5 * (1 - interp)})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 180 * interp, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'slice':
                // Toji's Slice
                ctx.fillStyle = `rgba(255, 255, 255, ${0.7 * (1 - interp)})`;
                ctx.beginPath();
                ctx.moveTo(this.x - 150, this.y);
                ctx.lineTo(this.x + 150, this.y);
                ctx.lineTo(this.x + 150, this.y + 10);
                ctx.lineTo(this.x - 150, this.y + 10);
                ctx.closePath();
                ctx.fill();
                break;
        }
    }
}

let finishEffects = [];

function triggerFinishEffect(type, x, y) {
    finishEffects.push(new FinishEffect(type, x, y));
}

function updateFinishEffects() {
    for (let i = finishEffects.length - 1; i >= 0; i--) {
        if (!finishEffects[i].update()) {
            finishEffects.splice(i, 1);
        }
    }
}

function drawFinishEffects(ctx) {
    finishEffects.forEach(effect => effect.draw(ctx));
}

// ===== IMPROVED CHARACTER RENDERING =====
function drawImprovedCharacter(ctx, player) {
    const char = player.character;
    const colors = char.colors;
    const x = 0; // Already translated
    const y = 0;
    
    // Body parts
    const parts = {
        // Head
        head: { x: 10, y: 0, w: 20, h: 20, color: colors.body },
        hair: { x: 8, y: 0, w: 24, h: 8, color: colors.hair },
        
        // Face
        eyeLeft: { x: 14, y: 8, w: 3, h: 3, color: colors.eyes },
        eyeRight: { x: 23, y: 8, w: 3, h: 3, color: colors.eyes },
        
        // Body
        torso: { x: 5, y: 20, w: 30, h: 40, color: colors.outfit },
        
        // Arms
        armLeft: { x: 0, y: 25, w: 10, h: 15, color: colors.outfit },
        armRight: { x: 30, y: 25, w: 10, h: 15, color: colors.outfit },
        
        // Legs
        legLeft: { x: 10, y: 60, w: 10, h: 20, color: colors.outfit },
        legRight: { x: 20, y: 60, w: 10, h: 20, color: colors.outfit }
    };
    
    // Draw all parts
    Object.values(parts).forEach(part => {
        ctx.fillStyle = part.color;
        ctx.fillRect(part.x, part.y, part.w, part.h);
    });
    
    // Draw character-specific details
    switch (char.name.toLowerCase()) {
        case 'сатору годжо':
            // Blindfold
            ctx.fillStyle = '#0000ff';
            ctx.fillRect(12, 6, 16, 3);
            break;
            
        case 'юуджі ітадорі':
            // Scars
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(16, 4, 2, 4);
            ctx.fillRect(22, 4, 2, 4);
            break;
            
        case 'мегумі фушігуро':
            // Hair details
            ctx.fillStyle = '#003300';
            ctx.fillRect(6, 4, 4, 4);
            ctx.fillRect(24, 4, 4, 4);
            break;
            
        case 'нобара кудojo':
            // Hair ribbons
            ctx.fillStyle = '#ff3366';
            ctx.fillRect(6, 2, 3, 6);
            ctx.fillRect(25, 2, 3, 6);
            break;
            
        case 'рюомен сукуна':
            // Tattoos
            ctx.fillStyle = '#660000';
            ctx.fillRect(8, 12, 4, 2);
            ctx.fillRect(28, 12, 4, 2);
            break;
            
        case 'тоджі фушігуро':
            // Mask
            ctx.fillStyle = '#888888';
            ctx.fillRect(12, 6, 16, 6);
            break;
    }
    
    // Draw action effects
    switch (player.state) {
        case 'hit':
            ctx.fillStyle = 'rgba(255, 50, 50, 0.5)';
            ctx.fillRect(5, 20, 30, 40);
            
            // White flash
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(8, 25, 24, 35);
            break;
            
        case 'block':
            ctx.fillStyle = 'rgba(0, 100, 255, 0.4)';
            ctx.fillRect(player.facing === 1 ? 35 : -5, 20, 10, 40);
            break;
            
        case 'light':
            ctx.fillStyle = 'rgba(255, 255, 0, 0.4)';
            if (player.facing === 1) {
                ctx.fillRect(35, 30, 15, 8);
            } else {
                ctx.fillRect(-15, 30, 15, 8);
            }
            break;
            
        case 'heavy':
            ctx.fillStyle = 'rgba(255, 165, 0, 0.5)';
            if (player.facing === 1) {
                ctx.fillRect(35, 25, 20, 15);
            } else {
                ctx.fillRect(-20, 25, 20, 15);
            }
            break;
            
        case 'special':
            // Draw aura
            ctx.fillStyle = getSpecialColor(player);
            ctx.globalAlpha = 0.3 + Math.sin(Date.now() * 0.01) * 0.1;
            ctx.beginPath();
            ctx.arc(15, 35, 30, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            break;
    }
    
    // Health bar
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(5, -12, 30 * (player.health / player.maxHealth), 4);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(5, -12, 30, 4);
    
    // Mana bar
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(5, -7, 30 * (player.mana / player.maxMana), 3);
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.strokeRect(5, -7, 30, 3);
}

function getSpecialColor(player) {
    const charName = player.character.name.toLowerCase();
    if (charName.includes('годжо')) return 'rgba(150, 0, 255, 0.8)';
    if (charName.includes('юуджі')) return 'rgba(255, 0, 0, 0.8)';
    if (charName.includes('мегумі')) return 'rgba(0, 150, 0, 0.8)';
    if (charName.includes('нобара')) return 'rgba(255, 150, 0, 0.8)';
    if (charName.includes('сукуна')) return 'rgba(100, 0, 0, 0.8)';
    if (charName.includes('тоджі')) return 'rgba(200, 200, 200, 0.8)';
    return 'rgba(255, 255, 0, 0.8)';
}

// ===== IMPROVED BACKGROUND =====
function drawImprovedBackground(ctx) {
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, '#0a0a1a');
    skyGradient.addColorStop(0.3, '#1a1a3a');
    skyGradient.addColorStop(0.6, '#2a2a5a');
    skyGradient.addColorStop(1, '#0a0a1a');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Moon
    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.arc(canvas.width * 0.8, 80, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Stars (random)
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height * 0.4);
        const size = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Ground
    ctx.fillStyle = '#333';
    ctx.fillRect(0, SETTINGS.groundLevel, canvas.width, 30);
    
    // Ground texture
    ctx.fillStyle = '#444';
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.fillRect(i, SETTINGS.groundLevel, 10, 5);
    }
    
    // Center line
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Corner markers
    ctx.fillStyle = '#666';
    ctx.fillRect(50, SETTINGS.groundLevel - 10, 10, 10);
    ctx.fillRect(canvas.width - 60, SETTINGS.groundLevel - 10, 10, 10);
}

// ===== IMPROVED UI OVERLAY =====
function drawImprovedUI(ctx) {
    // Round indicator with glow
    const roundText = `ROUND ${currentRound}`;
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#ff0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Glow effect
    ctx.shadowColor = '#ff0';
    ctx.shadowBlur = 20;
    ctx.fillText(roundText, canvas.width / 2, 50);
    ctx.shadowBlur = 0;
    
    // Timer
    const timerText = String(Math.ceil(roundTimer));
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = roundTimer <= 10 ? '#f00' : '#fff';
    
    // Timer glow when low
    if (roundTimer <= 10) {
        ctx.shadowColor = '#f00';
        ctx.shadowBlur = 20;
    }
    
    ctx.fillText(timerText, canvas.width / 2, canvas.height - 50);
    ctx.shadowBlur = 0;
    
    // Score
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(`${scores.p1} - ${scores.p2}`, canvas.width / 2, canvas.height - 100);
}

// ===== MAIN RENDER FUNCTION =====
function renderGame(ctx) {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    drawImprovedBackground(ctx);
    
    // Players
    players.forEach(player => {
        ctx.save();
        
        if (player.facing === -1) {
            ctx.translate(player.x + player.width, player.y);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(player.x, player.y);
        }
        
        drawImprovedCharacter(ctx, player);
        
        ctx.restore();
    });
    
    // Effects
    drawParticles(ctx);
    drawDamageNumbers(ctx);
    drawSpecialEffects(ctx);
    drawFinishEffects(ctx);
    
    // UI
    drawImprovedUI(ctx);
}

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderGame,
        addParticle,
        spawnHitEffect,
        createSpecialEffect,
        triggerFinishEffect,
        updateParticles,
        updateDamageNumbers,
        updateSpecialEffects,
        updateFinishEffects
    };
}
