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
import { Plus, Edit, Trash2, Check, X } from "lucide-react";
import {
  useCreateSubject,
  useDeleteSubject,
  useGetAllSubjects,
  useUpdateSubject,
} from "@/hooks/useSubject";
import {
  useCreateChapter,
  useDeleteChapter,
  useUpdateChapter,
} from "@/hooks/useChapter";

interface Chapter {
  _id: string;
  title: string;
}

interface Subject {
  _id: string;
  title: string;
  chapters: Chapter[];
}

interface SubjectManageModalProps {
  open: boolean;
  onClose: () => void;
  selectedCourse: string; // assuming it's the course ID
}

export const SubjectManageModal = ({
  open,
  onClose,
  selectedCourse,
}: SubjectManageModalProps) => {
  // Independent states
  const [newSubjectName, setNewSubjectName] = useState("");
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingSubjectName, setEditingSubjectName] = useState("");

  // For chapters: one add input per subject + editing one chapter at a time
  const [chapterInputs, setChapterInputs] = useState<Record<string, string>>(
    {}
  ); // subjectId -> new chapter name
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editingChapterName, setEditingChapterName] = useState("");

  const { data: subjects } = useGetAllSubjects();

  // Subject mutations
  const { mutateAsync: createSubject } = useCreateSubject();
  const { mutateAsync: updateSubject } = useUpdateSubject();
  const { mutateAsync: deleteSubject } = useDeleteSubject();

  // Chapter mutations
  const { mutateAsync: createChapter } = useCreateChapter();
  const { mutateAsync: updateChapter } = useUpdateChapter();
  const { mutateAsync: deleteChapter } = useDeleteChapter();

  // === Subject Handlers ===
  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    createSubject({ title: newSubjectName.trim(), course: selectedCourse });
    setNewSubjectName("");
  };

  const startEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setEditingSubjectName(subject.title);
  };

  const saveEditSubject = () => {
    if (!editingSubject || !editingSubjectName.trim()) return;
    updateSubject({ id: editingSubject._id, title: editingSubjectName.trim() });
    setEditingSubject(null);
    setEditingSubjectName("");
  };

  const cancelEditSubject = () => {
    setEditingSubject(null);
    setEditingSubjectName("");
  };

  // === Chapter Handlers ===
  const handleAddChapter = (subjectId: string) => {
    const name = chapterInputs[subjectId]?.trim();
    if (!name) return;
    createChapter({ title: name, subject: subjectId });
    setChapterInputs((prev) => ({ ...prev, [subjectId]: "" }));
  };

  const startEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setEditingChapterName(chapter.title);
  };

  const saveEditChapter = () => {
    if (!editingChapter || !editingChapterName.trim()) return;
    updateChapter({ id: editingChapter._id, title: editingChapterName.trim() });
    setEditingChapter(null);
    setEditingChapterName("");
  };

  const cancelEditChapter = () => {
    setEditingChapter(null);
    setEditingChapterName("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Subjects & Chapters</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Subject */}
          <div className="space-y-3">
            <Label>Add New Subject</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Subject name"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
              />
              <Button
                onClick={handleAddSubject}
                disabled={!newSubjectName.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Subjects List */}
          <div className="space-y-4">
            {subjects?.map((subject) => (
              <div
                key={subject._id}
                className="border rounded-lg p-4 space-y-3"
              >
                {/* Subject Row */}
                <div className="flex items-center gap-3">
                  {editingSubject?._id === subject._id ? (
                    <Input
                      value={editingSubjectName}
                      onChange={(e) => setEditingSubjectName(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                  ) : (
                    <span className="flex-1 font-semibold">
                      {subject.title}
                    </span>
                  )}

                  <div className="flex gap-1">
                    {editingSubject?._id === subject._id ? (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={saveEditSubject}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={cancelEditSubject}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditSubject(subject)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteSubject(subject._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Chapters Section */}
                <div className="ml-6 space-y-2">
                  {/* Add Chapter Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="New chapter name"
                      value={chapterInputs[subject._id] || ""}
                      onChange={(e) =>
                        setChapterInputs((prev) => ({
                          ...prev,
                          [subject._id]: e.target.value,
                        }))
                      }
                      className="text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddChapter(subject._id)}
                      disabled={!chapterInputs[subject._id]?.trim()}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Chapters List */}
                  {subject.chapters?.map((chapter) => (
                    <div
                      key={chapter._id}
                      className="flex items-center gap-2 p-2 bg-muted rounded"
                    >
                      {editingChapter?._id === chapter._id ? (
                        <Input
                          value={editingChapterName}
                          onChange={(e) =>
                            setEditingChapterName(e.target.value)
                          }
                          className="flex-1 text-sm"
                          autoFocus
                        />
                      ) : (
                        <span className="flex-1 text-sm">{chapter.title}</span>
                      )}

                      <div className="flex gap-1">
                        {editingChapter?._id === chapter._id ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={saveEditChapter}
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={cancelEditChapter}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditChapter(chapter)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteChapter(chapter._id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
