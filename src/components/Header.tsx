import { useEffect, useState } from "react";
import {
  GraduationCap,
  User,
  Settings,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CourseManageModal } from "@/components/CourseManageModal";
import { cn } from "@/lib/utils";
import { useGetAllCourses } from "@/hooks/useCourse";

export const Header = ({
  onLoginClick,
  currentUser,
  onLogout,
  isAdmin = false,
  selectedCourse,
  setSelectedCourse,
}: any) => {
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const { data: courses } = useGetAllCourses();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      courses &&
      courses.length > 0 &&
      !courses.find((c) => c._id === selectedCourse)
    ) {
      setSelectedCourse(courses[0]._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses, selectedCourse]);

  return (
    <>
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">LearnHub</span>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-md mx-8">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="flex-1 justify-between"
                >
                  {selectedCourse
                    ? courses?.find((course) => course._id === selectedCourse)
                        ?.title
                    : "Select a course..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search course..." />
                  <CommandList>
                    <CommandEmpty>No course found.</CommandEmpty>
                    <CommandGroup>
                      {courses?.map((course) => (
                        <CommandItem
                          key={course._id}
                          value={course.title}
                          onSelect={() => {
                            setSelectedCourse(course._id);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCourse === course._id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {course.title}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {isAdmin && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCourseModalOpen(true)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-md">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{currentUser}</span>
                </div>
                <Button onClick={onLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={onLoginClick}>Login</Button>
            )}
          </div>
        </div>
      </header>

      <CourseManageModal
        open={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
      />
    </>
  );
};
