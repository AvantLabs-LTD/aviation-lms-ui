import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Chapter {
  id: string;
  name: string;
  videoUrl?: string;
  pptUrl?: string;
  resourceUrl?: string;
  questions?: any[];
}

interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}

interface SubjectManageModalProps {
  open: boolean;
  onClose: () => void;
  subjects: Subject[];
  onUpdate: (type: string, data: any) => void;
}

export const SubjectManageModal = ({ open, onClose, subjects, onUpdate }: SubjectManageModalProps) => {
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [editingChapter, setEditingChapter] = useState<any>(null);
  const [subjectForm, setSubjectForm] = useState<any>({});
  const [chapterForm, setChapterForm] = useState<any>({});
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");

  const handleAddSubject = () => {
    const newSubject = { id: Date.now().toString(), name: subjectForm.name || "New Subject", chapters: [] };
    onUpdate("subject", [...subjects, newSubject]);
    toast({ title: "Subject Added" });
    setSubjectForm({});
  };

  const handleEditSubject = (subject: Subject) => {
    const updatedList = subjects.map((s) => (s.id === subject.id ? { ...s, name: subjectForm.name } : s));
    onUpdate("subject", updatedList);
    toast({ title: "Subject Updated" });
    setEditingSubject(null);
    setSubjectForm({});
  };

  const handleDeleteSubject = (id: string) => {
    onUpdate("subject", subjects.filter((s) => s.id !== id));
    toast({ title: "Subject Deleted" });
  };

  const handleAddChapter = () => {
    const newChapter = { 
      id: `${selectedSubjectId}-${Date.now()}`, 
      name: chapterForm.name || "New Chapter",
      videoUrl: "",
      pptUrl: "",
      resourceUrl: "",
      questions: []
    };
    const updatedSubjects = subjects.map((s) =>
      s.id === selectedSubjectId ? { ...s, chapters: [...s.chapters, newChapter] } : s
    );
    onUpdate("subject", updatedSubjects);
    toast({ title: "Chapter Added" });
    setChapterForm({});
  };

  const handleEditChapter = (subjectId: string, chapter: Chapter) => {
    const updatedSubjects = subjects.map((s) =>
      s.id === subjectId
        ? { ...s, chapters: s.chapters.map((c) => (c.id === chapter.id ? { ...c, name: chapterForm.name } : c)) }
        : s
    );
    onUpdate("subject", updatedSubjects);
    toast({ title: "Chapter Updated" });
    setEditingChapter(null);
    setChapterForm({});
  };

  const handleDeleteChapter = (subjectId: string, chapterId: string) => {
    const updatedSubjects = subjects.map((s) =>
      s.id === subjectId ? { ...s, chapters: s.chapters.filter((c) => c.id !== chapterId) } : s
    );
    onUpdate("subject", updatedSubjects);
    toast({ title: "Chapter Deleted" });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Subjects & Chapters</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Add New Subject</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Subject name"
                value={subjectForm.name || ""}
                onChange={(e) => setSubjectForm({ name: e.target.value })}
              />
              <Button onClick={handleAddSubject}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {subjects.map((subject) => (
              <div key={subject.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  {editingSubject?.id === subject.id ? (
                    <Input
                      value={subjectForm.name || subject.name}
                      onChange={(e) => setSubjectForm({ name: e.target.value })}
                      className="flex-1"
                    />
                  ) : (
                    <span className="flex-1 font-semibold">{subject.name}</span>
                  )}
                  <div className="flex gap-1">
                    {editingSubject?.id === subject.id ? (
                      <Button size="sm" variant="ghost" onClick={() => handleEditSubject(subject)}>
                        <Check className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingSubject(subject);
                          setSubjectForm({ name: subject.name });
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteSubject(subject.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="ml-4 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="New chapter name"
                      value={selectedSubjectId === subject.id ? chapterForm.name || "" : ""}
                      onChange={(e) => {
                        setSelectedSubjectId(subject.id);
                        setChapterForm({ name: e.target.value });
                      }}
                      className="text-sm"
                    />
                    <Button size="sm" onClick={handleAddChapter} disabled={selectedSubjectId !== subject.id}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  {subject.chapters.map((chapter) => (
                    <div key={chapter.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                      {editingChapter?.id === chapter.id ? (
                        <Input
                          value={chapterForm.name || chapter.name}
                          onChange={(e) => setChapterForm({ name: e.target.value })}
                          className="flex-1 text-sm"
                        />
                      ) : (
                        <span className="flex-1 text-sm">{chapter.name}</span>
                      )}
                      <div className="flex gap-1">
                        {editingChapter?.id === chapter.id ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditChapter(subject.id, chapter)}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingChapter(chapter);
                              setChapterForm({ name: chapter.name });
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteChapter(subject.id, chapter.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
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
