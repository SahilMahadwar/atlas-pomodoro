export interface Task {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  status: "active" | "completed";
  createdAt: Date;
}

export interface TimerSettings {
  workDuration: number; // in minutes
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}

export interface TimerState {
  mode: "work" | "break" | "longBreak";
  timeRemaining: number;
  isActive: boolean;
  currentSession: number;
}

export type TimerMode = TimerState["mode"];

export interface FlowScore {
  sessionCompletion: number;
  breakAdherence: number;
  taskAccuracy: number;
  overallScore: number;
}
