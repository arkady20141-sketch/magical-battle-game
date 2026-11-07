package com.magicalbattle.android;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

/**
 * GameView - Custom SurfaceView for rendering the fighting game
 */
public class GameView extends SurfaceView implements SurfaceHolder.Callback, Runnable {
    
    private Thread gameThread;
    private SurfaceHolder surfaceHolder;
    private boolean isRunning = false;
    
    // Game state
    private static final int STATE_MENU = 0;
    private static final int STATE_CHARACTER_SELECT = 1;
    private static final int STATE_FIGHTING = 2;
    private static final int STATE_FINISH = 3;
    private static final int STATE_GAME_OVER = 4;
    
    private int gameState = STATE_MENU;
    
    // Characters
    private Character player1;
    private Character player2;
    private int selectedP1 = -1;
    private int selectedP2 = -1;
    
    // Screen dimensions
    private int screenWidth, screenHeight;
    private float groundLevel;
    
    // Game logic
    private int round = 1;
    private int p1Score = 0;
    private int p2Score = 0;
    private long roundTimer = 99000; // 99 seconds in milliseconds
    private long lastTime;
    private String finisher = null;
    
    // Touch controls
    private float touchX, touchY;
    private boolean touchActive = false;
    
    // UI elements
    private Paint paint;
    private Paint textPaint;
    private Paint smallTextPaint;
    
    public GameView(Context context) {
        super(context);
        init();
    }
    
    public GameView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }
    
    public GameView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }
    
    private void init() {
        surfaceHolder = getHolder();
        surfaceHolder.addCallback(this);
        
        paint = new Paint();
        paint.setAntiAlias(true);
        
        textPaint = new Paint();
        textPaint.setAntiAlias(true);
        textPaint.setTextAlign(Paint.Align.CENTER);
        textPaint.setTextSize(80);
        textPaint.setColor(Color.WHITE);
        textPaint.setTypeface(null, Paint.Typeface.BOLD);
        
        smallTextPaint = new Paint();
        smallTextPaint.setAntiAlias(true);
        smallTextPaint.setTextAlign(Paint.Align.CENTER);
        smallTextPaint.setTextSize(40);
        smallTextPaint.setColor(Color.WHITE);
    }
    
    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        screenWidth = getWidth();
        screenHeight = getHeight();
        groundLevel = screenHeight - 200;
        
        // Initialize characters
        player1 = new Character(Character.TYPE_GOJO, 200, groundLevel);
        player2 = new Character(Character.TYPE_YUJI, screenWidth - 200, groundLevel);
        
        isRunning = true;
        gameThread = new Thread(this);
        gameThread.start();
    }
    
    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
        screenWidth = width;
        screenHeight = height;
        groundLevel = screenHeight - 200;
        
        if (player1 != null) {
            player1.setX(200);
            player1.setY(groundLevel);
        }
        if (player2 != null) {
            player2.setX(screenWidth - 200);
            player2.setY(groundLevel);
        }
    }
    
    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        isRunning = false;
        try {
            gameThread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    
    @Override
    public void run() {
        lastTime = System.currentTimeMillis();
        
        while (isRunning) {
            long currentTime = System.currentTimeMillis();
            long deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            
            update(deltaTime);
            draw();
            
            try {
                Thread.sleep(16); // ~60 FPS
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
    
    private void update(long deltaTime) {
        switch (gameState) {
            case STATE_FIGHTING:
                updateFighting(deltaTime);
                break;
        }
    }
    
    private void updateFighting(long deltaTime) {
        if (player1 != null) {
            player1.update(deltaTime);
        }
        if (player2 != null) {
            player2.update(deltaTime);
        }
        
        // Update round timer
        if (roundTimer > 0) {
            roundTimer -= deltaTime;
            if (roundTimer <= 0) {
                endRound();
            }
        }
        
        // Check for finish opportunity
        if (finisher != null) {
            gameState = STATE_FINISH;
        }
    }
    
    private void endRound() {
        boolean p1Alive = player1 != null && player1.isAlive();
        boolean p2Alive = player2 != null && player2.isAlive();
        
        if (p1Alive && !p2Alive) {
            p1Score++;
            finisher = "p1";
        } else if (!p1Alive && p2Alive) {
            p2Score++;
            finisher = "p2";
        }
        
        if (p1Score >= 2 || p2Score >= 2) {
            gameState = STATE_GAME_OVER;
        } else {
            round++;
            resetRound();
        }
    }
    
    private void resetRound() {
        player1 = new Character(selectedP1, 200, groundLevel);
        player2 = new Character(selectedP2, screenWidth - 200, groundLevel);
        roundTimer = 99000;
    }
    
    private void draw() {
        if (surfaceHolder.getSurface().isValid()) {
            Canvas canvas = surfaceHolder.lockCanvas();
            
            try {
                // Clear canvas
                canvas.drawColor(Color.rgb(10, 10, 30));
                
                // Draw based on game state
                switch (gameState) {
                    case STATE_MENU:
                        drawMenu(canvas);
                        break;
                    case STATE_CHARACTER_SELECT:
                        drawCharacterSelect(canvas);
                        break;
                    case STATE_FIGHTING:
                        drawFighting(canvas);
                        break;
                    case STATE_FINISH:
                        drawFinish(canvas);
                        break;
                    case STATE_GAME_OVER:
                        drawGameOver(canvas);
                        break;
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                surfaceHolder.unlockCanvasAndPost(canvas);
            }
        }
    }
    
    private void drawMenu(Canvas canvas) {
        // Draw title
        textPaint.setTextSize(100);
        textPaint.setColor(Color.rgb(255, 0, 255));
        canvas.drawText("МАГІЧНА БИТВА", screenWidth / 2, screenHeight / 3, textPaint);
        
        // Draw subtitle
        textPaint.setTextSize(50);
        textPaint.setColor(Color.rgb(0, 255, 255));
        canvas.drawText("Файтинг з Jujutsu Kaisen", screenWidth / 2, screenHeight / 3 + 80, textPaint);
        
        // Draw start button
        textPaint.setTextSize(60);
        textPaint.setColor(Color.WHITE);
        canvas.drawText("НАТИСНІТЬ ДЛЯ ПОЧАТКУ", screenWidth / 2, screenHeight / 2 + 100, textPaint);
    }
    
    private void drawCharacterSelect(Canvas canvas) {
        // Draw title
        textPaint.setTextSize(80);
        textPaint.setColor(Color.rgb(255, 255, 0));
        canvas.drawText("ОБЕРІТЬ ПЕРСОНАЖА", screenWidth / 2, 100, textPaint);
        
        // Draw character selection grid
        int charWidth = screenWidth / 3;
        int charHeight = 200;
        
        for (int i = 0; i < 6; i++) {
            int row = i / 3;
            int col = i % 3;
            float x = col * charWidth + charWidth / 2;
            float y = 150 + row * charHeight + charHeight / 2;
            
            // Draw selection background
            paint.setColor(selectedP1 == i ? Color.rgb(255, 255, 0, 100) : Color.rgb(255, 255, 255, 50));
            canvas.drawRect(col * charWidth, 150 + row * charHeight, 
                           (col + 1) * charWidth, 150 + (row + 1) * charHeight, paint);
            
            // Draw character
            Character tempChar = new Character(i, x - 60, y - 100);
            tempChar.draw(canvas, paint);
            
            // Draw character name
            textPaint.setTextSize(30);
            textPaint.setColor(Color.WHITE);
            canvas.drawText(Character.NAMES[i], x, y + 120, textPaint);
        }
        
        // Draw VS
        textPaint.setTextSize(80);
        textPaint.setColor(Color.rgb(255, 0, 0));
        canvas.drawText("VS", screenWidth / 2, screenHeight - 300, textPaint);
        
        // Draw start button if both selected
        if (selectedP1 != -1 && selectedP2 != -1) {
            paint.setColor(Color.rgb(0, 255, 0));
            canvas.drawRect(screenWidth / 2 - 200, screenHeight - 150, 
                           screenWidth / 2 + 200, screenHeight - 100, paint);
            textPaint.setTextSize(50);
            textPaint.setColor(Color.WHITE);
            canvas.drawText("ПОЧАТИ БІЙ", screenWidth / 2, screenHeight - 125, textPaint);
        }
    }
    
    private void drawFighting(Canvas canvas) {
        // Draw background
        drawBackground(canvas);
        
        // Draw characters
        if (player1 != null) {
            player1.draw(canvas, paint);
        }
        if (player2 != null) {
            player2.draw(canvas, paint);
        }
        
        // Draw UI
        drawUI(canvas);
    }
    
    private void drawBackground(Canvas canvas) {
        // Draw gradient background
        paint.setColor(Color.rgb(20, 20, 40));
        canvas.drawRect(0, 0, screenWidth, screenHeight, paint);
        
        // Draw ground
        paint.setColor(Color.rgb(50, 50, 50));
        canvas.drawRect(0, groundLevel, screenWidth, screenHeight, paint);
        
        // Draw center line
        paint.setColor(Color.rgb(255, 0, 0, 100));
        canvas.drawRect(screenWidth / 2 - 2, 0, screenWidth / 2 + 2, screenHeight, paint);
    }
    
    private void drawUI(Canvas canvas) {
        // Draw P1 health bar
        paint.setColor(Color.rgb(255, 0, 0));
        float p1HealthWidth = 300 * (player1.getHealth() / player1.getMaxHealth());
        canvas.drawRect(20, 20, 20 + p1HealthWidth, 40, paint);
        paint.setColor(Color.WHITE);
        canvas.drawRect(20, 20, 320, 40, paint);
        
        // Draw P1 mana bar
        paint.setColor(Color.rgb(0, 0, 255));
        float p1ManaWidth = 200 * (player1.getMana() / player1.getMaxMana());
        canvas.drawRect(20, 50, 20 + p1ManaWidth, 60, paint);
        paint.setColor(Color.WHITE);
        canvas.drawRect(20, 50, 220, 60, paint);
        
        // Draw P2 health bar
        paint.setColor(Color.rgb(255, 0, 0));
        float p2HealthWidth = 300 * (player2.getHealth() / player2.getMaxHealth());
        canvas.drawRect(screenWidth - 320, 20, screenWidth - 320 + p2HealthWidth, 40, paint);
        paint.setColor(Color.WHITE);
        canvas.drawRect(screenWidth - 320, 20, screenWidth - 20, 40, paint);
        
        // Draw P2 mana bar
        paint.setColor(Color.rgb(0, 0, 255));
        float p2ManaWidth = 200 * (player2.getMana() / player2.getMaxMana());
        canvas.drawRect(screenWidth - 220, 50, screenWidth - 220 + p2ManaWidth, 60, paint);
        paint.setColor(Color.WHITE);
        canvas.drawRect(screenWidth - 220, 50, screenWidth - 20, 60, paint);
        
        // Draw timer
        long seconds = roundTimer / 1000;
        textPaint.setTextSize(60);
        textPaint.setColor(seconds <= 10 ? Color.RED : Color.WHITE);
        canvas.drawText(String.valueOf(seconds), screenWidth / 2, 50, textPaint);
        
        // Draw round
        textPaint.setTextSize(40);
        textPaint.setColor(Color.rgb(255, 255, 0));
        canvas.drawText("Round " + round, screenWidth / 2, 100, textPaint);
        
        // Draw score
        textPaint.setTextSize(40);
        textPaint.setColor(Color.WHITE);
        canvas.drawText(p1Score + " - " + p2Score, screenWidth / 2, screenHeight - 50, textPaint);
    }
    
    private void drawFinish(Canvas canvas) {
        // Draw finish background
        paint.setColor(Color.rgb(150, 0, 0, 200));
        canvas.drawRect(0, 0, screenWidth, screenHeight, paint);
        
        // Draw finish text
        textPaint.setTextSize(100);
        textPaint.setColor(Color.rgb(255, 215, 0));
        canvas.drawText("ДОБИВАННЯ!", screenWidth / 2, screenHeight / 3, textPaint);
        
        // Draw winner
        textPaint.setTextSize(60);
        textPaint.setColor(Color.WHITE);
        String winner = finisher.equals("p1") ? player1.getName() : player2.getName();
        canvas.drawText("Переможець: " + winner, screenWidth / 2, screenHeight / 2, textPaint);
        
        // Draw continue button
        paint.setColor(Color.rgb(0, 255, 0));
        canvas.drawRect(screenWidth / 2 - 200, screenHeight - 200, 
                       screenWidth / 2 + 200, screenHeight - 150, paint);
        textPaint.setTextSize(50);
        textPaint.setColor(Color.WHITE);
        canvas.drawText("ПРОДОВЖИТИ", screenWidth / 2, screenHeight - 175, textPaint);
    }
    
    private void drawGameOver(Canvas canvas) {
        // Draw game over background
        paint.setColor(Color.BLACK);
        canvas.drawRect(0, 0, screenWidth, screenHeight, paint);
        
        // Draw game over text
        textPaint.setTextSize(100);
        textPaint.setColor(Color.rgb(255, 0, 0));
        canvas.drawText("КІНЕЦЬ БОЮ", screenWidth / 2, screenHeight / 3, textPaint);
        
        // Draw winner
        textPaint.setTextSize(60);
        textPaint.setColor(Color.rgb(255, 215, 0));
        String winner = p1Score > p2Score ? player1.getName() : player2.getName();
        canvas.drawText("Переможець: " + winner, screenWidth / 2, screenHeight / 2, textPaint);
        
        // Draw final score
        textPaint.setTextSize(50);
        textPaint.setColor(Color.WHITE);
        canvas.drawText("Рахунок: " + p1Score + " - " + p2Score, screenWidth / 2, screenHeight / 2 + 80, textPaint);
        
        // Draw restart button
        paint.setColor(Color.rgb(0, 255, 0));
        canvas.drawRect(screenWidth / 2 - 200, screenHeight - 200, 
                       screenWidth / 2 + 200, screenHeight - 150, paint);
        textPaint.setTextSize(50);
        textPaint.setColor(Color.WHITE);
        canvas.drawText("ГОЛОВНЕ МЕНЮ", screenWidth / 2, screenHeight - 175, textPaint);
    }
    
    @Override
    public boolean onTouchEvent(MotionEvent event) {
        touchX = event.getX();
        touchY = event.getY();
        touchActive = event.getAction() == MotionEvent.ACTION_DOWN || 
                      event.getAction() == MotionEvent.ACTION_MOVE;
        
        switch (gameState) {
            case STATE_MENU:
                if (event.getAction() == MotionEvent.ACTION_UP) {
                    gameState = STATE_CHARACTER_SELECT;
                }
                break;
                
            case STATE_CHARACTER_SELECT:
                handleCharacterSelect(event);
                break;
                
            case STATE_FIGHTING:
                handleFightingInput(event);
                break;
                
            case STATE_FINISH:
                if (event.getAction() == MotionEvent.ACTION_UP) {
                    // Check if continue button pressed
                    if (touchX > screenWidth / 2 - 200 && touchX < screenWidth / 2 + 200 &&
                        touchY > screenHeight - 200 && touchY < screenHeight - 150) {
                        round++;
                        resetRound();
                        gameState = STATE_FIGHTING;
                        finisher = null;
                    }
                }
                break;
                
            case STATE_GAME_OVER:
                if (event.getAction() == MotionEvent.ACTION_UP) {
                    // Check if restart button pressed
                    if (touchX > screenWidth / 2 - 200 && touchX < screenWidth / 2 + 200 &&
                        touchY > screenHeight - 200 && touchY < screenHeight - 150) {
                        gameState = STATE_MENU;
                        p1Score = 0;
                        p2Score = 0;
                        round = 1;
                        selectedP1 = -1;
                        selectedP2 = -1;
                    }
                }
                break;
        }
        
        return true;
    }
    
    private void handleCharacterSelect(MotionEvent event) {
        if (event.getAction() == MotionEvent.ACTION_UP) {
            int charWidth = screenWidth / 3;
            int charHeight = 200;
            
            for (int i = 0; i < 6; i++) {
                int row = i / 3;
                int col = i % 3;
                float left = col * charWidth;
                float right = (col + 1) * charWidth;
                float top = 150 + row * charHeight;
                float bottom = 150 + (row + 1) * charHeight;
                
                if (touchX > left && touchX < right && touchY > top && touchY < bottom) {
                    if (selectedP1 == -1) {
                        selectedP1 = i;
                    } else if (selectedP2 == -1) {
                        selectedP2 = i;
                    } else {
                        selectedP1 = i;
                        selectedP2 = -1;
                    }
                    break;
                }
            }
            
            // Check if start button pressed
            if (selectedP1 != -1 && selectedP2 != -1) {
                float startLeft = screenWidth / 2 - 200;
                float startRight = screenWidth / 2 + 200;
                float startTop = screenHeight - 150;
                float startBottom = screenHeight - 100;
                
                if (touchX > startLeft && touchX < startRight && 
                    touchY > startTop && touchY < startBottom) {
                    player1 = new Character(selectedP1, 200, groundLevel);
                    player2 = new Character(selectedP2, screenWidth - 200, groundLevel);
                    gameState = STATE_FIGHTING;
                    roundTimer = 99000;
                }
            }
        }
    }
    
    private void handleFightingInput(MotionEvent event) {
        if (event.getAction() == MotionEvent.ACTION_DOWN) {
            // Left side of screen - P1 controls
            if (touchX < screenWidth / 2) {
                // Check for attack buttons
                if (touchY < screenHeight / 3) {
                    player1.attack();
                } else if (touchY < screenHeight / 2) {
                    player1.specialAttack();
                } else {
                    player1.block(true);
                }
            }
            // Right side of screen - P2 controls
            else {
                if (touchY < screenHeight / 3) {
                    player2.attack();
                } else if (touchY < screenHeight / 2) {
                    player2.specialAttack();
                } else {
                    player2.block(true);
                }
            }
        } else if (event.getAction() == MotionEvent.ACTION_UP) {
            player1.block(false);
            player2.block(false);
        }
        
        // Movement - handled in ACTION_MOVE
        if (event.getAction() == MotionEvent.ACTION_MOVE && touchActive) {
            if (touchX < screenWidth / 2) {
                // P1 movement
                float dx = (touchX - (screenWidth / 4)) / (screenWidth / 4);
                player1.move(dx, 0);
            } else {
                // P2 movement
                float dx = (touchX - (screenWidth * 3 / 4)) / (screenWidth / 4);
                player2.move(dx, 0);
            }
        }
    }
    
    public void setGameState(int state) {
        gameState = state;
    }
}
