import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { SubjectNav } from "@/components/SubjectNav";
import { ContentViewer } from "@/components/ContentViewer";
import { QuestionsSection } from "@/components/QuestionsSection";
import { RightPanel } from "@/components/RightPanel";
import { LoginModal } from "@/components/LoginModal";
import {
  useGetLoggedInUser,
  useLogin,
  useUpdateProgress,
} from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { StudentManageModal } from "@/components/StudentManageModal";
import { ChevronLeft, ChevronRight } from "lucide-react"; // You'll need lucide-react installed

const Index = () => {
  const queryClient = useQueryClient();
  const [loginOpen, setLoginOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const { mutateAsync: login, isPending: loginPending } = useLogin();
  const { data: user } = useGetLoggedInUser();
  const { mutate: updateProgress } = useUpdateProgress();
  const [selectedCourse, setSelectedCourse] = useState("1");

  // Collapse states
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  const [subjects, setSubjects] = useState([
    // ... your subjects data (unchanged)
  ]);

  const [selectedChapter, setSelectedChapter] = useState<string | null>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  const handleLogin = async (password: string, email: string) => {
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

  useEffect(() => {
    if (user?.role === "student" && selectedLesson) {
      updateProgress(selectedLesson);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLesson]);

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
        <div className="flex flex-1 items-center justify-center">
          <div className="w-[340px] p-4 bg-white rounded-lg shadow">
            <h1 className="text-center text-lg">Logging in...</h1>
          </div>
        </div>
      ) : user?._id ? (
        <div className="flex flex-1 overflow-hidden relative">
          {/* Left Sidebar */}
          <div
            className={`h-full border-r border-border bg-background transition-all duration-300 ease-in-out flex flex-col ${
              leftCollapsed ? "w-0" : "w-64"
            }`}
          >
            <div
              className={`flex-1 overflow-hidden ${
                leftCollapsed ? "hidden" : ""
              }`}
            >
              <SubjectNav
                selectedChapter={selectedChapter}
                onChapterSelect={handleChapterSelect}
                isAdmin={user?.role === "admin"}
                selectedCourse={selectedCourse}
              />
            </div>

            {/* Toggle Button - Left */}
            <button
              onClick={() => setLeftCollapsed(!leftCollapsed)}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-primary text-primary-foreground w-8 h-8 rounded-r flex items-center justify-center shadow-md hover:bg-primary/90 z-1"
            >
              {leftCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Main Content */}
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

          {/* Right Panel */}
          <div
            className={`h-full border-l border-border bg-background transition-all duration-300 ease-in-out flex flex-col ${
              rightCollapsed ? "w-0" : "w-80"
            }`}
          >
            <div
              className={`flex-1 overflow-hidden ${
                rightCollapsed ? "hidden" : ""
              }`}
            >
              <RightPanel
                selectedLesson={selectedLesson}
                onLessonSelect={setSelectedLesson}
                resourceUrl={currentChapterData?.resourceUrl || ""}
                isAdmin={user?.role === "admin"}
                currentUser={user?.email}
                selectedChapter={selectedChapter}
              />
            </div>

            {/* Toggle Button - Right */}
            <button
              onClick={() => setRightCollapsed(!rightCollapsed)}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-primary text-primary-foreground w-8 h-8 rounded-l flex items-center justify-center shadow-md hover:bg-primary/90 z-1"
            >
              {rightCollapsed ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
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

      {/* Admin Button */}
      {user?.role === "admin" && (
        <Button
          className="fixed bottom-4 right-4 z-20"
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
