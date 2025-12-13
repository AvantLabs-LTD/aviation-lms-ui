import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Check } from "lucide-react";
import {
  useCreateLesson,
  useDeleteLesson,
  useGetAllLessons,
  useUpdateLesson,
} from "@/hooks/useLesson";

interface LessonManageModalProps {
  open: boolean;
  onClose: () => void;
  chapterId?: string;
}

export const LessonManageModal = ({
  open,
  onClose,
  chapterId,
}: LessonManageModalProps) => {
  // Separate state for adding new lesson
  const [newLessonName, setNewLessonName] = useState("");

  // State for editing: stores the lesson being edited (or null)
  const [editingLesson, setEditingLesson] = useState<any>(null);
  // Separate state for the edit input value
  const [editLessonName, setEditLessonName] = useState("");

  const { data: lessons } = useGetAllLessons(chapterId);

  const { mutateAsync: create } = useCreateLesson();
  const { mutateAsync: update } = useUpdateLesson();
  const { mutateAsync: deleteLesson } = useDeleteLesson();

  const handleAdd = () => {
    if (!newLessonName.trim()) return;
    create({ title: newLessonName.trim(), chapter: chapterId });
    setNewLessonName(""); // clear input
  };

  const startEdit = (lesson: any) => {
    setEditingLesson(lesson);
    setEditLessonName(lesson.title);
  };

  const handleEdit = () => {
    if (!editingLesson || !editLessonName.trim()) return;
    update({
      id: editingLesson._id || editingLesson.id,
      title: editLessonName.trim(),
    });
    setEditingLesson(null);
    setEditLessonName("");
  };

  const cancelEdit = () => {
    setEditingLesson(null);
    setEditLessonName("");
  };

  const handleDelete = (id: string) => {
    deleteLesson(id);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Lessons</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Lesson */}
          <div className="space-y-3">
            <Label>Add New Lesson</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Lesson name"
                value={newLessonName}
                onChange={(e) => setNewLessonName(e.target.value)}
              />
              <Button onClick={handleAdd} disabled={!newLessonName.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Existing Lessons */}
          <div className="space-y-2">
            <Label>Existing Lessons</Label>
            {lessons?.map((lesson) => (
              <div
                key={lesson._id || lesson.id}
                className="flex items-center gap-2 p-2 border rounded-lg"
              >
                {editingLesson?._id === lesson._id ? (
                  <Input
                    value={editLessonName || lesson.title}
                    onChange={(e) => setEditLessonName(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                ) : (
                  <span className="flex-1 font-medium">{lesson.title}</span>
                )}

                <div className="flex gap-1">
                  {editingLesson?._id === lesson._id ? (
                    <>
                      <Button size="sm" variant="ghost" onClick={handleEdit}>
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEdit(lesson)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(lesson._id || lesson.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
