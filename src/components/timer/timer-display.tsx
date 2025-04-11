import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTimer } from "@/hooks/use-timer";
import { cn } from "@/lib/utils";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import React from "react";
import { TimerSettingsDialog } from "./timer-settings";

interface TimerDisplayProps {
  className?: string;
}

export function TimerDisplay({ className }: TimerDisplayProps) {
  const { state, settings, actions, formattedTime } = useTimer();

  const getProgress = () => {
    const totalSeconds =
      state.mode === "work"
        ? settings.workDuration * 60
        : state.mode === "break"
        ? settings.breakDuration * 60
        : settings.longBreakDuration * 60;

    return ((totalSeconds - state.timeRemaining) / totalSeconds) * 100;
  };

  const getModeColor = () => {
    switch (state.mode) {
      case "work":
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
      case "break":
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
      case "longBreak":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-full flex items-center justify-between px-4">
            <div
              className={cn(
                "px-4 py-1 rounded-full text-sm font-medium capitalize",
                getModeColor()
              )}
            >
              {state.mode} Session
            </div>
            <TimerSettingsDialog
              settings={settings}
              onSave={actions.updateSettings}
            />
          </div>

          <div className="text-7xl font-bold tracking-tighter tabular-nums">
            {formattedTime}
          </div>

          <Progress value={getProgress()} className="w-full h-2" />

          <div className="flex items-center gap-2">
            {state.isActive ? (
              <Button variant="outline" size="icon" onClick={actions.pause}>
                <Pause className="h-4 w-4" />
              </Button>
            ) : (
              <Button size="icon" onClick={actions.start}>
                <Play className="h-4 w-4" />
              </Button>
            )}

            <Button variant="outline" size="icon" onClick={actions.skip}>
              <SkipForward className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" onClick={actions.reset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Session {state.currentSession} of {settings.sessionsBeforeLongBreak}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
