import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Plus, Edit, Trash2, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetLessonById, useUpdateLesson } from "@/hooks/useLesson";
import { toast } from "sonner";

interface Question {
  questionText: string;
  correctAnswer: string;
  _id: string;
}

interface QuestionsSectionProps {
  isAdmin?: boolean;
  selectedLesson?: string;
}

export const QuestionsSection = ({
  selectedLesson,
  isAdmin = false,
}: QuestionsSectionProps) => {
  const { data: lesson } = useGetLessonById(selectedLesson);
  const { mutateAsync: update } = useUpdateLesson();
  const [questions, setQuestions] = useState([...(lesson?.questions || [])]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionAnswer, setNewQuestionAnswer] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (question: Question) => {
    if (!answers[question._id]?.trim()) return;
    if (answers[question._id] === question.correctAnswer) {
      toast.success("Correct Answer! Well done.");
    } else
      toast.error(
        `Incorrect Answer. The correct answer is: ${question.correctAnswer}`
      );
    setAnswers((prev) => ({ ...prev, [question._id]: "" }));
  };

  const handleAddQuestion = () => {
    if (!newQuestionText.trim() || !newQuestionAnswer.trim()) return;
    const newQ = {
      questionText: newQuestionText,
      correctAnswer: newQuestionAnswer,
    };
    update({
      id: selectedLesson,
      questions: [...questions, newQ],
    });
    setIsAdding(false);
  };

  const handleEditQuestion = (id: string) => {
    const updated = questions.map((q) =>
      q._id === id
        ? { ...q, questionText: editText, correctAnswer: editAnswer }
        : q
    );
    update({
      id: selectedLesson,
      questions: updated,
    });
    setEditingId(null);
  };

  const handleDeleteQuestion = (id: string) => {
    const updated = questions.filter((q) => q._id !== id);
    update({
      id: selectedLesson,
      questions: updated,
    });
  };

  useEffect(() => {
    setQuestions(lesson?.questions || []);
  }, [lesson]);
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Practice Questions
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
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
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
            />
            <Input
              placeholder="Enter question answer"
              value={newQuestionAnswer}
              onChange={(e) => setNewQuestionAnswer(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddQuestion} size="sm">
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAdding(false)}
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <Accordion type="single" collapsible className="w-full">
          {questions?.map((question) => (
            <AccordionItem key={question._id} value={question._id}>
              <AccordionTrigger className="text-left">
                <div className="flex items-center justify-between w-full pr-4">
                  {editingId === question._id ? (
                    <>
                      <Input
                        value={editText || question.questionText}
                        onChange={(e) => setEditText(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="mr-2"
                      />
                      <Input
                        value={editAnswer || question.correctAnswer}
                        onChange={(e) => setEditAnswer(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="mr-2"
                      />
                    </>
                  ) : (
                    <span>{question.questionText}</span>
                  )}
                  {isAdmin && (
                    <div
                      className="flex gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {editingId === question._id ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditQuestion(question._id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingId(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(question._id);
                              setEditText(question.text);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteQuestion(question._id)}
                          >
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
                      value={answers[question._id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(question._id, e.target.value)
                      }
                      rows={4}
                    />
                    <Button onClick={() => handleSubmit(question)} size="sm">
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
