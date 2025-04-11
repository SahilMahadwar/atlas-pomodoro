import { useToast } from "@/hooks/use-toast";
import { Task } from "@/types/timer";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "pomodoro-tasks";

interface CreateTaskData {
  title: string;
  estimatedPomodoros: number;
}

interface UpdateTaskData extends CreateTaskData {
  id: string;
}

interface StoredTask extends Omit<Task, "createdAt"> {
  createdAt: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>();
  const { toast } = useToast();

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks) as StoredTask[];
        // Convert string dates back to Date objects
        const tasksWithDates = parsedTasks.map((task) => ({
          ...task,
          createdAt: new Date(task.createdAt),
        }));
        setTasks(tasksWithDates);
      } catch (error) {
        console.error("Error parsing stored tasks:", error);
        toast({
          title: "Error",
          description: "Failed to load saved tasks",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const createTask = useCallback(
    (data: CreateTaskData) => {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: data.title,
        estimatedPomodoros: data.estimatedPomodoros,
        completedPomodoros: 0,
        status: "active",
        createdAt: new Date(),
      };

      setTasks((prev) => [...prev, newTask]);
      toast({
        title: "Task Created",
        description: "New task has been added to your list",
      });

      return newTask;
    },
    [toast]
  );

  const updateTask = useCallback(
    (data: UpdateTaskData) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === data.id) {
            return {
              ...task,
              title: data.title,
              estimatedPomodoros: data.estimatedPomodoros,
            };
          }
          return task;
        })
      );

      toast({
        title: "Task Updated",
        description: "The task has been updated successfully",
      });
    },
    [toast]
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      if (selectedTaskId === taskId) {
        setSelectedTaskId(undefined);
      }

      toast({
        title: "Task Deleted",
        description: "The task has been removed from your list",
      });
    },
    [selectedTaskId, toast]
  );

  const toggleTaskStatus = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newStatus = task.status === "active" ? "completed" : "active";
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  }, []);

  const incrementPomodoro = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (
          task.id === taskId &&
          task.completedPomodoros < task.estimatedPomodoros
        ) {
          return {
            ...task,
            completedPomodoros: task.completedPomodoros + 1,
            status:
              task.completedPomodoros + 1 === task.estimatedPomodoros
                ? "completed"
                : task.status,
          };
        }
        return task;
      })
    );
  }, []);

  const selectTask = useCallback((taskId: string) => {
    setSelectedTaskId(taskId);
  }, []);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId);

  return {
    tasks,
    selectedTask,
    selectedTaskId,
    actions: {
      createTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      incrementPomodoro,
      selectTask,
    },
  };
}
