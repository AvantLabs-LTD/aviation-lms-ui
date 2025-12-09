import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AdminPanelProps {
  courses: any[];
  subjects: any[];
  feedbacks: any[];
  onUpdate: (type: string, data: any) => void;
}

export const AdminPanel = ({ courses, subjects, feedbacks, onUpdate }: AdminPanelProps) => {
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const handleAdd = (type: string) => {
    const newItem = type === "course" 
      ? { id: Date.now().toString(), name: formData.name || "New Course" }
      : { id: Date.now().toString(), name: formData.name || "New Subject", chapters: [] };
    
    onUpdate(type, [...(type === "course" ? courses : subjects), newItem]);
    toast({ title: "Added", description: `${type} added successfully.` });
    setFormData({});
  };

  const handleEdit = (type: string, item: any) => {
    const updatedList = (type === "course" ? courses : subjects).map((i: any) =>
      i.id === item.id ? { ...i, ...formData } : i
    );
    onUpdate(type, updatedList);
    toast({ title: "Updated", description: `${type} updated successfully.` });
    setEditingItem(null);
    setFormData({});
  };

  const handleDelete = (type: string, id: string) => {
    const updatedList = (type === "course" ? courses : subjects).filter((i: any) => i.id !== id);
    onUpdate(type, updatedList);
    toast({ title: "Deleted", description: `${type} deleted successfully.` });
  };

  const handleMarkFeedbackDone = (id: string) => {
    const updatedFeedbacks = feedbacks.map((f: any) =>
      f.id === id ? { ...f, done: true } : f
    );
    onUpdate("feedbacks", updatedFeedbacks);
    toast({ title: "Marked as Done", description: "Feedback marked as completed." });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Course</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Course Name</Label>
                <Input
                  placeholder="Enter course name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <Button onClick={() => handleAdd("course")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Courses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                  {editingItem?.id === course.id ? (
                    <Input
                      value={formData.name || course.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="flex-1 mr-2"
                    />
                  ) : (
                    <span className="font-medium">{course.name}</span>
                  )}
                  <div className="flex gap-2">
                    {editingItem?.id === course.id ? (
                      <Button size="sm" onClick={() => handleEdit("course", course)}>
                        <Check className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingItem(course);
                          setFormData({ name: course.name });
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete("course", course.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Subject</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Subject Name</Label>
                <Input
                  placeholder="Enter subject name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <Button onClick={() => handleAdd("subject")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Subjects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center justify-between p-3 border rounded-lg">
                  {editingItem?.id === subject.id ? (
                    <Input
                      value={formData.name || subject.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="flex-1 mr-2"
                    />
                  ) : (
                    <span className="font-medium">{subject.name}</span>
                  )}
                  <div className="flex gap-2">
                    {editingItem?.id === subject.id ? (
                      <Button size="sm" onClick={() => handleEdit("subject", subject)}>
                        <Check className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingItem(subject);
                          setFormData({ name: subject.name });
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete("subject", subject.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedbacks">
          <Card>
            <CardHeader>
              <CardTitle>User Feedbacks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {feedbacks.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No feedbacks yet</p>
              ) : (
                feedbacks.map((feedback: any) => (
                  <div
                    key={feedback.id}
                    className={`p-4 border rounded-lg ${
                      feedback.done ? "bg-muted opacity-60" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium">{feedback.username}</p>
                        <p className="text-sm text-muted-foreground">{feedback.text}</p>
                      </div>
                      {!feedback.done && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkFeedbackDone(feedback.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Mark Done
                        </Button>
                      )}
                    </div>
                    {feedback.done && (
                      <span className="text-xs text-muted-foreground">✓ Completed</span>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
