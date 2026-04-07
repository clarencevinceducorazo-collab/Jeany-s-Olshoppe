'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { signup } from "@/app/auth/actions";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setModalMessage("Passwords do not match. Please try again.");
      setIsModalOpen(true);
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
      await signup(formData);
    } catch (err: any) {
      // In Next.js App Router, redirects throw an error `NEXT_REDIRECT`.
      // The framework smoothly catches it, but if it's a real JS error, it'll show here.
      if (err.message && err.message !== "NEXT_REDIRECT") {
          setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid gap-2">
          <Label htmlFor="email" className="font-medium">Email address</Label>
          <Input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@example.com" required className="h-12 bg-secondary/30 border-border/50 focus-visible:ring-accent focus-visible:border-accent" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password" className="font-medium">Password</Label>
          <Input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12 bg-secondary/30 border-border/50 focus-visible:ring-accent focus-visible:border-accent" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password" className="font-medium">Confirm password</Label>
          <Input id="confirm-password" name="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="h-12 bg-secondary/30 border-border/50 focus-visible:ring-accent focus-visible:border-accent" />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full h-12 mt-2 text-base font-medium shadow-sm hover:shadow-md transition-all">
            {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive font-headline text-2xl">Signup Error</DialogTitle>
            <DialogDescription className="text-base pt-2">
              {modalMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start pt-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
