import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signup } from "@/app/auth/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SignupPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const error = searchParams.error as string | undefined;
  const message = searchParams.message as string | undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>Join to save your favorite items and get restock alerts.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          <form action={signup} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" name="confirm-password" type="password" required />
            </div>
            <Button type="submit" className="w-full min-h-[44px]">Create Account</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
           <p className="text-xs text-center text-muted-foreground mt-4">
            Already have an account?{' '}
            <Link href="/login" className="underline hover:text-primary">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
