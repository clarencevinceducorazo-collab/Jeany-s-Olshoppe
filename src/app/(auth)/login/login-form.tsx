'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { login } from "@/app/auth/actions";
import { CheckCircle2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccessMode, setIsSuccessMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showError = (message: string) => {
    setIsSuccessMode(false);
    setModalTitle("Login Error");
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const showSuccess = (message: string) => {
    setIsSuccessMode(true);
    setModalTitle("Welcome back, friend!");
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      showError("Please enter both your email and password.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    
    try {
      const result = await login(formData);
      setIsSubmitting(false);

      if (!result?.success) {
        showError(result?.error || "Incorrect login credentials.");
        setPassword(""); 
      } else {
        router.push('/?login=success');
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
        <Button type="submit" disabled={isSubmitting} className="w-full h-12 mt-2 text-base font-medium shadow-sm hover:shadow-md transition-all">
            {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <Dialog open={isModalOpen} onOpenChange={(open) => !isSuccessMode && setIsModalOpen(open)}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-md">
          <DialogHeader className="flex flex-col items-center">
            {isSuccessMode ? (
              <div className="w-20 h-20 relative rounded-full overflow-hidden mb-4 border-2 border-accent/30 shadow-lg animate-in zoom-in duration-500">
                <Image src="/favicon.ico" alt="Owner" fill className="object-cover" />
              </div>
            ) : null}
            <DialogTitle className={`font-headline text-2xl text-center ${isSuccessMode ? 'text-primary' : 'text-destructive'}`}>
               {modalTitle}
            </DialogTitle>
            <DialogDescription className={`text-base pt-2 text-center`}>
              {modalMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center pt-2">
            {!isSuccessMode && (
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="w-full sm:w-auto">
                  Try Again
                </Button>
              </DialogClose>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
