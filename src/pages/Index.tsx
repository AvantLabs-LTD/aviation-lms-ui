import { useState } from "react";
import { Header } from "@/components/Header";
import { SubjectNav } from "@/components/SubjectNav";
import { ContentViewer } from "@/components/ContentViewer";
import { QuestionsSection } from "@/components/QuestionsSection";
import { RightPanel } from "@/components/RightPanel";
import { LoginModal } from "@/components/LoginModal";
import { useGetLoggedInUser, useLogin } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { StudentManageModal } from "@/components/StudentManageModal";

const Index = () => {
  const queryClient = useQueryClient();
  const [loginOpen, setLoginOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const { mutateAsync: login, isPending: loginPending } = useLogin();
  const { data: user } = useGetLoggedInUser();
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
          ],
        },
        {
          id: "1-2",
          name: "CSS Fundamentals",
          videoUrl: "",
          pptUrl: "",
          resourceUrl: "",
          questions: [],
        },
        {
          id: "1-3",
          name: "Responsive Design",
          videoUrl: "",
          pptUrl: "",
          resourceUrl: "",
          questions: [],
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
          questions: [],
        },
        {
          id: "2-2",
          name: "Functions & Scope",
          videoUrl: "",
          pptUrl: "",
          resourceUrl: "",
          questions: [],
        },
        {
          id: "2-3",
          name: "DOM Manipulation",
          videoUrl: "",
          pptUrl: "",
          resourceUrl: "",
          questions: [],
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
          questions: [],
        },
        {
          id: "3-2",
          name: "State & Lifecycle",
          videoUrl: "",
          pptUrl: "",
          resourceUrl: "",
          questions: [],
        },
        {
          id: "3-3",
          name: "Hooks",
          videoUrl: "",
          pptUrl: "",
          resourceUrl: "",
          questions: [],
        },
      ],
    },
  ]);
  const [selectedChapter, setSelectedChapter] = useState<string | null>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedLesson, setSelectedLesson] = useState<string>("");

  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  const handleLogin = async (password, email) => {
    await login({ password, email });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    queryClient.invalidateQueries({ queryKey: ["getLoggedInUser"] });
  };

  const handleChapterSelect = (chapterId: string, subjectId: string) => {
    setSelectedChapter(chapterId);
    setSelectedSubject(subjectId);
    setSelectedLesson(chapterId);
  };

  const handleAdminUpdate = (type: string, data: any) => {
    // if (type === "course") setCourses(data);
    // if (type === "subject") setSubjects(data);
    if (type === "feedbacks") setFeedbacks(data);
  };

  const currentSubjectData = subjects.find((s) => s.id === selectedSubject);
  const currentChapterData = currentSubjectData?.chapters.find(
    (c) => c.id === selectedChapter
  );

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
        currentUser={user?.email || null}
        onLogout={handleLogout}
        isAdmin={user?.role === "admin"}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
      />

      {loginPending ? (
        <div className="flex flex-1 overflow-hidden items-center justify-center">
          <div className="w-[340px] p-4 bg-white rounded-lg shadow">
            <h1 className="text-center text-lg">Logging in...</h1>
          </div>
        </div>
      ) : user?._id ? (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 flex-shrink-0">
            <SubjectNav
              selectedChapter={selectedChapter}
              onChapterSelect={handleChapterSelect}
              isAdmin={user?.role === "admin"}
              selectedCourse={selectedCourse}
            />
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <ContentViewer
              isAdmin={user?.role === "admin"}
              selectedLesson={selectedLesson}
            />
            <QuestionsSection
              isAdmin={user?.role === "admin"}
              selectedLesson={selectedLesson}
            />
          </div>

          <div className="w-80 flex-shrink-0">
            <RightPanel
              selectedLesson={selectedLesson}
              onLessonSelect={setSelectedLesson}
              resourceUrl={currentChapterData?.resourceUrl || ""}
              isAdmin={user?.role === "admin"}
              currentUser={user?.email}
              selectedChapter={selectedChapter}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden items-center justify-center">
          <div className="w-[340px] p-4 bg-white rounded-lg shadow">
            <h1 className="text-center text-lg">
              Please login to view website's content.
            </h1>
            <Button
              onClick={() => setLoginOpen(true)}
              className="mx-auto mt-3 block"
            >
              Login
            </Button>
          </div>
        </div>
      )}

      {user?.role === "admin" && (
        <Button
          className="fixed bottom-2 right-2 z-10"
          onClick={() => setStudentModalOpen(true)}
        >
          Open Student Management
        </Button>
      )}

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
      />
      <StudentManageModal
        open={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
      />
    </div>
  );
};

export default Index;
