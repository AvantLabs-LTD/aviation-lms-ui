import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, FileText, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useGetLessonById, useUpdateLesson } from "@/hooks/useLesson";

interface ContentViewerProps {
  selectedLesson?: string;
  isAdmin?: boolean;
}

export const ContentViewer = ({
  selectedLesson = "1",
  isAdmin = false,
}: ContentViewerProps) => {
  const { data: lesson } = useGetLessonById(selectedLesson);
  const [isEditing, setIsEditing] = useState(false);
  const [editVideoUrl, setEditVideoUrl] = useState(lesson?.videoUrl);
  const [editPptUrl, setEditPptUrl] = useState(lesson?.pptUrl);
  const { mutateAsync: update } = useUpdateLesson();

  const handleSave = () => {
    setIsEditing(false);
    update({
      id: selectedLesson,
      videoUrl: editVideoUrl,
      pptUrl: editPptUrl,
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        {isAdmin && (
          <div className="mb-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (isEditing) handleSave();
                else {
                  setEditVideoUrl(lesson?.videoUrl);
                  setEditPptUrl(lesson?.pptUrl);
                  setIsEditing(true);
                }
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Save" : "Edit Content"}
            </Button>
          </div>
        )}

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label>Video URL</Label>
              <Input
                value={editVideoUrl}
                onChange={(e) => setEditVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
              />
            </div>
            <div>
              <Label>PPT URL</Label>
              <Input
                value={editPptUrl}
                onChange={(e) => setEditPptUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        ) : (
          <Tabs defaultValue="video" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Video
              </TabsTrigger>
              <TabsTrigger value="ppt" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                PPT
              </TabsTrigger>
            </TabsList>

            <TabsContent value="video" className="mt-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                {lesson?.videoUrl ? (
                  <iframe
                    src={lesson?.videoUrl}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No video available</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="ppt" className="mt-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                {lesson?.pptUrl ? (
                  <iframe
                    src={lesson?.pptUrl}
                    className="w-full h-full rounded-lg"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No presentation available</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
