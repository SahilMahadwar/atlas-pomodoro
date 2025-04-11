interface AudioContextType {
  new (): AudioContext;
}

interface ExtendedWindow extends Window {
  AudioContext?: AudioContextType;
  webkitAudioContext?: AudioContextType;
}

declare const window: ExtendedWindow;

class SoundService {
  play(sound: "workComplete" | "breakComplete") {
    try {
      // Try system notifications first
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(
          sound === "workComplete"
            ? "Work Session Complete!"
            : "Break Complete!",
          {
            silent: true, // We don't want double notifications
          }
        );
      }

      // Fallback to browser audio
      try {
        const AudioContextConstructor: AudioContextType =
          (window.AudioContext ||
            window.webkitAudioContext) as AudioContextType;

        if (!AudioContextConstructor) {
          throw new Error("AudioContext not supported");
        }

        const context = new AudioContextConstructor();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        // Configure the sound based on the type
        if (sound === "workComplete") {
          oscillator.frequency.setValueAtTime(660, context.currentTime); // Higher pitch for work
          gainNode.gain.setValueAtTime(0.1, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            context.currentTime + 0.5
          );
          oscillator.start(context.currentTime);
          oscillator.stop(context.currentTime + 0.5);
        } else {
          oscillator.frequency.setValueAtTime(440, context.currentTime); // Lower pitch for break
          gainNode.gain.setValueAtTime(0.1, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            context.currentTime + 0.3
          );
          oscillator.start(context.currentTime);
          oscillator.stop(context.currentTime + 0.3);
        }
      } catch (audioError) {
        console.warn("Audio playback failed:", audioError);
        // If audio fails, we'll still have the notification as fallback
      }
    } catch (error) {
      console.warn("Notification and audio playback failed:", error);
      // Silently fail if neither notification nor audio is available
    }
  }

  // Request notification permissions if needed
  async requestPermissions() {
    if ("Notification" in window && Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch (error) {
        console.warn("Failed to request notification permission:", error);
      }
    }
  }
}

export const soundService = new SoundService();
