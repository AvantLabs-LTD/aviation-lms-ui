import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Download,
  Send,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Edit,
  Check,
  X,
  Settings,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { FeedbackViewModal } from "@/components/FeedbackViewModal";
import {
  useGetAllLessons,
  useGetLessonById,
  useUpdateLesson,
} from "@/hooks/useLesson";
import { LessonManageModal } from "./LessonManageModal";
import { useGetChapterById } from "@/hooks/useChapter";
import { useCreateFeedback, useGetAllFeedbacks } from "@/hooks/useFeedback";
import { useGetLoggedInUser } from "@/hooks/useAuth";

interface Lesson {
  id: string;
  name: string;
}

interface RightPanelProps {
  selectedLesson: string | null;
  onLessonSelect: (lessonId: string) => void;
  resourceUrl: string;
  isAdmin?: boolean;
  currentUser?: string;
  onResourceUpdate?: (url: string) => void;
  selectedChapter?: string;
}

export const RightPanel = ({
  selectedLesson,
  onLessonSelect,
  isAdmin = false,
  currentUser = "",
  selectedChapter = "",
}: RightPanelProps) => {
  const { data: lessons } = useGetAllLessons(selectedChapter);
  const { data: selectedChapterData } = useGetChapterById(selectedChapter);
  const { data: selectedLessonData } = useGetLessonById(selectedLesson);
  const { data: feedbacks } = useGetAllFeedbacks(selectedLesson);
  const { mutateAsync: createFeedback } = useCreateFeedback();
  const [feedback, setFeedback] = useState("");
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isEditingResource, setIsEditingResource] = useState(false);
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [editResourceUrl, setEditResourceUrl] = useState(
    selectedLessonData?.resourceUrl || ""
  );
  const { data: loggedInUser } = useGetLoggedInUser();
  const { mutateAsync: updateLesson } = useUpdateLesson();
  const [lessonModalOpen, setLessonModalOpen] = useState(false);

  const currentIndex = lessons?.findIndex((l) => l._id === selectedLesson);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < lessons?.length - 1;

  const handlePrevious = () => {
    if (canGoPrev) {
      onLessonSelect(lessons[currentIndex - 1]._id);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onLessonSelect(lessons[currentIndex + 1]._id);
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

    createFeedback({
      text: feedback,
      lesson: selectedLesson || "",
    });

    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback!",
    });

    setFeedback("");
  };

  const handleSaveResource = () => {
    const formDataResource = new FormData();
    formDataResource.append("resource", resourceFile);
    updateLesson({
      id: selectedLesson,
      formData: formDataResource,
    });
    setResourceFile(null);
    setIsEditingResource(false);
  };

  useEffect(() => {
    if (
      lessons &&
      lessons.length > 0 &&
      !lessons.find((s) => s._id === selectedLesson)
    ) {
      onLessonSelect(lessons[0]._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessons, selectedChapter]);
  return (
    <div className="space-y-4 p-4 border-l bg-card h-[calc(100vh-73px)] overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex justify-between">
            {selectedChapterData?.title || "Lesson Navigation"}
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLessonModalOpen(true)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Lesson Navigation
            </p>
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
              {lessons?.map((lesson) => (
                <button
                  key={lesson._id}
                  onClick={() => onLessonSelect(lesson._id)}
                  className={`w-full flex justify-between items-center text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedLesson === lesson._id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {lesson.title}
                  {loggedInUser?.progress.includes(selectedLesson) && (
                    <CheckCircle
                      className={`w-4 h-4 ${
                        selectedLesson === lesson._id
                          ? "text-primary-foreground"
                          : "text-green-500"
                      }`}
                    />
                  )}
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
                    setEditResourceUrl(selectedLessonData?.resourceUrl);
                    setIsEditingResource(true);
                  }
                }}
              >
                {isEditingResource ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Edit className="w-4 h-4" />
                )}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditingResource ? (
            <div className="space-y-2">
              <div>
                <Label htmlFor="file-upload">Upload New File</Label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={(e) => setResourceFile(e.target.files?.[0] || null)}
                  className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {resourceFile && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {resourceFile.name} (
                    {(resourceFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                {selectedLessonData?.resourceUrl && !resourceFile && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Current file will be kept if no new file is selected
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditingResource(false);
                  setResourceFile(null);
                }}
                className="w-full"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                if (selectedLessonData?.resourceUrl) {
                  console.log(selectedLessonData.resourceUrl);
                  window.open(selectedLessonData?.resourceUrl, "_blank");
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (!feedbacks?.length) {
                    toast({
                      title: "No Feedbacks",
                      description: "There are no feedbacks to view.",
                    });
                    return;
                  }
                  setFeedbackModalOpen(true);
                }}
              >
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

      {feedbacks?.length ? (
        <FeedbackViewModal
          open={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          feedbacks={feedbacks}
        />
      ) : (
        <></>
      )}

      <LessonManageModal
        chapterId={selectedChapter}
        onClose={() => setLessonModalOpen(false)}
        open={lessonModalOpen}
      />
    </div>
  );
};
