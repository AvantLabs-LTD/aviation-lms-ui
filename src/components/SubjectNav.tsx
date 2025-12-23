import { ChevronDown, ChevronRight, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SubjectManageModal } from "@/components/SubjectManageModal";
import { useGetAllSubjects } from "@/hooks/useSubject";

export const SubjectNav = ({
  selectedChapter,
  onChapterSelect,
  isAdmin = false,
  selectedCourse,
}: any) => {
  const { data: subjectsData } = useGetAllSubjects();
  // Filter subjects by current course (important!)
  const subjects =
    subjectsData?.filter((s: any) => s.course._id === selectedCourse) ?? [];
  const [expandedSubject, setExpandedSubject] = useState<string | null>(
    subjects?.[0]?._id
  );
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);

  const toggleSubject = (subjectId: string) => {
    setExpandedSubject((prev) => (prev === subjectId ? null : subjectId));
  };

  useEffect(() => {
    if (
      subjects &&
      subjects.length > 0 &&
      !subjects.find((s) => s._id === expandedSubject)
    ) {
      setExpandedSubject(subjects[0]._id);
      onChapterSelect(subjects[0].chapters[0]?._id, subjects[0]._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjects]);

  return (
    <>
      <div className="border-r bg-card h-[calc(100vh-73px)] overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Subjects</h2>
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSubjectModalOpen(true)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="space-y-1">
            {subjects?.map((subject) => (
              <div key={subject._id}>
                <button
                  onClick={() => toggleSubject(subject._id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors text-left"
                >
                  {expandedSubject === subject._id ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="font-medium text-foreground">
                    {subject.title}
                  </span>
                </button>

                {expandedSubject === subject._id && (
                  <div className="ml-6 mt-1 space-y-1">
                    {subject?.chapters?.map((chapter) => (
                      <button
                        key={chapter._id}
                        onClick={() =>
                          onChapterSelect(chapter._id, subject._id)
                        }
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                          selectedChapter === chapter._id
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-muted text-muted-foreground"
                        )}
                      >
                        {chapter.title}
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
        selectedCourse={selectedCourse}
      />
    </>
  );
};
