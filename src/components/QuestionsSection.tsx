import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Plus, Edit, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
}

interface QuestionsSectionProps {
  questions: Question[];
  isAdmin?: boolean;
  onUpdate?: (questions: Question[]) => void;
}

export const QuestionsSection = ({ questions, isAdmin = false, onUpdate = () => {} }: QuestionsSectionProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (questionId: string) => {
    toast({
      title: "Answer Submitted",
      description: "Your answer has been saved successfully.",
    });
    setAnswers(prev => ({ ...prev, [questionId]: "" }));
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    const newQ: Question = {
      id: `q-${Date.now()}`,
      text: newQuestion,
    };
    onUpdate([...questions, newQ]);
    setNewQuestion("");
    setIsAdding(false);
    toast({ title: "Question Added" });
  };

  const handleEditQuestion = (id: string) => {
    const updated = questions.map((q) => (q.id === id ? { ...q, text: editText } : q));
    onUpdate(updated);
    setEditingId(null);
    toast({ title: "Question Updated" });
  };

  const handleDeleteQuestion = (id: string) => {
    onUpdate(questions.filter((q) => q.id !== id));
    toast({ title: "Question Deleted" });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Practice Questions
          {isAdmin && (
            <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-4 p-4 border rounded-lg space-y-2">
            <Input
              placeholder="Enter question text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddQuestion} size="sm">
                <Check className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)} size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        
        <Accordion type="single" collapsible className="w-full">
          {questions.map((question) => (
            <AccordionItem key={question.id} value={question.id}>
              <AccordionTrigger className="text-left">
                <div className="flex items-center justify-between w-full pr-4">
                  {editingId === question.id ? (
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="mr-2"
                    />
                  ) : (
                    <span>{question.text}</span>
                  )}
                  {isAdmin && (
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      {editingId === question.id ? (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => handleEditQuestion(question.id)}>
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(question.id);
                              setEditText(question.text);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteQuestion(question.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {!isAdmin && (
                  <div className="space-y-3 pt-2">
                    <Textarea
                      placeholder="Type your answer here..."
                      value={answers[question.id] || ""}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      rows={4}
                    />
                    <Button onClick={() => handleSubmit(question.id)} size="sm">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Answer
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};