import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FacebookLoginButton } from "@/components/facebook-login-button";
import { signup } from "@/app/auth/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SignupPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const error = searchParams.error as string | undefined;
  const message = searchParams.message as string | undefined;

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-background">
      {/* Abstract Background Element for Premium feel */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/50 blur-[120px] pointer-events-none" />

      <div className="flex w-full items-center justify-center p-6 md:p-12 z-10">
        <div className="w-full max-w-[400px] flex flex-col gap-8 relative">
          
          <div className="flex justify-between items-center w-full">
            <Link href="/" className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-secondary/50 hover:bg-secondary text-foreground transition-colors group">
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <Button variant="ghost" asChild className="text-sm font-medium hover:bg-secondary/50">
              <Link href="/">Continue as Guest</Link>
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-headline font-semibold tracking-tight text-primary">Create account</h1>
            <p className="text-muted-foreground text-sm md:text-base">Join us to save items and receive exclusive curations.</p>
          </div>

          <div className="flex flex-col gap-4">
             {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {message && (
              <Alert className="bg-primary/5 border-primary/20 text-primary">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <FacebookLoginButton />
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="bg-background px-4 text-muted-foreground/70">
                  Or continue with email
                </span>
              </div>
            </div>

            <form action={signup} className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="font-medium">Email address</Label>
                <Input id="email" name="email" type="email" placeholder="hello@example.com" required className="h-12 bg-secondary/30 border-border/50 focus-visible:ring-accent focus-visible:border-accent" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="font-medium">Password</Label>
                <Input id="password" name="password" type="password" required className="h-12 bg-secondary/30 border-border/50 focus-visible:ring-accent focus-visible:border-accent" />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="confirm-password" className="font-medium">Confirm password</Label>
                <Input id="confirm-password" name="confirm-password" type="password" required className="h-12 bg-secondary/30 border-border/50 focus-visible:ring-accent focus-visible:border-accent" />
              </div>
              <Button type="submit" className="w-full h-12 mt-2 text-base font-medium shadow-sm hover:shadow-md transition-all">Create Account</Button>
            </form>
          </div>
          
          <p className="text-sm text-center text-muted-foreground pt-4">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary underline underline-offset-4 hover:text-accent transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
