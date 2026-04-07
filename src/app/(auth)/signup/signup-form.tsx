'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { signup } from "@/app/auth/actions";
import { CheckCircle2 } from "lucide-react";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccessMode, setIsSuccessMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showError = (message: string) => {
    setIsSuccessMode(false);
    setModalTitle("Signup Error");
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const showSuccess = (message: string) => {
    setIsSuccessMode(true);
    setModalTitle("Account Created");
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password || !confirmPassword) {
      showError("All fields must be filled out to continue.");
      return;
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match. Please try again.");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirm-password", confirmPassword);
    
    try {
      const result = await signup(formData);
      setIsSubmitting(false);

      if (!result?.success) {
        showError(result?.error || "An unknown error occurred");
      } else {
        router.push('/?signup=success');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      showError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div className="grid gap-2">
          <Label htmlFor="email" className="font-medium">Email address</Label>
          <Input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@example.com" className="h-12 bg-secondary/30 border-border/50 focus-visible:ring-accent focus-visible:border-accent" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password" className="font-medium">Password</Label>
          <Input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 bg-secondary/30 border-border/50 focus-visible:ring-accent focus-visible:border-accent" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password" className="font-medium">Confirm password</Label>
          <Input id="confirm-password" name="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-12 bg-secondary/30 border-border/50 focus-visible:ring-accent focus-visible:border-accent" />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full h-12 mt-2 text-base font-medium shadow-sm hover:shadow-md transition-all">
            {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <Dialog open={isModalOpen} onOpenChange={(open) => !isSuccessMode && setIsModalOpen(open)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-col items-center sm:items-start">
            {isSuccessMode && <CheckCircle2 className="h-12 w-12 text-accent mb-4 mx-auto sm:mx-0 animate-in zoom-in" />}
            <DialogTitle className={`font-headline text-2xl ${isSuccessMode ? 'text-primary' : 'text-destructive'}`}>
               {modalTitle}
            </DialogTitle>
            <DialogDescription className={`text-base pt-2 ${isSuccessMode ? 'text-center sm:text-left' : ''}`}>
              {modalMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start pt-2">
            {!isSuccessMode && (
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
