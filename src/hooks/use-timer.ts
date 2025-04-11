import { soundService } from "@/services/sound";
import { useCallback, useEffect, useRef, useState } from "react";
import { TimerMode, TimerSettings, TimerState } from "../types/timer";
import { useFocusFlow } from "./use-focus-flow";
import { useToast } from "./use-toast";

const STORAGE_KEY = "pomodoro-settings";

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
};

export function useTimer(initialSettings?: Partial<TimerSettings>) {
  const { toast } = useToast();
  const { actions: focusActions } = useFocusFlow();
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      } catch (error) {
        console.error("Error parsing stored settings:", error);
      }
    }
    return { ...DEFAULT_SETTINGS, ...initialSettings };
  });

  const [state, setState] = useState<TimerState>(() => ({
    mode: "work",
    timeRemaining: settings.workDuration * 60,
    isActive: false,
    currentSession: 1,
  }));

  const intervalRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((newSettings: TimerSettings) => {
    setSettings(newSettings);
    setState((prev) => ({
      ...prev,
      timeRemaining: newSettings[`${prev.mode}Duration`] * 60,
      isActive: false,
    }));
  }, []);

  const getNextMode = useCallback((): TimerMode => {
    if (state.mode === "work") {
      if (state.currentSession % settings.sessionsBeforeLongBreak === 0) {
        return "longBreak";
      }
      return "break";
    }
    return "work";
  }, [state.mode, state.currentSession, settings.sessionsBeforeLongBreak]);

  const getDuration = useCallback(
    (mode: TimerMode): number => {
      switch (mode) {
        case "work":
          return settings.workDuration * 60;
        case "break":
          return settings.breakDuration * 60;
        case "longBreak":
          return settings.longBreakDuration * 60;
        default:
          return settings.workDuration * 60;
      }
    },
    [settings]
  );

  const reset = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      if (state.mode === "work") {
        focusActions.recordInterruption();
      }
    }
    setState({
      mode: "work",
      timeRemaining: settings.workDuration * 60,
      isActive: false,
      currentSession: 1,
    });
  }, [settings, state.mode, focusActions]);

  const start = useCallback(() => {
    if (!state.isActive) {
      startTimeRef.current = Date.now();
      setState((prev) => ({ ...prev, isActive: true }));
    }
  }, [state.isActive]);

  const pause = useCallback(() => {
    if (state.isActive) {
      if (state.mode === "work") {
        focusActions.recordInterruption();
      }
      setState((prev) => ({ ...prev, isActive: false }));
    }
  }, [state.isActive, state.mode, focusActions]);

  const skip = useCallback(() => {
    const nextMode = getNextMode();
    const nextSession =
      nextMode === "work" ? state.currentSession + 1 : state.currentSession;

    if (state.mode === "work") {
      focusActions.recordInterruption();
    }

    setState((prev) => ({
      ...prev,
      mode: nextMode,
      timeRemaining: getDuration(nextMode),
      currentSession: nextSession,
      isActive: false,
    }));
  }, [
    getNextMode,
    getDuration,
    state.currentSession,
    state.mode,
    focusActions,
  ]);

  useEffect(() => {
    if (state.isActive) {
      intervalRef.current = window.setInterval(() => {
        setState((prev) => {
          if (prev.timeRemaining <= 1) {
            window.clearInterval(intervalRef.current);
            const nextMode = getNextMode();
            const nextSession =
              nextMode === "work"
                ? prev.currentSession + 1
                : prev.currentSession;

            // Record completed session if work mode is finishing
            if (prev.mode === "work") {
              const sessionDuration =
                (Date.now() - startTimeRef.current) / 1000 / 60; // Convert to minutes
              focusActions.recordSessionCompletion(sessionDuration);
            }

            // Play appropriate sound
            soundService.play(
              prev.mode === "work" ? "workComplete" : "breakComplete"
            );

            // Show notification
            toast({
              title: `${
                prev.mode.charAt(0).toUpperCase() + prev.mode.slice(1)
              } session completed!`,
              description: `Starting ${nextMode} session...`,
            });

            return {
              ...prev,
              mode: nextMode,
              timeRemaining: getDuration(nextMode),
              currentSession: nextSession,
              isActive: false,
            };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [state.isActive, getNextMode, getDuration, toast, focusActions]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return {
    state,
    settings,
    actions: {
      start,
      pause,
      reset,
      skip,
      updateSettings,
    },
    formattedTime: formatTime(state.timeRemaining),
  };
}
