import { FlowScore } from "@/types/timer";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "focus-flow-stats";

interface FlowStats {
  completedSessions: number;
  interruptions: number;
  totalFocusTime: number; // in minutes
  estimatedTime: number; // in minutes
}

const DEFAULT_STATS: FlowStats = {
  completedSessions: 0,
  interruptions: 0,
  totalFocusTime: 0,
  estimatedTime: 0,
};

export function useFocusFlow() {
  const [stats, setStats] = useState<FlowStats>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error("Error parsing stored focus stats:", error);
        return DEFAULT_STATS;
      }
    }
    return DEFAULT_STATS;
  });

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const recordSessionCompletion = useCallback((duration: number) => {
    setStats((prev) => ({
      ...prev,
      completedSessions: prev.completedSessions + 1,
      totalFocusTime: prev.totalFocusTime + duration,
    }));
  }, []);

  const recordInterruption = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      interruptions: prev.interruptions + 1,
    }));
  }, []);

  const updateEstimatedTime = useCallback((time: number) => {
    setStats((prev) => ({
      ...prev,
      estimatedTime: prev.estimatedTime + time,
    }));
  }, []);

  const calculateFlowScore = useCallback((): FlowScore => {
    const sessionCompletion = Math.min(stats.completedSessions * 10, 100);
    const interruptionPenalty = Math.max(0, 100 - stats.interruptions * 5);
    const timeAccuracy =
      stats.totalFocusTime > 0
        ? Math.min(100, (stats.totalFocusTime / stats.estimatedTime) * 100)
        : 0;

    const overallScore = Math.round(
      (sessionCompletion + interruptionPenalty + timeAccuracy) / 3
    );

    return {
      sessionCompletion,
      breakAdherence: interruptionPenalty,
      taskAccuracy: timeAccuracy,
      overallScore,
    };
  }, [stats]);

  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS);
  }, []);

  return {
    stats,
    actions: {
      recordSessionCompletion,
      recordInterruption,
      updateEstimatedTime,
      resetStats,
    },
    flowScore: calculateFlowScore(),
  };
}
