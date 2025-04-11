import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Task } from "@/types/timer";
import { CheckCircle, Circle, Edit2, MoreVertical, Trash2 } from "lucide-react";
import React from "react";

interface TaskListProps {
  tasks: Task[];
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
  onSelectTask: (taskId: string) => void;
  selectedTaskId?: string;
  className?: string;
}

export function TaskList({
  tasks,
  onEditTask,
  onDeleteTask,
  onToggleTask,
  onSelectTask,
  selectedTaskId,
  className,
}: TaskListProps) {
  const getTaskProgress = (task: Task) => {
    return (task.completedPomodoros / task.estimatedPomodoros) * 100;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-lg border ${
                selectedTaskId === task.id
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex items-start space-x-3 cursor-pointer"
                  onClick={() => onSelectTask(task.id)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTask(task.id);
                    }}
                    className="mt-1"
                  >
                    {task.status === "completed" ? (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  <div className="space-y-1">
                    <h4
                      className={`font-medium ${
                        task.status === "completed"
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {task.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Progress
                        value={getTaskProgress(task)}
                        className="w-24 h-2"
                      />
                      <span className="text-xs text-muted-foreground">
                        {task.completedPomodoros}/{task.estimatedPomodoros}{" "}
                        pomodoros
                      </span>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditTask(task.id)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDeleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No tasks yet. Create one to get started!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
