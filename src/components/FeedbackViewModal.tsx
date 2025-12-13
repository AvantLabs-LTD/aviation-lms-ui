"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUpdateFeedback } from "@/hooks/useFeedback";

interface Feedback {
  _id: string;
  text: string;
  isDone: boolean;
  user?: { name: string; email: string };
}

interface FeedbackViewModalProps {
  open: boolean;
  onClose: () => void;
  feedbacks: Feedback[];
}

const PAGE_SIZE = 3;

export const FeedbackViewModal = ({
  open,
  onClose,
  feedbacks,
}: FeedbackViewModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { mutateAsync: markFeedbackDone } = useUpdateFeedback();

  // Filter feedbacks based on search query
  const filteredFeedbacks = useMemo(() => {
    if (!searchQuery.trim()) return feedbacks;

    const lowerQuery = searchQuery?.toLowerCase();
    return feedbacks.filter(
      (feedback) =>
        feedback.user.email.toLowerCase().includes(lowerQuery) ||
        feedback.text.toLowerCase().includes(lowerQuery) ||
        (feedback.user?.name || "").toLowerCase().includes(lowerQuery)
    );
  }, [feedbacks, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredFeedbacks.length / PAGE_SIZE);
  const paginatedFeedbacks = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredFeedbacks.slice(start, end);
  }, [filteredFeedbacks, currentPage]);

  const handleMarkDone = (id: string) => {
    markFeedbackDone({ id, isDone: true });
    toast({ title: "Marked as Done" });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>User Feedbacks</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="py-4">
          <Input
            placeholder="Search by email, message, or name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="max-w-sm"
          />
        </div>

        {/* Feedback List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {paginatedFeedbacks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {searchQuery ? "No matching feedbacks found" : "No feedbacks yet"}
            </p>
          ) : (
            paginatedFeedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className={`p-4 border rounded-lg ${
                  feedback.isDone ? "bg-muted opacity-60" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{feedback.user.email}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {feedback.text}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {feedback?.user?.name || "Anonymous"}
                    </p>
                  </div>
                  {!feedback.isDone && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkDone(feedback._id)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Done
                    </Button>
                  )}
                </div>
                {feedback.isDone && (
                  <span className="text-xs text-muted-foreground mt-2 block">
                    ✓ Completed
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages} ({filteredFeedbacks.length}{" "}
              total)
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
