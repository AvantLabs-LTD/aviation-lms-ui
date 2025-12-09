import { ChevronDown, ChevronRight, Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SubjectManageModal } from "@/components/SubjectManageModal";

interface Chapter {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}

interface SubjectNavProps {
  subjects: Subject[];
  selectedChapter: string | null;
  onChapterSelect: (chapterId: string, subjectId: string) => void;
  isAdmin?: boolean;
  onSubjectsUpdate?: (type: string, data: any) => void;
}

export const SubjectNav = ({ 
  subjects, 
  selectedChapter, 
  onChapterSelect, 
  isAdmin = false,
  onSubjectsUpdate = () => {},
}: SubjectNavProps) => {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(subjects[0]?.id);
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);

  const toggleSubject = (subjectId: string) => {
    setExpandedSubject(prev => prev === subjectId ? null : subjectId);
  };

  return (
    <>
    <div className="border-r bg-card h-[calc(100vh-73px)] overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Subjects</h2>
          {isAdmin && (
            <Button variant="ghost" size="icon" onClick={() => setSubjectModalOpen(true)}>
              <Settings className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="space-y-1">
          {subjects.map((subject) => (
            <div key={subject.id}>
              <button
                onClick={() => toggleSubject(subject.id)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors text-left"
              >
                {expandedSubject === subject.id ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="font-medium text-foreground">{subject.name}</span>
              </button>
              
              {expandedSubject === subject.id && (
                <div className="ml-6 mt-1 space-y-1">
                  {subject.chapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => onChapterSelect(chapter.id, subject.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        selectedChapter === chapter.id
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      {chapter.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>

    <SubjectManageModal
      open={subjectModalOpen}
      onClose={() => setSubjectModalOpen(false)}
      subjects={subjects}
      onUpdate={onSubjectsUpdate}
    />
    </>
  );
};
