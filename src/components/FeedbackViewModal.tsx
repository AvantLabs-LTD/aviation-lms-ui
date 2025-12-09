import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Feedback {
  id: string;
  username: string;
  text: string;
  done?: boolean;
}

interface FeedbackViewModalProps {
  open: boolean;
  onClose: () => void;
  feedbacks: Feedback[];
  onUpdate: (type: string, data: any) => void;
}

export const FeedbackViewModal = ({ open, onClose, feedbacks, onUpdate }: FeedbackViewModalProps) => {
  const handleMarkDone = (id: string) => {
    const updatedFeedbacks = feedbacks.map((f) => (f.id === id ? { ...f, done: true } : f));
    onUpdate("feedbacks", updatedFeedbacks);
    toast({ title: "Marked as Done" });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Feedbacks</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {feedbacks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No feedbacks yet</p>
          ) : (
            feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className={`p-4 border rounded-lg ${feedback.done ? "bg-muted opacity-60" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{feedback.username}</p>
                    <p className="text-sm text-muted-foreground mt-1">{feedback.text}</p>
                  </div>
                  {!feedback.done && (
                    <Button size="sm" variant="outline" onClick={() => handleMarkDone(feedback.id)}>
                      <Check className="w-4 h-4 mr-1" />
                      Done
                    </Button>
                  )}
                </div>
                {feedback.done && <span className="text-xs text-muted-foreground mt-2 block">✓ Completed</span>}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
