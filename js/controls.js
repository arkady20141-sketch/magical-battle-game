// ===== CONTROLS MANAGER =====
// Handles all input for the game

// Touch control state
let touchActive = {};
let touchStartTime = {};

// ===== TOUCH CONTROL SETUP =====
function setupEnhancedTouchControls() {
    const touchButtons = document.querySelectorAll('.touch-btn');
    
    touchButtons.forEach(btn => {
        const btnId = btn.id;
        
        // Touch start
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchActive[btnId] = true;
            touchStartTime[btnId] = Date.now();
            btn.classList.add('active');
            
            // Immediate action for some buttons
            handleTouchAction(btnId, true);
        });
        
        // Touch end
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            touchActive[btnId] = false;
            btn.classList.remove('active');
            handleTouchAction(btnId, false);
        });
        
        // Touch cancel
        btn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            touchActive[btnId] = false;
            btn.classList.remove('active');
        });
    });
    
    // Movement touch pad
    setupMovementPad();
}

// ===== MOVEMENT PAD =====
function setupMovementPad() {
    const movementSection = document.querySelector('.movement');
    if (!movementSection) return;
    
    let touchStartX = 0;
    let touchStartY = 0;
    let isMoving = false;
    
    movementSection.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        isMoving = true;
    });
    
    movementSection.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isMoving) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        
        const p1 = players.find(p => p.id === 'p1');
        if (!p1) return;
        
        // Dead zone
        if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
            p1.velocity.x = 0;
            return;
        }
        
        // Horizontal movement
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < -20) {
                p1.velocity.x = -p1.character.speed;
                p1.facing = -1;
            } else if (deltaX > 20) {
                p1.velocity.x = p1.character.speed;
                p1.facing = 1;
            } else {
                p1.velocity.x = 0;
            }
        }
        
        // Jump
        if (deltaY < -30 && p1.y >= SETTINGS.groundLevel) {
            p1.velocity.y = SETTINGS.jumpForce;
        }
    });
    
    movementSection.addEventListener('touchend', () => {
        isMoving = false;
        const p1 = players.find(p => p.id === 'p1');
        if (p1) {
            p1.velocity.x = 0;
        }
    });
}

// ===== TOUCH ACTION HANDLER =====
function handleTouchAction(btnId, isPressed) {
    if (gameState !== GameState.FIGHTING) return;
    
    const p1 = players.find(p => p.id === 'p1');
    if (!p1 || !p1.character) return;
    
    switch (btnId) {
        case 'btn-up':
            if (isPressed && p1.y >= SETTINGS.groundLevel) {
                p1.velocity.y = SETTINGS.jumpForce;
            }
            break;
            
        case 'btn-left':
            p1.velocity.x = isPressed ? -p1.character.speed : 0;
            if (isPressed) p1.facing = -1;
            break;
            
        case 'btn-right':
            p1.velocity.x = isPressed ? p1.character.speed : 0;
            if (isPressed) p1.facing = 1;
            break;
            
        case 'btn-down':
            // Could be used for crouch
            break;
            
        case 'btn-light':
            if (isPressed) {
                performAction(p1, 'light');
            }
            break;
            
        case 'btn-heavy':
            if (isPressed) {
                performAction(p1, 'heavy');
            }
            break;
            
        case 'btn-special':
            if (isPressed) {
                performAction(p1, 'special');
            }
            break;
            
        case 'btn-block':
            if (isPressed) {
                performAction(p1, 'block');
            }
            break;
    }
}

// ===== GAMEPAD SUPPORT =====
function setupGamepad() {
    if (!navigator.getGamepads) return;
    
    window.addEventListener('gamepadconnected', (e) => {
        console.log('Gamepad connected:', e.gamepad.id);
    });
    
    window.addEventListener('gamepaddisconnected', (e) => {
        console.log('Gamepad disconnected:', e.gamepad.id);
    });
    
    // Poll gamepads in game loop
    setInterval(checkGamepads, 16);
}

function checkGamepads() {
    const gamepads = navigator.getGamepads();
    
    for (const gamepad of gamepads) {
        if (!gamepad) continue;
        
        const p1 = players.find(p => p.id === 'p1');
        if (!p1 || !p1.character) continue;
        
        // Left stick
        if (Math.abs(gamepad.axes[0]) > 0.2) {
            p1.velocity.x = gamepad.axes[0] * p1.character.speed;
            p1.facing = gamepad.axes[0] > 0 ? 1 : -1;
        } else {
            p1.velocity.x = 0;
        }
        
        // Buttons
        if (gamepad.buttons[0].pressed) { // A button
            performAction(p1, 'light');
        }
        if (gamepad.buttons[1].pressed) { // B button
            performAction(p1, 'heavy');
        }
        if (gamepad.buttons[2].pressed) { // X button
            performAction(p1, 'special');
        }
        if (gamepad.buttons[3].pressed) { // Y button
            performAction(p1, 'block');
        }
        if (gamepad.buttons[12].pressed && p1.y >= SETTINGS.groundLevel) { // D-pad up
            p1.velocity.y = SETTINGS.jumpForce;
        }
    }
}

// ===== KEYBOARD SHORTCUTS =====
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Fullscreen toggle
        if (e.code === 'KeyF' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            toggleFullscreen();
        }
        
        // Mute music
        if (e.code === 'KeyM') {
            toggleMusic();
        }
        
        // Restart game
        if (e.code === 'KeyR' && gameState === GameState.GAME_OVER) {
            returnToMenu();
        }
    });
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error('Fullscreen error:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

function toggleMusic() {
    const music = document.getElementById('bg-music');
    if (music) {
        music.muted = !music.muted;
    }
}

// ===== SWIPE GESTURES =====
let swipeStartX = 0;
let swipeStartY = 0;

function setupSwipeControls() {
    document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        swipeStartX = touch.clientX;
        swipeStartY = touch.clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        if (!e.changedTouches) return;
        
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - swipeStartX;
        const deltaY = touch.clientY - swipeStartY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Only register as swipe if it's a significant movement
        if (distance < 50) return;
        
        const p1 = players.find(p => p.id === 'p1');
        if (!p1 || !p1.character) return;
        
        // Horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                // Swipe right
                p1.velocity.x = p1.character.speed;
                p1.facing = 1;
            } else {
                // Swipe left
                p1.velocity.x = -p1.character.speed;
                p1.facing = -1;
            }
        }
        
        // Vertical swipe up
        if (deltaY < -50 && Math.abs(deltaX) < 30) {
            if (p1.y >= SETTINGS.groundLevel) {
                p1.velocity.y = SETTINGS.jumpForce;
            }
        }
    });
}

// ===== INITIALIZE =====
function initControls() {
    setupEnhancedTouchControls();
    setupGamepad();
    setupKeyboardShortcuts();
    setupSwipeControls();
}

// Make available globally
window.initControls = initControls;
