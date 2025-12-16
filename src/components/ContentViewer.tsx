import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, FileText, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { useGetLessonById, useUpdateLesson } from "@/hooks/useLesson";
import videojs from "video.js";
import "video.js/dist/video-js.css";
//import "@videojs/http-streaming"; // For HLS

interface ContentViewerProps {
  selectedLesson?: string;
  isAdmin?: boolean;
}

export const ContentViewer = ({
  selectedLesson = "1",
  isAdmin = false,
}: ContentViewerProps) => {
  const { data: lesson, isPending } = useGetLessonById(selectedLesson);
  const [isEditing, setIsEditing] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [pptFile, setPptFile] = useState<File | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const pptInputRef = useRef<HTMLInputElement>(null);
  const [editVideoUrl, setEditVideoUrl] = useState(lesson?.videoUrl);
  const [editPptUrl, setEditPptUrl] = useState(lesson?.pptUrl);
  const updateLesson = useUpdateLesson();
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const handleEditToggle = () => {
    if (isEditing) {
      // Save
      const formData = new FormData();

      if (videoFile) {
        formData.append("video", videoFile);
      }
      if (pptFile) {
        formData.append("ppt", pptFile);
      }

      // Optionally append other fields like title, description if you have them
      // formData.append("title", "New Title");

      if (videoFile || pptFile) {
        updateLesson.mutate({ id: selectedLesson, formData });
        setIsEditing(false);
        setVideoFile(null);
        setPptFile(null);
      } else {
        setIsEditing(false); // nothing to upload
      }
    } else {
      setIsEditing(true);
      setVideoFile(null);
      setPptFile(null);
    }
  };

  // useEffect(() => {
  //   if (videoRef.current && lesson?.videoUrl) {
  //     // playerRef.current = videojs(videoRef.current, {
  //     //   autoplay: false,
  //     //   controls: true,
  //     //   sources: [{ src: lesson.videoUrl, type: "application/x-mpegURL" }], // HLS type
  //     // });
  //   }
  //   return () => {
  //     if (playerRef.current) playerRef.current.dispose();
  //   };
  // }, [lesson?.videoUrl]);

  const handleSave = () => {
    setIsEditing(false);
    updateLesson.mutate({
      id: selectedLesson,
      videoUrl: editVideoUrl,
      pptUrl: editPptUrl,
    });
  };

  // For private S3, fetch signed URLs via API (add endpoint if needed)
  const pptEmbedUrl = lesson?.pptUrl
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
        lesson.pptUrl
      )}`
    : "";

  if (isPending) return <div>Loading...</div>;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        {isAdmin && (
          <div className="mb-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditToggle}
              disabled={updateLesson.isPending}
            >
              <Edit className="w-4 h-4 mr-2" />
              {updateLesson.isPending
                ? "Uploading..."
                : isEditing
                ? "Save Changes"
                : "Edit Content"}
            </Button>
          </div>
        )}

        {isEditing ? (
          <div className="space-y-6">
            <div>
              <Label htmlFor="video-upload">Upload New Video (MP4)</Label>
              <input
                id="video-upload"
                type="file"
                accept="video/mp4"
                ref={videoInputRef}
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {videoFile && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: {videoFile.name} (
                  {(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              {lesson?.videoUrl && !videoFile && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Current video will be kept
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="ppt-upload">Upload New Presentation (PPTX)</Label>
              <input
                id="ppt-upload"
                type="file"
                accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                ref={pptInputRef}
                onChange={(e) => setPptFile(e.target.files?.[0] || null)}
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {pptFile && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: {pptFile.name} (
                  {(pptFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              {lesson?.pptUrl && !pptFile && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Current presentation will be kept
                </p>
              )}
            </div>

            {updateLesson.isError && (
              <p className="text-red-600">
                Upload failed: {updateLesson.error?.message}
              </p>
            )}
          </div>
        ) : (
          // Existing Tabs with Video.js and PPT iframe viewer (unchanged)
          <Tabs defaultValue="video" className="w-full">
            {/* ... your existing tabs content ... */}
            <TabsContent value="video" className="mt-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                {lesson?.videoUrl ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full"
                    playsInline
                    autoPlay
                    controls
                    loop
                  >
                    <source src={lesson?.videoUrl} type="video/mp4" />
                  </video>

                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No video available</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="ppt" className="mt-4">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                {lesson?.pptUrl ? (
                  <iframe
                    src={pptEmbedUrl}
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
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
