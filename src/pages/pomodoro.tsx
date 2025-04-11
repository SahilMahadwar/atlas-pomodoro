import { FocusStats } from "@/components/focus-flow/focus-stats";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { TaskList } from "@/components/tasks/task-list";
import { TimerDisplay } from "@/components/timer/timer-display";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/use-tasks";
import { useTimer } from "@/hooks/use-timer";
import { useToast } from "@/hooks/use-toast";
import { soundService } from "@/services/sound";
import { Task } from "@/types/timer";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

interface TaskFormData {
  title: string;
  estimatedPomodoros: number;
}

export default function PomodoroApp() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [showStats, setShowStats] = useState(false);
  const { toast } = useToast();

  const {
    tasks,
    selectedTask,
    selectedTaskId,
    actions: taskActions,
  } = useTasks();

  const { state: timerState } = useTimer();

  // Request permissions on component mount
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        await soundService.requestPermissions();
      } catch (error) {
        toast({
          title: "Notification Access",
          description: "Please enable notifications for the best experience",
          variant: "default",
        });
      }
    };

    requestPermissions();
  }, [toast]);

  // Increment completed pomodoros when work session is completed
  useEffect(() => {
    if (selectedTaskId && timerState.mode !== "work" && !timerState.isActive) {
      taskActions.incrementPomodoro(selectedTaskId);
    }
  }, [timerState.mode, timerState.isActive, selectedTaskId, taskActions]);

  const handleCreateTask = (data: TaskFormData) => {
    taskActions.createTask(data);
    setIsFormOpen(false);
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setIsFormOpen(true);
    }
  };

  const handleUpdateTask = (data: TaskFormData) => {
    if (editingTask) {
      taskActions.updateTask({
        id: editingTask.id,
        ...data,
      });
      setEditingTask(undefined);
      setIsFormOpen(false);
    }
  };

  const handleFormSubmit = (data: TaskFormData) => {
    if (editingTask) {
      handleUpdateTask(data);
    } else {
      handleCreateTask(data);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Timer and Stats Section */}
          <div className="space-y-8">
            <TimerDisplay className="max-w-lg mx-auto" />

            {selectedTask && (
              <div className="max-w-lg mx-auto bg-card p-4 rounded-lg border shadow-sm animate-fade-in">
                <h3 className="text-lg font-semibold mb-2">Current Task</h3>
                <p className="text-muted-foreground">{selectedTask.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Progress: {selectedTask.completedPomodoros}/
                  {selectedTask.estimatedPomodoros} pomodoros
                </p>
              </div>
            )}

            {/* Collapsible Stats Section */}
            <div className="max-w-lg mx-auto">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between mb-2 hover:bg-accent"
                onClick={() => setShowStats(!showStats)}
              >
                <span>Focus Flow Statistics</span>
                {showStats ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  showStats ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <FocusStats />
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
              <Button onClick={() => setIsFormOpen(true)} className="shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>

            <TaskList
              tasks={tasks}
              selectedTaskId={selectedTaskId}
              onEditTask={handleEditTask}
              onDeleteTask={taskActions.deleteTask}
              onToggleTask={taskActions.toggleTaskStatus}
              onSelectTask={taskActions.selectTask}
              className="animate-fade-in"
            />
          </div>
        </div>
      </div>

      <TaskFormDialog
        open={isFormOpen}
        onOpenChange={handleFormClose}
        onSubmit={handleFormSubmit}
        task={editingTask}
      />
    </div>
  );
}
