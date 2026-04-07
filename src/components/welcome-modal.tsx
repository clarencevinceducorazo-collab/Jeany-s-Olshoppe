'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function WelcomeModalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const loginStatus = searchParams.get('login');
    const signupStatus = searchParams.get('signup');

    if (loginStatus === 'success') {
      setModalTitle("Welcome back, friend!");
      setModalMessage("We are so happy to see you again at Jeanys Olshoppe.");
      setIsOpen(true);
      
      // Remove query param without refreshing the page
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);

      setTimeout(() => setIsOpen(false), 3000);
    } else if (signupStatus === 'success') {
      setModalTitle("Welcome to Jeanys Olshoppe!");
      setModalMessage("Please check your email to verify your account.");
      setIsOpen(true);

      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);

      setTimeout(() => setIsOpen(false), 4000);
    }
  }, [searchParams]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-md border-accent/20">
        <DialogHeader className="flex flex-col items-center">
          <div className="w-20 h-20 relative rounded-full overflow-hidden mb-4 border-2 border-accent/30 shadow-lg animate-in zoom-in duration-500">
            <Image src="/favicon.ico" alt="Owner" fill className="object-cover" />
          </div>
          <DialogTitle className="font-headline text-2xl text-center text-primary">
            {modalTitle}
          </DialogTitle>
          <DialogDescription className="text-base pt-2 text-center">
            {modalMessage}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export function WelcomeModal() {
  return (
    <Suspense fallback={null}>
      <WelcomeModalContent />
    </Suspense>
  );
}
