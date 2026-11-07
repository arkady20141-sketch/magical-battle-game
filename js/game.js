// ===== GAME CORE =====

// Game State
const GameState = {
    START: 'start',
    CHARACTER_SELECT: 'character_select',
    FIGHTING: 'fighting',
    FINISH: 'finish',
    ROUND_OVER: 'round_over',
    GAME_OVER: 'game_over'
};

// Game Settings
const SETTINGS = {
    canvasWidth: 800,
    canvasHeight: 450,
    groundLevel: 350,
    gravity: 1.2,
    jumpForce: -15,
    maxRounds: 3,
    roundTime: 99,
    winScore: 2
};

// Game Variables
let gameState = GameState.START;
let canvas, ctx;
let players = [];
let currentRound = 1;
let roundTimer = SETTINGS.roundTime;
let timerInterval;
let scores = { p1: 0, p2: 0 };
let selectedChars = { p1: null, p2: null };
let winner = null;
let finisher = null;

// ===== INITIALIZATION =====
function init() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize players
    initPlayers();
    
    // Setup event listeners
    setupEventListeners();
    
    // Start with character selection
    showScreen('start-screen');
    
    // Start game loop
    requestAnimationFrame(gameLoop);
}

function resizeCanvas() {
    const container = document.getElementById('game-container');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initPlayers() {
    players = [
        {
            id: 'p1',
            x: 150,
            y: SETTINGS.groundLevel,
            width: 40,
            height: 80,
            velocity: { x: 0, y: 0 },
            facing: 1,
            health: 100,
            maxHealth: 100,
            mana: 100,
            maxMana: 100,
            character: null,
            state: 'idle',
            action: null,
            actionTimer: 0,
            cooldowns: {},
            combo: 0,
            hits: 0,
            isBlocking: false,
            isHit: false,
            hitTimer: 0
        },
        {
            id: 'p2',
            x: canvas.width - 150,
            y: SETTINGS.groundLevel,
            width: 40,
            height: 80,
            velocity: { x: 0, y: 0 },
            facing: -1,
            health: 100,
            maxHealth: 100,
            mana: 100,
            maxMana: 100,
            character: null,
            state: 'idle',
            action: null,
            actionTimer: 0,
            cooldowns: {},
            combo: 0,
            hits: 0,
            isBlocking: false,
            isHit: false,
            hitTimer: 0
        }
    ];
}

function setupEventListeners() {
    // Character selection
    document.querySelectorAll('.char-btn').forEach(btn => {
        btn.addEventListener('click', () => selectCharacter(btn));
    });
    
    // Start fight button
    document.getElementById('start-fight').addEventListener('click', startFight);
    
    // Continue button
    document.getElementById('continue-btn').addEventListener('click', continueAfterFinish);
    
    // Restart button
    document.getElementById('restart-btn').addEventListener('click', returnToMenu);
    
    // Keyboard controls
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Touch controls
    setupTouchControls();
}

// ===== CHARACTER SELECTION =====
function selectCharacter(btn) {
    const player = btn.dataset.player;
    const charId = btn.dataset.char;
    
    // Deselect all for this player
    document.querySelectorAll(`.char-btn[data-player="${player}"]`).forEach(b => {
        b.classList.remove('selected');
    });
    
    // Select this character
    btn.classList.add('selected');
    selectedChars[player] = charId;
    
    // Play sound
    playSound('select');
    
    // Enable start button if both selected
    const startBtn = document.getElementById('start-fight');
    if (selectedChars.p1 && selectedChars.p2) {
        startBtn.disabled = false;
    } else {
        startBtn.disabled = true;
    }
}

function startFight() {
    if (!selectedChars.p1 || !selectedChars.p2) return;
    
    // Set player characters
    players[0].character = CHARACTERS[selectedChars.p1];
    players[1].character = CHARACTERS[selectedChars.p2];
    
    // Update health and mana based on character
    players[0].health = players[0].character.health;
    players[0].maxHealth = players[0].character.health;
    players[0].mana = players[0].character.mana;
    players[0].maxMana = players[0].character.mana;
    
    players[1].health = players[1].character.health;
    players[1].maxHealth = players[1].character.health;
    players[1].mana = players[1].character.mana;
    players[1].maxMana = players[1].character.mana;
    
    // Reset positions
    players[0].x = 150;
    players[0].y = SETTINGS.groundLevel;
    players[1].x = canvas.width - 150;
    players[1].y = SETTINGS.groundLevel;
    
    // Reset game state
    currentRound = 1;
    roundTimer = SETTINGS.roundTime;
    scores = { p1: 0, p2: 0 };
    winner = null;
    finisher = null;
    
    // Update UI
    updateUI();
    
    // Show game screen
    showScreen('game-screen');
    gameState = GameState.FIGHTING;
    
    // Start round timer
    startRoundTimer();
    
    // Play background music
    playMusic();
}

// ===== GAME SCREENS =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}

// ===== ROUND TIMER =====
function startRoundTimer() {
    clearInterval(timerInterval);
    roundTimer = SETTINGS.roundTime;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        roundTimer--;
        updateTimerDisplay();
        
        if (roundTimer <= 0) {
            endRound();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerEl = document.getElementById('timer');
    if (timerEl) {
        timerEl.textContent = roundTimer;
        if (roundTimer <= 10) {
            timerEl.style.color = '#ff0000';
            timerEl.style.animation = 'vsPulse 0.5s ease-in-out infinite';
        } else {
            timerEl.style.color = '#fff';
            timerEl.style.animation = 'none';
        }
    }
}

// ===== GAME LOOP =====
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    drawBackground();
    
    // Update and draw based on game state
    switch (gameState) {
        case GameState.FIGHTING:
            updatePlayers();
            drawPlayers();
            drawEffects();
            break;
        case GameState.FINISH:
            drawPlayers();
            drawFinishEffect();
            break;
    }
    
    requestAnimationFrame(gameLoop);
}

// ===== BACKGROUND =====
function drawBackground() {
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    
    // Ground
    ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
    ctx.fillRect(0, SETTINGS.groundLevel, canvas.width, 20);
    
    // Center line
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
}

// ===== PLAYER UPDATE =====
function updatePlayers() {
    players.forEach(player => {
        // Apply gravity
        if (player.y < SETTINGS.groundLevel) {
            player.velocity.y += SETTINGS.gravity;
        } else {
            player.velocity.y = 0;
            player.y = SETTINGS.groundLevel;
        }
        
        // Update position
        player.x += player.velocity.x;
        player.y += player.velocity.y;
        
        // Boundary checks
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
        
        // Update action timer
        if (player.actionTimer > 0) {
            player.actionTimer -= 1/60;
            if (player.actionTimer <= 0) {
                player.state = 'idle';
                player.action = null;
            }
        }
        
        // Update hit timer
        if (player.isHit) {
            player.hitTimer -= 1/60;
            if (player.hitTimer <= 0) {
                player.isHit = false;
            }
        }
        
        // Update cooldowns
        for (const key in player.cooldowns) {
            player.cooldowns[key] -= 1/60;
            if (player.cooldowns[key] <= 0) {
                delete player.cooldowns[key];
            }
        }
        
        // Regenerate mana
        if (player.mana < player.maxMana) {
            player.mana += 0.2;
            if (player.mana > player.maxMana) player.mana = player.maxMana;
        }
        
        // AI for P2 (if needed for single player)
        if (player.id === 'p2' && !isHumanPlayer('p2')) {
            updateAI(player);
        }
    });
    
    // Check for collisions
    checkCollisions();
    
    // Update UI
    updateUI();
}

// ===== AI CONTROL =====
function isHumanPlayer(playerId) {
    // For now, both players are human
    return true;
}

function updateAI(player) {
    // Simple AI logic
    const opponent = players.find(p => p.id !== player.id);
    if (!opponent) return;
    
    const distance = Math.abs(opponent.x - player.x);
    const char = player.character;
    
    // Random decision
    const decision = Math.random();
    
    if (decision < char.ai.aggression) {
        // Attack
        if (distance < 100) {
            if (Math.random() < char.ai.comboChance && player.combo < 3) {
                performAction(player, 'light');
            } else {
                performAction(player, 'heavy');
            }
        } else {
            // Move towards opponent
            const direction = opponent.x < player.x ? -1 : 1;
            player.velocity.x = direction * char.speed;
            player.facing = direction;
        }
    } else if (decision < char.ai.aggression + char.ai.defense) {
        // Defend
        if (distance < 80) {
            performAction(player, 'block');
        }
    } else {
        // Special attack
        if (player.mana >= char.abilities.special.mana && !player.cooldowns.special) {
            performAction(player, 'special');
        }
    }
}

// ===== PLAYER ACTIONS =====
function performAction(player, action) {
    if (!player.character || player.actionTimer > 0) return;
    
    const ability = player.character.abilities[action];
    if (!ability) return;
    
    // Check cooldown
    if (player.cooldowns[action]) return;
    
    // Check mana
    if (player.mana < ability.mana) return;
    
    // Consume mana
    player.mana -= ability.mana;
    
    // Set action
    player.state = action;
    player.action = action;
    player.actionTimer = getActionDuration(action);
    
    // Set cooldown
    player.cooldowns[action] = ability.cooldown;
    
    // Play sound
    if (action === 'light' || action === 'heavy') {
        playSound('punch');
    } else if (action === 'special') {
        playSound('special');
    }
    
    // Execute action
    switch (action) {
        case 'light':
        case 'heavy':
            // Melee attack
            checkAttackHit(player, ability);
            break;
        case 'special':
            // Special attack
            checkSpecialAttack(player, ability);
            break;
        case 'block':
            player.isBlocking = true;
            player.actionTimer = 0.5;
            break;
    }
}

function getActionDuration(action) {
    switch (action) {
        case 'light': return 0.5;
        case 'heavy': return 0.7;
        case 'special': return 1.0;
        case 'block': return 0.5;
        default: return 0.5;
    }
}

function checkAttackHit(attacker, ability) {
    const opponent = players.find(p => p.id !== attacker.id);
    if (!opponent) return;
    
    const distance = Math.abs(opponent.x - attacker.x);
    const direction = attacker.facing;
    
    // Check if opponent is in range
    if (distance <= ability.range) {
        // Check if opponent is blocking
        if (opponent.isBlocking) {
            // Reduced damage
            const damage = Math.floor(ability.damage * 0.3);
            takeDamage(opponent, damage);
            playSound('punch');
        } else {
            // Full damage
            takeDamage(opponent, ability.damage);
            
            // Add to combo
            attacker.combo++;
            
            // Check for finish opportunity
            if (opponent.health <= 0) {
                finisher = attacker.id;
            }
        }
    }
}

function checkSpecialAttack(attacker, ability) {
    const opponent = players.find(p => p.id !== attacker.id);
    if (!opponent) return;
    
    const distance = Math.abs(opponent.x - attacker.x);
    
    if (distance <= ability.range) {
        // Special effects
        switch (ability.effect) {
            case 'stun':
                opponent.actionTimer = 1.0;
                opponent.state = 'hit';
                break;
            case 'bleed':
                // Apply bleed effect
                break;
            case 'lifesteal':
                attacker.health += Math.floor(ability.damage * 0.3);
                if (attacker.health > attacker.maxHealth) attacker.health = attacker.maxHealth;
                break;
        }
        
        takeDamage(opponent, ability.damage);
        
        if (opponent.health <= 0) {
            finisher = attacker.id;
        }
    }
}

function takeDamage(player, damage) {
    if (player.isBlocking) {
        damage = Math.floor(damage * 0.3);
    }
    
    player.health -= damage;
    player.isHit = true;
    player.hitTimer = 0.5;
    player.state = 'hit';
    player.actionTimer = 0.5;
    player.combo = 0;
    
    // Check for death
    if (player.health <= 0) {
        player.health = 0;
        endRound();
    }
}

// ===== COLLISION DETECTION =====
function checkCollisions() {
    // Simple collision between players
    const p1 = players[0];
    const p2 = players[1];
    
    if (Math.abs(p1.x - p2.x) < p1.width && 
        Math.abs(p1.y - p2.y) < p1.height) {
        // Push apart
        const overlap = p1.width - Math.abs(p1.x - p2.x);
        if (p1.x < p2.x) {
            p1.x -= overlap / 2;
            p2.x += overlap / 2;
        } else {
            p1.x += overlap / 2;
            p2.x -= overlap / 2;
        }
    }
}

// ===== ROUND MANAGEMENT =====
function endRound() {
    clearInterval(timerInterval);
    
    // Determine winner
    const p1Alive = players[0].health > 0;
    const p2Alive = players[1].health > 0;
    
    if (p1Alive && !p2Alive) {
        winner = 'p1';
        scores.p1++;
    } else if (!p1Alive && p2Alive) {
        winner = 'p2';
        scores.p2++;
    } else {
        // Draw
        winner = 'draw';
    }
    
    // Check for finish opportunity
    if (finisher && (p1Alive || p2Alive)) {
        // Trigger finish move
        gameState = GameState.FINISH;
        triggerFinish(finisher);
        return;
    }
    
    // Check for game over
    if (scores.p1 >= SETTINGS.winScore || scores.p2 >= SETTINGS.winScore) {
        gameState = GameState.GAME_OVER;
        showGameOver();
        return;
    }
    
    // Next round
    currentRound++;
    if (currentRound > SETTINGS.maxRounds) {
        gameState = GameState.GAME_OVER;
        showGameOver();
        return;
    }
    
    // Reset players
    resetPlayers();
    
    // Update UI
    updateUI();
    
    // Start next round
    setTimeout(() => {
        startRoundTimer();
        gameState = GameState.FIGHTING;
    }, 2000);
}

function resetPlayers() {
    players[0].x = 150;
    players[0].y = SETTINGS.groundLevel;
    players[0].velocity = { x: 0, y: 0 };
    players[0].health = players[0].maxHealth;
    players[0].mana = players[0].maxMana;
    players[0].state = 'idle';
    players[0].action = null;
    players[0].actionTimer = 0;
    players[0].cooldowns = {};
    players[0].combo = 0;
    players[0].isBlocking = false;
    players[0].isHit = false;
    
    players[1].x = canvas.width - 150;
    players[1].y = SETTINGS.groundLevel;
    players[1].velocity = { x: 0, y: 0 };
    players[1].health = players[1].maxHealth;
    players[1].mana = players[1].maxMana;
    players[1].state = 'idle';
    players[1].action = null;
    players[1].actionTimer = 0;
    players[1].cooldowns = {};
    players[1].combo = 0;
    players[1].isBlocking = false;
    players[1].isHit = false;
}

// ===== FINISH MOVE =====
function triggerFinish(finisherId) {
    const finisherPlayer = players.find(p => p.id === finisherId);
    const opponent = players.find(p => p.id !== finisherId);
    
    if (!finisherPlayer || !opponent) return;
    
    // Set up finish
    const finishData = FINISH_MOVES[finisherPlayer.character.name.toLowerCase().replace(/\s/g, '')];
    
    // Update UI
    document.getElementById('finish-title').textContent = 'ДОБИВАННЯ!';
    document.getElementById('winner-name').textContent = finisherPlayer.character.name;
    document.getElementById('finish-desc').textContent = finishData ? finishData.description : '';
    
    // Show finish screen
    showScreen('finish-screen');
    
    // Award point
    if (finisherId === 'p1') {
        scores.p1++;
    } else {
        scores.p2++;
    }
    
    // Check for game over
    setTimeout(() => {
        if (scores.p1 >= SETTINGS.winScore || scores.p2 >= SETTINGS.winScore) {
            gameState = GameState.GAME_OVER;
            showGameOver();
        } else {
            gameState = GameState.FIGHTING;
            currentRound++;
            resetPlayers();
            updateUI();
            showScreen('game-screen');
            startRoundTimer();
        }
    }, 3000);
}

function continueAfterFinish() {
    currentRound++;
    finisher = null;
    resetPlayers();
    updateUI();
    showScreen('game-screen');
    startRoundTimer();
    gameState = GameState.FIGHTING;
}

// ===== GAME OVER =====
function showGameOver() {
    showScreen('gameover-screen');
    
    const winnerName = scores.p1 > scores.p2 ? players[0].character.name : 
                      scores.p2 > scores.p1 ? players[1].character.name : 'НІЧИЯ';
    
    document.getElementById('gameover-winner').textContent = 
        scores.p1 > scores.p2 ? `Переможець: ${players[0].character.name}` :
        scores.p2 > scores.p1 ? `Переможець: ${players[1].character.name}` : 'НІЧИЯ';
    
    document.getElementById('final-score').textContent = 
        `${scores.p1} - ${scores.p2}`;
    
    gameState = GameState.GAME_OVER;
}

function returnToMenu() {
    showScreen('start-screen');
    gameState = GameState.START;
    selectedChars = { p1: null, p2: null };
    
    // Reset selection
    document.querySelectorAll('.char-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    document.getElementById('start-fight').disabled = true;
}

// ===== UI UPDATE =====
function updateUI() {
    // Update P1 stats
    const p1Health = document.getElementById('p1-health');
    const p1Mana = document.getElementById('p1-mana');
    const p1Name = document.getElementById('p1-name');
    const p1Portrait = document.getElementById('p1-portrait');
    
    if (p1Health && players[0].character) {
        p1Health.style.width = `${(players[0].health / players[0].maxHealth) * 100}%`;
        p1Mana.style.width = `${(players[0].mana / players[0].maxMana) * 100}%`;
        p1Name.textContent = players[0].character.name.split(' ')[0];
        p1Portrait.style.backgroundImage = `url("${PORTRAITS[selectedChars.p1]}")`;
    }
    
    // Update P2 stats
    const p2Health = document.getElementById('p2-health');
    const p2Mana = document.getElementById('p2-mana');
    const p2Name = document.getElementById('p2-name');
    const p2Portrait = document.getElementById('p2-portrait');
    
    if (p2Health && players[1].character) {
        p2Health.style.width = `${(players[1].health / players[1].maxHealth) * 100}%`;
        p2Mana.style.width = `${(players[1].mana / players[1].maxMana) * 100}%`;
        p2Name.textContent = players[1].character.name.split(' ')[0];
        p2Portrait.style.backgroundImage = `url("${PORTRAITS[selectedChars.p2]}")`;
    }
    
    // Update round info
    const roundInfo = document.getElementById('round-info');
    if (roundInfo) {
        roundInfo.textContent = `Round ${currentRound}`;
    }
    
    // Update score display
    // Could add score display to UI
}

// ===== DRAW PLAYERS =====
function drawPlayers() {
    players.forEach(player => {
        if (!player.character) return;
        
        ctx.save();
        
        // Flip for left-facing
        if (player.facing === -1) {
            ctx.translate(player.x + player.width, player.y);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(player.x, player.y);
        }
        
        // Draw character
        drawCharacter(player);
        
        ctx.restore();
    });
}

function drawCharacter(player) {
    const char = player.character;
    const colors = char.colors;
    
    // Draw body (simplified pixel art style)
    // Head
    ctx.fillStyle = colors.body;
    ctx.fillRect(10, 0, 20, 20);
    
    // Hair
    ctx.fillStyle = colors.hair;
    ctx.fillRect(8, 0, 24, 8);
    
    // Eyes
    ctx.fillStyle = colors.eyes;
    ctx.fillRect(14, 8, 3, 3);
    ctx.fillRect(23, 8, 3, 3);
    
    // Body
    ctx.fillStyle = colors.outfit;
    ctx.fillRect(5, 20, 30, 40);
    
    // Arms
    ctx.fillRect(0, 25, 10, 15);
    ctx.fillRect(30, 25, 10, 15);
    
    // Legs
    ctx.fillRect(10, 60, 10, 20);
    ctx.fillRect(20, 60, 10, 20);
    
    // State-specific drawing
    switch (player.state) {
        case 'hit':
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fillRect(5, 20, 30, 40);
            break;
        case 'block':
            ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
            ctx.fillRect(0, 20, 40, 40);
            break;
        case 'light':
        case 'heavy':
            // Draw attack effect
            ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
            if (player.facing === 1) {
                ctx.fillRect(35, 30, 20, 10);
            } else {
                ctx.fillRect(-20, 30, 20, 10);
            }
            break;
        case 'special':
            // Draw special effect
            ctx.fillStyle = 'rgba(255, 0, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(15, 0, 30, 0, Math.PI * 2);
            ctx.fill();
            break;
    }
    
    // Health bar above character
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(5, -10, 30 * (player.health / player.maxHealth), 5);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(5, -10, 30, 5);
}

// ===== DRAW EFFECTS =====
function drawEffects() {
    // Could add particle effects, hit markers, etc.
}

function drawFinishEffect() {
    // Draw finish animation
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

// ===== SOUND =====
function playSound(sound) {
    const audio = document.getElementById(`${sound}-sfx`);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Audio error:', e));
    }
}

function playMusic() {
    const music = document.getElementById('bg-music');
    if (music) {
        music.volume = 0.3;
        music.play().catch(e => console.log('Music error:', e));
    }
}

// ===== KEYBOARD CONTROLS =====
const keys = {};

function handleKeyDown(e) {
    keys[e.code] = true;
    
    // Prevent default for game keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyZ', 'KeyX', 'KeyC', 'KeyV'].includes(e.code)) {
        e.preventDefault();
    }
    
    if (gameState !== GameState.FIGHTING) return;
    
    const p1 = players[0];
    
    // P1 Controls (Keyboard)
    if (e.code === 'ArrowLeft') {
        p1.velocity.x = -p1.character.speed;
        p1.facing = -1;
    }
    if (e.code === 'ArrowRight') {
        p1.velocity.x = p1.character.speed;
        p1.facing = 1;
    }
    if (e.code === 'ArrowUp' && p1.y >= SETTINGS.groundLevel) {
        p1.velocity.y = SETTINGS.jumpForce;
    }
    if (e.code === 'KeyZ') {
        performAction(p1, 'light');
    }
    if (e.code === 'KeyX') {
        performAction(p1, 'heavy');
    }
    if (e.code === 'KeyC') {
        performAction(p1, 'special');
    }
    if (e.code === 'KeyV') {
        performAction(p1, 'block');
    }
}

function handleKeyUp(e) {
    keys[e.code] = false;
    
    if (gameState !== GameState.FIGHTING) return;
    
    const p1 = players[0];
    
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        p1.velocity.x = 0;
    }
}

// ===== TOUCH CONTROLS =====
function setupTouchControls() {
    const touchMap = {
        'btn-up': 'ArrowUp',
        'btn-down': 'ArrowDown',
        'btn-left': 'ArrowLeft',
        'btn-right': 'ArrowRight',
        'btn-light': 'KeyZ',
        'btn-heavy': 'KeyX',
        'btn-special': 'KeyC',
        'btn-block': 'KeyV'
    };
    
    Object.entries(touchMap).forEach(([btnId, keyCode]) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                keys[keyCode] = true;
                handleKeyDown({ code: keyCode, preventDefault: () => {} });
            });
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                keys[keyCode] = false;
                handleKeyUp({ code: keyCode, preventDefault: () => {} });
            });
        }
    });
}

// ===== START GAME =====
document.addEventListener('DOMContentLoaded', init);
