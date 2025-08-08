# Simple Background Music Setup

## How to Add Music to Your Game

### 1. Add Music Files
Place your music files in the `public/audio/` folder:

```
public/
  audio/
    main-menu-theme.mp3    <- Main menu background music
    gameplay-theme.mp3     <- During battle music  
    victory-theme.mp3      <- Victory music
    defeat-theme.mp3       <- Defeat music
```

### 2. Recommended Music Files
- **Main Menu**: Calm, atmospheric music (2-4 minutes, looped)
- **Gameplay**: Intense battle music (3-5 minutes, looped)  
- **Victory**: Triumphant fanfare (30-60 seconds)
- **Defeat**: Somber defeat music (30-60 seconds)

### 3. Usage in Components
```jsx
import useBackgroundMusic from '../hooks/useBackgroundMusic';

function YourPage() {
  // Music will auto-play after user clicks anywhere
  useBackgroundMusic('/audio/your-music.mp3', 0.3); // 30% volume
  
  return <div>Your page content</div>;
}
```

### 4. File Format Tips
- Use **MP3** format for best browser compatibility
- Keep files under **5MB** for faster loading
- Use **44.1kHz, 16-bit** quality for web
- **Loop-friendly** music works best (seamless start/end)

### 5. Free Music Resources
- **OpenGameArt.org** - Free game music
- **Freesound.org** - Free sound effects
- **YouTube Audio Library** - Royalty-free music
- **Incompetech.com** - Kevin MacLeod's free music

## Current Setup
✅ **HomePage**: `/audio/main-menu-theme.mp3`  
🔄 **Game Page**: Add `/audio/gameplay-theme.mp3`  
🔄 **Victory**: Add `/audio/victory-theme.mp3`  
🔄 **Defeat**: Add `/audio/defeat-theme.mp3`

The music will start automatically after the user's first click or keypress (browser requirement).
