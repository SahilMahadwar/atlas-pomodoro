import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TimerSettings } from "@/types/timer";
import { Settings } from "lucide-react";
import React, { useState } from "react";

interface TimerSettingsDialogProps {
  settings: TimerSettings;
  onSave: (settings: TimerSettings) => void;
}

export function TimerSettingsDialog({
  settings,
  onSave,
}: TimerSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [workDuration, setWorkDuration] = useState(
    settings.workDuration.toString()
  );
  const [breakDuration, setBreakDuration] = useState(
    settings.breakDuration.toString()
  );
  const [longBreakDuration, setLongBreakDuration] = useState(
    settings.longBreakDuration.toString()
  );
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(
    settings.sessionsBeforeLongBreak.toString()
  );

  const handleSave = () => {
    const newSettings: TimerSettings = {
      workDuration: Math.max(1, Math.min(60, parseInt(workDuration) || 25)),
      breakDuration: Math.max(1, Math.min(30, parseInt(breakDuration) || 5)),
      longBreakDuration: Math.max(
        1,
        Math.min(60, parseInt(longBreakDuration) || 15)
      ),
      sessionsBeforeLongBreak: Math.max(
        1,
        Math.min(10, parseInt(sessionsBeforeLongBreak) || 4)
      ),
    };

    onSave(newSettings);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="workDuration">
              Work Duration (minutes)
            </label>
            <Input
              id="workDuration"
              type="number"
              min="1"
              max="60"
              value={workDuration}
              onChange={(e) => setWorkDuration(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="breakDuration">
              Break Duration (minutes)
            </label>
            <Input
              id="breakDuration"
              type="number"
              min="1"
              max="30"
              value={breakDuration}
              onChange={(e) => setBreakDuration(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="longBreakDuration">
              Long Break Duration (minutes)
            </label>
            <Input
              id="longBreakDuration"
              type="number"
              min="1"
              max="60"
              value={longBreakDuration}
              onChange={(e) => setLongBreakDuration(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium"
              htmlFor="sessionsBeforeLongBreak"
            >
              Sessions Before Long Break
            </label>
            <Input
              id="sessionsBeforeLongBreak"
              type="number"
              min="1"
              max="10"
              value={sessionsBeforeLongBreak}
              onChange={(e) => setSessionsBeforeLongBreak(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
