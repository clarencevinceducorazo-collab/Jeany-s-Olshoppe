'use client';

import { Button } from '@/components/ui/button';
import { Heart, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductActionsProps {
  isSoldOut: boolean;
  messengerLink: string;
  messageText: string;
}

export function ProductActions({ isSoldOut, messengerLink, messageText }: ProductActionsProps) {
  const { toast } = useToast();

  const handleMessengerClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      await navigator.clipboard.writeText(messageText);
      toast({
        title: 'Message Copied!',
        description: 'The product details have been copied to your clipboard. Just paste it in the Messenger chat!',
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:bg-transparent sm:p-0 bg-background fixed bottom-0 left-0 right-0 p-4 pb-28 border-t sm:static sm:border-0 z-40">
      <Button size="lg" className="w-full h-11" disabled={isSoldOut}>
        <Heart className="mr-2 h-5 w-5" />
        Add to Wishlist
      </Button>
      <Button asChild size="lg" className="w-full h-11 bg-[#0084ff] hover:bg-[#0084ff]/90 text-white font-medium cursor-pointer">
        <a href={messengerLink} target="_blank" rel="noopener noreferrer" onClick={handleMessengerClick}>
          <MessageCircle className="mr-2 h-5 w-5" /> Inquire via Messenger
        </a>
      </Button>
    </div>
  );
}
