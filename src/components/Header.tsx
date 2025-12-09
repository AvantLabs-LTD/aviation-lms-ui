import { useState } from "react";
import { GraduationCap, User, Settings, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CourseManageModal } from "@/components/CourseManageModal";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onLoginClick: () => void;
  currentUser: string | null;
  onLogout: () => void;
  selectedCourse: string;
  onCourseChange: (value: string) => void;
  courses: Array<{ id: string; name: string }>;
  isAdmin?: boolean;
  onCourseUpdate?: (type: string, data: any) => void;
}

export const Header = ({ 
  onLoginClick, 
  currentUser, 
  onLogout,
  selectedCourse,
  onCourseChange,
  courses,
  isAdmin = false,
  onCourseUpdate = () => {},
}: HeaderProps) => {
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

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
                  ? courses.find((course) => course.id === selectedCourse)?.name
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
                    {courses.map((course) => (
                      <CommandItem
                        key={course.id}
                        value={course.name}
                        onSelect={() => {
                          onCourseChange(course.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCourse === course.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {course.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {isAdmin && (
            <Button variant="outline" size="icon" onClick={() => setCourseModalOpen(true)}>
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
      courses={courses}
      onUpdate={onCourseUpdate}
    />
    </>
  );
};
