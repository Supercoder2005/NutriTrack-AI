'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalyzeMealForm from './AnalyzeMealForm';
import ManualLogForm from './ManualLogForm';

interface LogMealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogAdded: () => void;
}

export default function LogMealDialog({ open, onOpenChange, onLogAdded }: LogMealDialogProps) {
  const handleSuccess = () => {
    onLogAdded();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Log a Meal</DialogTitle>
          <DialogDescription>
            Add a meal to your daily log. Use AI analysis for a quick estimate or enter details manually.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="ai-log" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai-log">AI Analysis</TabsTrigger>
            <TabsTrigger value="manual-log">Manual Entry</TabsTrigger>
          </TabsList>
          <TabsContent value="ai-log">
            <AnalyzeMealForm onSuccess={handleSuccess} />
          </TabsContent>
          <TabsContent value="manual-log">
            <ManualLogForm onSuccess={handleSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
