import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (username: string, role: "student" | "admin") => void;
}

export const LoginModal = ({ open, onClose, onLogin }: LoginModalProps) => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"student" | "admin">("student");

  const handleLogin = () => {
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username.",
        variant: "destructive",
      });
      return;
    }

    onLogin(username, role);
    setUsername("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to LearnHub</DialogTitle>
          <DialogDescription>
            Please enter your credentials to continue
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Role</Label>
            <RadioGroup value={role} onValueChange={(v) => setRole(v as "student" | "admin")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student" className="font-normal cursor-pointer">
                  Student
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin" className="font-normal cursor-pointer">
                  Admin
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <Button onClick={handleLogin} className="w-full">
          Login
        </Button>
      </DialogContent>
    </Dialog>
  );
};
