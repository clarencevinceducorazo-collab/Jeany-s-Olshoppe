import { Button } from "@/components/ui/button";
import { LoginForm } from "./login-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FacebookLoginButton } from "@/components/facebook-login-button";
import { login } from "@/app/auth/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function LoginPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const error = searchParams.error as string | undefined;

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-background">
      {/* Abstract Background Element for Premium feel */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/50 blur-[120px] pointer-events-none" />

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
            <h1 className="text-3xl md:text-4xl font-headline font-semibold tracking-tight text-primary">Welcome back</h1>
            <p className="text-muted-foreground text-sm md:text-base">Please enter your details to sign in.</p>
          </div>

          <div className="flex flex-col gap-4">
            <FacebookLoginButton />
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="bg-background px-4 text-muted-foreground/70">
                  Or sign in with email
                </span>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <LoginForm />
          </div>
          
          <p className="text-sm text-center text-muted-foreground pt-4">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary underline underline-offset-4 hover:text-accent transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
