import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Course {
  id: string;
  name: string;
}

interface CourseManageModalProps {
  open: boolean;
  onClose: () => void;
  courses: Course[];
  onUpdate: (type: string, data: any) => void;
}

export const CourseManageModal = ({ open, onClose, courses, onUpdate }: CourseManageModalProps) => {
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const handleAdd = () => {
    const newCourse = { id: Date.now().toString(), name: formData.name || "New Course" };
    onUpdate("course", [...courses, newCourse]);
    toast({ title: "Course Added" });
    setFormData({});
  };

  const handleEdit = (course: Course) => {
    const updatedList = courses.map((c) => (c.id === course.id ? { ...c, ...formData } : c));
    onUpdate("course", updatedList);
    toast({ title: "Course Updated" });
    setEditingItem(null);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    onUpdate("course", courses.filter((c) => c.id !== id));
    toast({ title: "Course Deleted" });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Courses</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Add New Course</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Course name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Existing Courses</Label>
            {courses.map((course) => (
              <div key={course.id} className="flex items-center gap-2 p-2 border rounded-lg">
                {editingItem?.id === course.id ? (
                  <Input
                    value={formData.name || course.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="flex-1"
                  />
                ) : (
                  <span className="flex-1 font-medium">{course.name}</span>
                )}
                <div className="flex gap-1">
                  {editingItem?.id === course.id ? (
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(course)}>
                      <Check className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingItem(course);
                        setFormData({ name: course.name });
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(course.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
