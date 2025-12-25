# Source Code Directory

This directory contains all the source code for the tactical RPG game.

## Directory Structure

### `/core`
Core game engine components:
- Game loop and state management
- Event system
- Resource management
- Configuration

### `/systems`
Game systems and mechanics:
- **combat**: Battle system, damage calculation, turn order
- **character**: Character stats, progression, classes
- **map**: Grid/tile system, pathfinding, terrain
- **inventory**: Item management, equipment system
- **skill**: Skill/ability system, effects
- **ai**: Enemy AI, behavior patterns

### `/ui`
User interface components:
- **hud**: Heads-up display, status bars, minimap
- **menu**: Main menu, pause menu, settings
- **dialog**: Dialogue system, text boxes
- **battle**: Battle UI, action selection, target selection

### `/data`
Game data and configurations:
- **characters**: Character definitions and stats
- **skills**: Skill and ability definitions
- **items**: Item and equipment data
- **maps**: Map layouts and configurations
- **enemies**: Enemy definitions and behaviors

### `/utils`
Utility functions and helpers:
- Math utilities
- Helper functions
- Constants and enums

### `/scenes`
Game scenes:
- Battle scenes
- Menu scenes
- Cutscenes
