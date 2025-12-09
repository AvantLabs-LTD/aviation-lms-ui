import { useState } from "react";
import { Header } from "@/components/Header";
import { SubjectNav } from "@/components/SubjectNav";
import { ContentViewer } from "@/components/ContentViewer";
import { QuestionsSection } from "@/components/QuestionsSection";
import { RightPanel } from "@/components/RightPanel";
import { LoginModal } from "@/components/LoginModal";
import { AdminPanel } from "@/components/AdminPanel";

const Index = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; role: "student" | "admin" } | null>(null);
  
  const [courses, setCourses] = useState([
    { id: "1", name: "Web Development" },
    { id: "2", name: "Data Science" },
    { id: "3", name: "Mobile Development" },
  ]);
  
  const [selectedCourse, setSelectedCourse] = useState("1");
  
  const [subjects, setSubjects] = useState([
    {
      id: "1",
      name: "HTML & CSS",
      chapters: [
        { 
          id: "1-1", 
          name: "Introduction to HTML",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          pptUrl: "",
          resourceUrl: "",
          questions: [
            { id: "q1-1-1", text: "What is the purpose of semantic HTML?" },
            { id: "q1-1-2", text: "Explain the box model in CSS." },
          ]
        },
        { 
          id: "1-2", 
          name: "CSS Fundamentals",
          videoUrl: "",
          pptUrl: "",
          resourceUrl: "",
          questions: []
        },
        { 
          id: "1-3", 
          name: "Responsive Design",
          videoUrl: "",
          pptUrl: "",
          resourceUrl: "",
          questions: []
        },
      ],
    },
    {
      id: "2",
      name: "JavaScript",
      chapters: [
        { 
          id: "2-1", 
          name: "Variables & Data Types",
          videoUrl: "",
          pptUrl: "",
          resourceUrl: "",
          questions: []
        },
        { 
          id: "2-2", 
          name: "Functions & Scope",
          videoUrl: "",
          pptUrl: "",
          resourceUrl: "",
          questions: []
        },
        { 
          id: "2-3", 
          name: "DOM Manipulation",
          videoUrl: "",
          pptUrl: "",
          resourceUrl: "",
          questions: []
        },
      ],
    },
    {
      id: "3",
      name: "React",
      chapters: [
        { 
          id: "3-1", 
          name: "Components & Props",
          videoUrl: "",
          pptUrl: "",
          resourceUrl: "",
          questions: []
        },
        { 
          id: "3-2", 
          name: "State & Lifecycle",
          videoUrl: "",
          pptUrl: "",
          resourceUrl: "",
          questions: []
        },
        { 
          id: "3-3", 
          name: "Hooks",
          videoUrl: "",
          pptUrl: "",
          resourceUrl: "",
          questions: []
        },
      ],
    },
  ]);

  const [selectedChapter, setSelectedChapter] = useState<string | null>("1-1");
  const [selectedSubject, setSelectedSubject] = useState<string>("1");
  const [selectedLesson, setSelectedLesson] = useState<string>("1-1");
  
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  const handleLogin = (username: string, role: "student" | "admin") => {
    setCurrentUser({ username, role });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleChapterSelect = (chapterId: string, subjectId: string) => {
    setSelectedChapter(chapterId);
    setSelectedSubject(subjectId);
    setSelectedLesson(chapterId);
  };

  const handleAdminUpdate = (type: string, data: any) => {
    if (type === "course") setCourses(data);
    if (type === "subject") setSubjects(data);
    if (type === "feedbacks") setFeedbacks(data);
  };

  const currentSubjectData = subjects.find((s) => s.id === selectedSubject);
  const currentChapterData = currentSubjectData?.chapters.find((c) => c.id === selectedChapter);

  const handleContentUpdate = (updates: { videoUrl?: string; pptUrl?: string }) => {
    const updatedSubjects = subjects.map((subject) => ({
      ...subject,
      chapters: subject.chapters.map((chapter) =>
        chapter.id === selectedChapter ? { ...chapter, ...updates } : chapter
      ),
    }));
    setSubjects(updatedSubjects);
  };

  const handleQuestionsUpdate = (questions: any[]) => {
    const updatedSubjects = subjects.map((subject) => ({
      ...subject,
      chapters: subject.chapters.map((chapter) =>
        chapter.id === selectedChapter ? { ...chapter, questions } : chapter
      ),
    }));
    setSubjects(updatedSubjects);
  };

  const handleResourceUpdate = (resourceUrl: string) => {
    const updatedSubjects = subjects.map((subject) => ({
      ...subject,
      chapters: subject.chapters.map((chapter) =>
        chapter.id === selectedChapter ? { ...chapter, resourceUrl } : chapter
      ),
    }));
    setSubjects(updatedSubjects);
  };

  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col">
      <Header
        onLoginClick={() => setLoginOpen(true)}
        currentUser={currentUser?.username || null}
        onLogout={handleLogout}
        selectedCourse={selectedCourse}
        onCourseChange={setSelectedCourse}
        courses={courses}
        isAdmin={currentUser?.role === "admin"}
        onCourseUpdate={handleAdminUpdate}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 flex-shrink-0">
          <SubjectNav
            subjects={subjects}
            selectedChapter={selectedChapter}
            onChapterSelect={handleChapterSelect}
            isAdmin={currentUser?.role === "admin"}
            onSubjectsUpdate={handleAdminUpdate}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <ContentViewer
            videoUrl={currentChapterData?.videoUrl || ""}
            pptUrl={currentChapterData?.pptUrl || ""}
            isAdmin={currentUser?.role === "admin"}
            onUpdate={handleContentUpdate}
          />
          <QuestionsSection 
            questions={currentChapterData?.questions || []}
            isAdmin={currentUser?.role === "admin"}
            onUpdate={handleQuestionsUpdate}
          />
        </div>

        <div className="w-80 flex-shrink-0">
          <RightPanel
            subjectName={currentSubjectData?.name || "Select a subject"}
            lessons={currentSubjectData?.chapters || []}
            selectedLesson={selectedLesson}
            onLessonSelect={setSelectedLesson}
            resourceUrl={currentChapterData?.resourceUrl || ""}
            isAdmin={currentUser?.role === "admin"}
            currentUser={currentUser?.username || ""}
            feedbacks={feedbacks}
            onFeedbacksUpdate={handleAdminUpdate}
            onResourceUpdate={handleResourceUpdate}
          />
        </div>
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={handleLogin} />
    </div>
  );
};

export default Index;
