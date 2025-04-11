import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Task } from "@/types/timer";
import React, { useEffect, useState } from "react";

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: { title: string; estimatedPomodoros: number }) => void;
  task?: Task;
}

export function TaskFormDialog({
  open,
  onOpenChange,
  onSubmit,
  task,
}: TaskFormDialogProps) {
  const [title, setTitle] = useState("");
  const [estimatedPomodoros, setEstimatedPomodoros] = useState("1");
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setEstimatedPomodoros(task.estimatedPomodoros.toString());
    } else {
      setTitle("");
      setEstimatedPomodoros("1");
    }
    setError("");
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    const pomodoros = parseInt(estimatedPomodoros);
    if (isNaN(pomodoros) || pomodoros < 1 || pomodoros > 20) {
      setError("Pomodoros must be between 1 and 20");
      return;
    }

    onSubmit({
      title: title.trim(),
      estimatedPomodoros: pomodoros,
    });

    setTitle("");
    setEstimatedPomodoros("1");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Task Title
            </label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="estimatedPomodoros"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Estimated Pomodoros
            </label>
            <Input
              id="estimatedPomodoros"
              type="number"
              min={1}
              max={20}
              placeholder="Number of pomodoros"
              value={estimatedPomodoros}
              onChange={(e) => setEstimatedPomodoros(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-sm font-medium text-destructive">{error}</div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{task ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
