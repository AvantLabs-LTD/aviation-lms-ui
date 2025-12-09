import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Send, ChevronLeft, ChevronRight, MessageSquare, Edit, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { FeedbackViewModal } from "@/components/FeedbackViewModal";

interface Lesson {
  id: string;
  name: string;
}

interface RightPanelProps {
  subjectName: string;
  lessons: Lesson[];
  selectedLesson: string | null;
  onLessonSelect: (lessonId: string) => void;
  resourceUrl: string;
  isAdmin?: boolean;
  currentUser?: string;
  feedbacks?: any[];
  onFeedbacksUpdate?: (type: string, data: any) => void;
  onResourceUpdate?: (url: string) => void;
}

export const RightPanel = ({
  subjectName,
  lessons,
  selectedLesson,
  onLessonSelect,
  resourceUrl,
  isAdmin = false,
  currentUser = "",
  feedbacks = [],
  onFeedbacksUpdate = () => {},
  onResourceUpdate = () => {},
}: RightPanelProps) => {
  const [feedback, setFeedback] = useState("");
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isEditingResource, setIsEditingResource] = useState(false);
  const [editResourceUrl, setEditResourceUrl] = useState(resourceUrl);
  
  const currentIndex = lessons.findIndex(l => l.id === selectedLesson);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < lessons.length - 1;

  const handlePrevious = () => {
    if (canGoPrev) {
      onLessonSelect(lessons[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onLessonSelect(lessons[currentIndex + 1].id);
    }
  };

  const handleFeedbackSubmit = () => {
    if (!feedback.trim()) {
      toast({
        title: "Empty Feedback",
        description: "Please write some feedback before submitting.",
        variant: "destructive",
      });
      return;
    }

    const newFeedback = {
      id: Date.now().toString(),
      username: currentUser,
      text: feedback,
      done: false,
    };
    
    onFeedbacksUpdate("feedbacks", [...feedbacks, newFeedback]);
    
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback!",
    });
    
    setFeedback("");
  };

  const handleSaveResource = () => {
    onResourceUpdate(editResourceUrl);
    setIsEditingResource(false);
    toast({ title: "Resource Updated" });
  };

  return (
    <div className="space-y-4 p-4 border-l bg-card h-[calc(100vh-73px)] overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{subjectName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground mb-3">Lesson Navigation</p>
            <div className="flex items-center gap-2 mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={!canGoPrev}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={!canGoNext}
                className="flex-1"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => onLessonSelect(lesson.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedLesson === lesson.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {lesson.name}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Resources
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (isEditingResource) handleSaveResource();
                  else {
                    setEditResourceUrl(resourceUrl);
                    setIsEditingResource(true);
                  }
                }}
              >
                {isEditingResource ? <Check className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditingResource ? (
            <div className="space-y-2">
              <Label>Resource URL</Label>
              <Input
                value={editResourceUrl}
                onChange={(e) => setEditResourceUrl(e.target.value)}
                placeholder="https://..."
              />
              <Button variant="outline" size="sm" onClick={() => setIsEditingResource(false)} className="w-full">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                if (resourceUrl) {
                  window.open(resourceUrl, "_blank");
                  toast({
                    title: "Download Started",
                    description: "Your resource is being downloaded.",
                  });
                } else {
                  toast({
                    title: "No Resource",
                    description: "No resource available for this lesson.",
                    variant: "destructive",
                  });
                }
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Materials
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Feedback
            {isAdmin && (
              <Button variant="ghost" size="sm" onClick={() => setFeedbackModalOpen(true)}>
                <MessageSquare className="w-4 h-4 mr-1" />
                View All
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isAdmin && (
            <div className="space-y-3">
              <Textarea
                placeholder="Share your thoughts..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
              <Button onClick={handleFeedbackSubmit} className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Feedback
              </Button>
            </div>
          )}
          {isAdmin && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Click "View All" to manage feedbacks
            </p>
          )}
        </CardContent>
      </Card>

      <FeedbackViewModal
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        feedbacks={feedbacks}
        onUpdate={onFeedbacksUpdate}
      />
    </div>
  );
};
