package com.magicalbattle.android;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;

/**
 * Character class for Magical Battle fighting game
 * Represents a fighter with abilities and animations
 */
public class Character {
    
    // Character types
    public static final int TYPE_GOJO = 0;
    public static final int TYPE_YUJI = 1;
    public static final int TYPE_MEGUMI = 2;
    public static final int TYPE_NOBARA = 3;
    public static final int TYPE_SUKUNA = 4;
    public static final int TYPE_TOJI = 5;
    
    // Character names
    public static final String[] NAMES = {
        "Gojo", "Yuji", "Megumi", "Nobara", "Sukuna", "Toji"
    };
    
    // Character colors
    public static final int[] COLORS = {
        Color.rgb(0, 100, 255),    // Gojo - Blue
        Color.rgb(200, 50, 50),     // Yuji - Red
        Color.rgb(0, 150, 0),       // Megumi - Green
        Color.rgb(255, 100, 150),   // Nobara - Pink
        Color.rgb(150, 0, 0),       // Sukuna - Dark Red
        Color.rgb(150, 150, 150)    // Toji - Gray
    };
    
    // Character stats
    public static final float[] HEALTH = {120, 110, 100, 95, 130, 105};
    public static final float[] MANA = {100, 80, 120, 90, 70, 60};
    public static final float[] SPEED = {8, 7, 6, 7, 9, 10};
    
    // Character properties
    private int type;
    private String name;
    private float health;
    private float maxHealth;
    private float mana;
    private float maxMana;
    private float speed;
    private float x, y;
    private float width, height;
    private int facing; // 1 = right, -1 = left
    private boolean isBlocking;
    private boolean isHit;
    private String state; // idle, walk, attack, special, block, hit, finish
    private long stateTimer;
    private Bitmap sprite;
    
    // Attack properties
    private float attackDamage;
    private float attackRange;
    private long attackCooldown;
    private long lastAttackTime;
    
    // Special attack properties
    private float specialDamage;
    private float specialRange;
    private long specialCooldown;
    private long lastSpecialTime;
    private float specialManaCost;
    
    public Character(int type, float x, float y) {
        this.type = type;
        this.name = NAMES[type];
        this.x = x;
        this.y = y;
        this.width = 120;
        this.height = 200;
        this.facing = 1;
        this.state = "idle";
        this.maxHealth = HEALTH[type];
        this.health = maxHealth;
        this.maxMana = MANA[type];
        this.mana = maxMana;
        this.speed = SPEED[type];
        
        // Set attack properties based on type
        switch (type) {
            case TYPE_GOJO:
                attackDamage = 12;
                attackRange = 50;
                attackCooldown = 500;
                specialDamage = 30;
                specialRange = 100;
                specialCooldown = 3000;
                specialManaCost = 30;
                break;
            case TYPE_YUJI:
                attackDamage = 10;
                attackRange = 45;
                attackCooldown = 400;
                specialDamage = 25;
                specialRange = 60;
                specialCooldown = 4000;
                specialManaCost = 25;
                break;
            case TYPE_MEGUMI:
                attackDamage = 8;
                attackRange = 50;
                attackCooldown = 300;
                specialDamage = 20;
                specialRange = 200;
                specialCooldown = 5000;
                specialManaCost = 40;
                break;
            case TYPE_NOBARA:
                attackDamage = 9;
                attackRange = 45;
                attackCooldown = 500;
                specialDamage = 28;
                specialRange = 60;
                specialCooldown = 4000;
                specialManaCost = 35;
                break;
            case TYPE_SUKUNA:
                attackDamage = 12;
                attackRange = 50;
                attackCooldown = 400;
                specialDamage = 35;
                specialRange = 80;
                specialCooldown = 2500;
                specialManaCost = 20;
                break;
            case TYPE_TOJI:
                attackDamage = 8;
                attackRange = 40;
                attackCooldown = 300;
                specialDamage = 25;
                specialRange = 70;
                specialCooldown = 3000;
                specialManaCost = 15;
                break;
        }
    }
    
    public void update(long deltaTime) {
        // Update state timer
        if (stateTimer > 0) {
            stateTimer -= deltaTime;
            if (stateTimer <= 0) {
                state = "idle";
            }
        }
        
        // Regenerate mana
        if (mana < maxMana) {
            mana += 0.2f * deltaTime / 16;
            if (mana > maxMana) mana = maxMana;
        }
    }
    
    public void move(float dx, float dy) {
        x += dx * speed;
        y += dy * speed;
        if (dx > 0) facing = 1;
        if (dx < 0) facing = -1;
        if (Math.abs(dx) > 0.1) state = "walk";
    }
    
    public boolean attack() {
        if (System.currentTimeMillis() - lastAttackTime < attackCooldown) {
            return false;
        }
        lastAttackTime = System.currentTimeMillis();
        state = "attack";
        stateTimer = 500;
        return true;
    }
    
    public boolean specialAttack() {
        if (System.currentTimeMillis() - lastSpecialTime < specialCooldown) {
            return false;
        }
        if (mana < specialManaCost) {
            return false;
        }
        lastSpecialTime = System.currentTimeMillis();
        mana -= specialManaCost;
        state = "special";
        stateTimer = 800;
        return true;
    }
    
    public void block(boolean blocking) {
        isBlocking = blocking;
        if (blocking) {
            state = "block";
            stateTimer = 300;
        }
    }
    
    public void hit(float damage) {
        if (isBlocking) {
            damage *= 0.3f;
        }
        health -= damage;
        if (health < 0) health = 0;
        isHit = true;
        state = "hit";
        stateTimer = 500;
    }
    
    public void draw(Canvas canvas, Paint paint) {
        // Draw character body
        paint.setColor(COLORS[type]);
        
        // Save canvas state
        canvas.save();
        
        // Apply facing direction
        if (facing == -1) {
            canvas.translate(x + width, y);
            canvas.scale(-1, 1);
        } else {
            canvas.translate(x, y);
        }
        
        // Draw body (simplified pixel art style)
        drawCharacterBody(canvas, paint);
        
        // Draw state effects
        drawStateEffects(canvas, paint);
        
        // Restore canvas
        canvas.restore();
        
        // Draw health bar above character
        paint.setColor(Color.RED);
        canvas.drawRect(x, y - 20, x + width * (health / maxHealth), y - 15, paint);
        paint.setColor(Color.WHITE);
        canvas.drawRect(x, y - 20, x + width, y - 15, paint);
    }
    
    private void drawCharacterBody(Canvas canvas, Paint paint) {
        // Head
        paint.setColor(Color.WHITE);
        canvas.drawRect(30, 0, 90, 50, paint);
        
        // Hair
        paint.setColor(getHairColor());
        canvas.drawRect(20, 0, 100, 30, paint);
        
        // Eyes
        paint.setColor(getEyeColor());
        canvas.drawRect(40, 20, 50, 28, paint);
        canvas.drawRect(70, 20, 80, 28, paint);
        
        // Body
        paint.setColor(COLORS[type]);
        canvas.drawRect(10, 50, 110, 150, paint);
        
        // Arms
        canvas.drawRect(0, 60, 30, 120, paint);
        canvas.drawRect(110, 60, 140, 120, paint);
        
        // Legs
        canvas.drawRect(30, 150, 60, 200, paint);
        canvas.drawRect(70, 150, 100, 200, paint);
        
        // Character-specific details
        drawCharacterDetails(canvas, paint);
    }
    
    private void drawCharacterDetails(Canvas canvas, Paint paint) {
        switch (type) {
            case TYPE_GOJO:
                // Blindfold
                paint.setColor(Color.BLUE);
                canvas.drawRect(35, 15, 85, 25, paint);
                break;
            case TYPE_YUJI:
                // Scars
                paint.setColor(Color.RED);
                canvas.drawRect(50, 5, 55, 15, paint);
                canvas.drawRect(65, 5, 70, 15, paint);
                break;
            case TYPE_MEGUMI:
                // Hair details
                paint.setColor(Color.rgb(0, 50, 0));
                canvas.drawRect(15, 5, 25, 25, paint);
                canvas.drawRect(95, 5, 105, 25, paint);
                break;
            case TYPE_NOBARA:
                // Hair ribbons
                paint.setColor(Color.rgb(255, 100, 150));
                canvas.drawRect(10, 5, 20, 25, paint);
                canvas.drawRect(100, 5, 110, 25, paint);
                break;
            case TYPE_SUKUNA:
                // Tattoos
                paint.setColor(Color.rgb(100, 0, 0));
                canvas.drawRect(25, 35, 35, 40, paint);
                canvas.drawRect(85, 35, 95, 40, paint);
                break;
            case TYPE_TOJI:
                // Mask
                paint.setColor(Color.GRAY);
                canvas.drawRect(35, 15, 85, 35, paint);
                break;
        }
    }
    
    private void drawStateEffects(Canvas canvas, Paint paint) {
        switch (state) {
            case "hit":
                paint.setColor(Color.rgb(255, 50, 50, 150));
                canvas.drawRect(0, 50, 120, 150, paint);
                break;
            case "block":
                paint.setColor(Color.rgb(0, 100, 255, 100));
                if (facing == 1) {
                    canvas.drawRect(110, 50, 140, 150, paint);
                } else {
                    canvas.drawRect(-20, 50, 10, 150, paint);
                }
                break;
            case "attack":
                paint.setColor(Color.rgb(255, 255, 0, 150));
                if (facing == 1) {
                    canvas.drawRect(110, 80, 140, 100, paint);
                } else {
                    canvas.drawRect(-20, 80, 10, 100, paint);
                }
                break;
            case "special":
                paint.setColor(Color.rgb(255, 0, 255, 100));
                canvas.drawCircle(60, 75, 60, paint);
                break;
        }
    }
    
    private int getHairColor() {
        switch (type) {
            case TYPE_GOJO: return Color.WHITE;
            case TYPE_YUJI: return Color.rgb(50, 50, 50);
            case TYPE_MEGUMI: return Color.BLACK;
            case TYPE_NOBARA: return Color.rgb(255, 120, 0);
            case TYPE_SUKUNA: return Color.WHITE;
            case TYPE_TOJI: return Color.rgb(50, 50, 50);
            default: return Color.BLACK;
        }
    }
    
    private int getEyeColor() {
        switch (type) {
            case TYPE_GOJO: return Color.BLACK;
            case TYPE_YUJI: return Color.RED;
            case TYPE_MEGUMI: return Color.GREEN;
            case TYPE_NOBARA: return Color.rgb(255, 100, 150);
            case TYPE_SUKUNA: return Color.rgb(200, 0, 0);
            case TYPE_TOJI: return Color.BLACK;
            default: return Color.BLACK;
        }
    }
    
    // Getters and Setters
    public int getType() { return type; }
    public String getName() { return name; }
    public float getX() { return x; }
    public float getY() { return y; }
    public float getWidth() { return width; }
    public float getHeight() { return height; }
    public float getHealth() { return health; }
    public float getMaxHealth() { return maxHealth; }
    public float getMana() { return mana; }
    public float getMaxMana() { return maxMana; }
    public int getFacing() { return facing; }
    public boolean isBlocking() { return isBlocking; }
    public String getState() { return state; }
    public float getAttackDamage() { return attackDamage; }
    public float getAttackRange() { return attackRange; }
    public float getSpecialDamage() { return specialDamage; }
    public float getSpecialRange() { return specialRange; }
    public boolean isAlive() { return health > 0; }
    
    public void setX(float x) { this.x = x; }
    public void setY(float y) { this.y = y; }
    public void setState(String state) { this.state = state; }
    public void setSprite(Bitmap sprite) { this.sprite = sprite; }
}
