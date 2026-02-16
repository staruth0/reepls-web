# Audio Player Component

A React audio player component built with WaveSurfer.js that persists across navigation and provides a rich audio playback experience.

## Features

- 🎵 **WaveSurfer.js Integration** - Beautiful waveform visualization
- 🔄 **Persistent Playback** - Continues playing across route changes
- 📱 **Responsive Design** - Works on all screen sizes
- 🎛️ **Full Controls** - Play, pause, seek, volume, mute
- 💾 **State Persistence** - Remembers playback position and settings
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations

## Installation

The required dependencies are already installed:

- `@wavesurfer/react`
- `wavesurfer.js`

## Usage

### 1. Setup Provider

The `AudioPlayerProvider` is already set up in your `main.tsx`:

```tsx
import { AudioPlayerProvider } from "./components/molecules/AudioPlayer/AudioPlayerProvider";

// In your provider tree
<AudioPlayerProvider>
  <App />
</AudioPlayerProvider>;
```

### 2. Add Global Player

The `AudioPlayer` component is already added to your `App.tsx`:

```tsx
import { AudioPlayer } from "./components/molecules/AudioPlayer";

// In your App component
<AudioPlayer />;
```

### 3. Control Audio from Anywhere

Use the `useAudioPlayerControls` hook in any component:

```tsx
import {
  useAudioPlayerControls,
  AudioTrack,
} from "./components/molecules/AudioPlayer";

const MyComponent = () => {
  const { playTrack, currentTrack, isPlaying } = useAudioPlayerControls();

  const handlePlay = () => {
    const track: AudioTrack = {
      id: "1",
      title: "My Song",
      artist: "Artist Name",
      url: "https://example.com/audio.mp3",
      thumbnail: "https://example.com/thumbnail.jpg",
    };

    playTrack(track);
  };

  return (
    <div>
      <button onClick={handlePlay}>Play Song</button>
      {currentTrack && <p>Now playing: {currentTrack.title}</p>}
    </div>
  );
};
```

## API Reference

### AudioTrack Interface

```tsx
interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  url: string;
  thumbnail?: string;
  duration?: number;
}
```

### useAudioPlayerControls Hook

Returns an object with:

#### State Properties

- `currentTrack: AudioTrack | null` - Currently loaded track
- `isPlaying: boolean` - Playback status
- `currentTime: number` - Current playback time in seconds
- `duration: number` - Total track duration in seconds
- `volume: number` - Current volume (0-1)
- `isMuted: boolean` - Mute status
- `isLoading: boolean` - Loading status
- `error: string | null` - Error message if any

#### Action Methods

- `playTrack(track: AudioTrack)` - Load and play a track
- `playCurrentTrack()` - Play the currently loaded track
- `pauseCurrentTrack()` - Pause playback
- `stopCurrentTrack()` - Stop and reset to beginning
- `seekToTime(time: number)` - Seek to specific time
- `seekToPercentage(percentage: number)` - Seek by percentage
- `setVolumeLevel(volume: number)` - Set volume (0-1)
- `toggleMuteState()` - Toggle mute
- `loadNewTrack(track: AudioTrack)` - Load track without playing
- `clearErrorMessage()` - Clear error state

## Examples

### Basic Usage

```tsx
import { useAudioPlayerControls } from "./components/molecules/AudioPlayer";

const PlayButton = ({ track }) => {
  const { playTrack, isPlaying } = useAudioPlayerControls();

  return (
    <button onClick={() => playTrack(track)}>
      {isPlaying ? "Pause" : "Play"}
    </button>
  );
};
```

### Progress Bar

{% raw %}
```tsx
const ProgressBar = () => {
  const { currentTime, duration, seekToPercentage } = useAudioPlayerControls();

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${progress}%` }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const percentage = (clickX / rect.width) * 100;
          seekToPercentage(percentage);
        }}
      />
    </div>
  );
};
```
{% endraw %}

### Volume Control

```tsx
const VolumeControl = () => {
  const { volume, setVolumeLevel, isMuted, toggleMuteState } =
    useAudioPlayerControls();

  return (
    <div className="volume-control">
      <button onClick={toggleMuteState}>{isMuted ? "🔇" : "🔊"}</button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMuted ? 0 : volume}
        onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
      />
    </div>
  );
};
```

## Styling

The component uses SCSS with BEM methodology. The main classes are:

- `.audio-player` - Main container
- `.audio-player__container` - Inner layout container
- `.audio-player__info` - Track information section
- `.audio-player__waveform` - Waveform visualization
- `.audio-player__controls` - Playback controls
- `.audio-player__volume` - Volume controls

## Browser Support

- Modern browsers with Web Audio API support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)

## Notes

- The player persists state in localStorage
- Audio continues playing when switching browser tabs
- Waveform is automatically generated from the audio file
- Responsive design adapts to different screen sizes
- Error handling for failed audio loads
