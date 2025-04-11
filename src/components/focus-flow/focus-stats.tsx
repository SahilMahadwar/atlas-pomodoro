import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useFocusFlow } from "@/hooks/use-focus-flow";
import { BrainCircuit, Target, Timer, Zap } from "lucide-react";
import React from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <div className="flex items-end gap-2">
        <div className="text-2xl font-bold">{value}%</div>
        <div className="text-xs text-muted-foreground mb-1">{description}</div>
      </div>
      <Progress value={value} className="h-1" />
    </div>
  );
}

export function FocusStats() {
  const { stats, flowScore } = useFocusFlow();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Focus Flow Score
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <StatCard
          title="Session Completion"
          value={flowScore.sessionCompletion}
          icon={<Timer className="h-4 w-4 text-blue-500" />}
          description={`${stats.completedSessions} sessions completed`}
        />

        <StatCard
          title="Break Adherence"
          value={flowScore.breakAdherence}
          icon={<BrainCircuit className="h-4 w-4 text-green-500" />}
          description={`${stats.interruptions} interruptions recorded`}
        />

        <StatCard
          title="Task Accuracy"
          value={flowScore.taskAccuracy}
          icon={<Target className="h-4 w-4 text-red-500" />}
          description="Time estimation accuracy"
        />

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold">Overall Flow Score</h3>
            </div>
            <div className="text-2xl font-bold">{flowScore.overallScore}%</div>
          </div>
          <Progress value={flowScore.overallScore} className="h-2 mt-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Based on session completion, break adherence, and task accuracy
          </p>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Total Focus Time: {Math.round(stats.totalFocusTime)} minutes</p>
          <p>Estimated Time: {Math.round(stats.estimatedTime)} minutes</p>
        </div>
      </CardContent>
    </Card>
  );
}
