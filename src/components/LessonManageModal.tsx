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
import { Plus, Edit, Trash2, Check, X, GripVertical } from "lucide-react";
import {
  useCreateLesson,
  useDeleteLesson,
  useGetAllLessons,
  useUpdateLesson,
  useReorderLessons,
} from "@/hooks/useLesson";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

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
  // States
  const [newLessonName, setNewLessonName] = useState("");
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [editLessonName, setEditLessonName] = useState("");

  // Hooks
  const { data: lessons = [] } = useGetAllLessons(chapterId);
  const { mutateAsync: create } = useCreateLesson();
  const { mutateAsync: update } = useUpdateLesson();
  const { mutateAsync: deleteLesson } = useDeleteLesson();
  const { mutateAsync: reorderLessons } = useReorderLessons();

  // === Handlers ===
  const handleAdd = () => {
    if (!newLessonName.trim()) return;
    create({ title: newLessonName.trim(), chapter: chapterId });
    setNewLessonName("");
  };

  const startEdit = (lesson: any) => {
    setEditingLesson(lesson);
    setEditLessonName(lesson.title);
  };

  const handleEdit = () => {
    if (!editingLesson || !editLessonName.trim()) return;
    update({
      id: editingLesson._id,
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

  // === Reorder Handler ===
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    // Create new ordered array
    const newOrder = Array.from(lessons);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);

    // Extract ordered IDs
    const orderedIds = newOrder.map((lesson: any) => lesson._id);

    // Call reorder mutation
    if (chapterId) {
      reorderLessons({
        chapterId,
        orderedIds,
      });
    }
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

          {/* Existing Lessons – Drag & Drop */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId={`lessons-${chapterId}`}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <Label>Existing Lessons</Label>
                  {lessons.map((lesson, index) => (
                    <Draggable
                      key={lesson._id}
                      draggableId={lesson._id}
                      index={index}
                    >
                      {(draggableProvided) => (
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          className="flex items-center gap-2 p-2 border rounded-lg mb-2 bg-card"
                        >
                          <div {...draggableProvided.dragHandleProps}>
                            <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                          </div>

                          {editingLesson?._id === lesson._id ? (
                            <Input
                              value={editLessonName}
                              onChange={(e) =>
                                setEditLessonName(e.target.value)
                              }
                              className="flex-1"
                              autoFocus
                            />
                          ) : (
                            <span className="flex-1 font-medium">
                              {lesson.title}
                            </span>
                          )}

                          <div className="flex gap-1">
                            {editingLesson?._id === lesson._id ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleEdit}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={cancelEdit}
                                >
                                  <X className="w-4 h-4" />
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
                                  onClick={() => handleDelete(lesson._id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </DialogContent>
    </Dialog>
  );
};
