import { createClient } from "@/lib/supabase/server";
import { User, LogOut, Heart, ShieldCheck, ChevronRight, FileText, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { FacebookLoginButton } from "@/components/facebook-login-button";
import { getUserRole } from "@/lib/get-user-role";

async function signOutAction() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export default async function MePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = await getUserRole();
  const isAdmin = role === "admin" || role === "super_admin";

  /* ── LOGGED IN ─────────────────────────────────────────────────── */
  if (user) {
    const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
    const email = user.email;
    const avatar = user.user_metadata?.avatar_url;
    const initials = name.slice(0, 2).toUpperCase();
    const joinDate = new Date(user.created_at).toLocaleDateString("en-PH", {
      year: "numeric", month: "long",
    });

    const menuItems = [
      {
        href: "/saved",
        icon: Heart,
        label: "My Wishlist",
        desc: "View your saved items",
        iconBg: "bg-accent/10",
        iconColor: "text-accent",
      },
      {
        href: "/shop",
        icon: ShoppingBag,
        label: "Browse Shop",
        desc: "Discover Japan surplus finds",
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-500",
      },
      {
        href: "/privacy",
        icon: FileText,
        label: "Privacy Policy",
        desc: "Read our privacy information",
        iconBg: "bg-secondary",
        iconColor: "text-muted-foreground",
      },
      ...(isAdmin
        ? [{
            href: "/admin",
            icon: ShieldCheck,
            label: "Admin Panel",
            desc: `Logged in as ${role?.replace("_", " ")}`,
            iconBg: "bg-accent/10",
            iconColor: "text-accent",
          }]
        : []),
    ];

    return (
      <div className="min-h-screen bg-background pb-32 md:pb-16">
        {/* ── Hero profile banner ───────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-accent/20 via-accent/5 to-background pt-12 pb-20 px-4 overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent/8 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />

          <div className="relative flex flex-col items-center text-center max-w-sm mx-auto">
            {/* Avatar */}
            <div className="relative mb-4">
              {avatar ? (
                <Image
                  src={avatar}
                  alt={name}
                  width={88}
                  height={88}
                  className="w-22 h-22 rounded-full object-cover border-4 border-background shadow-xl"
                  style={{ width: 88, height: 88 }}
                />
              ) : (
                <div className="w-[88px] h-[88px] rounded-full bg-accent/20 border-4 border-background shadow-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent">{initials}</span>
                </div>
              )}
              {/* Online dot */}
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
            </div>

            <h1 className="text-xl font-bold text-foreground tracking-tight">{name}</h1>
            {email && <p className="text-muted-foreground text-sm mt-0.5">{email}</p>}

            {/* Role badge */}
            {isAdmin && (
              <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[11px] text-accent font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                {role?.replace("_", " ")}
              </span>
            )}

            {/* Joined */}
            <p className="text-[11px] text-muted-foreground/60 mt-2">Member since {joinDate}</p>
          </div>
        </div>

        {/* ── Menu Items ───────────────────────────────────────────── */}
        <div className="max-w-sm mx-auto px-4 -mt-6">
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden divide-y divide-border">
            {menuItems.map(({ href, icon: Icon, label, desc, iconBg, iconColor }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-4 px-4 py-4 hover:bg-muted/40 active:bg-muted/60 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-tight">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0 group-hover:text-muted-foreground transition-colors" />
              </Link>
            ))}
          </div>

          {/* Sign Out */}
          <form action={signOutAction} className="mt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 active:scale-[0.98] transition-all text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>

          <p className="text-center text-[11px] text-muted-foreground/40 mt-6">
            Jeany&apos;s Olshoppe · Japan Surplus Philippines
          </p>
        </div>
      </div>
    );
  }

  /* ── NOT LOGGED IN ─────────────────────────────────────────────── */
  return (
    <div className="min-h-[80vh] flex flex-col bg-background">
      {/* Top decorative section */}
      <div className="relative bg-gradient-to-br from-accent/15 via-accent/5 to-background flex-1 flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-accent/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-accent/8 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />

        {/* Avatar placeholder */}
        <div className="relative w-24 h-24 rounded-full bg-accent/10 border-4 border-background shadow-xl flex items-center justify-center mb-6">
          <User className="w-10 h-10 text-accent/50" />
        </div>

        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">Welcome!</h1>
        <p className="text-muted-foreground text-sm max-w-[260px] leading-relaxed mb-8">
          Sign in to save your wishlist, track your favorite Japan surplus finds, and more.
        </p>

        {/* Login options */}
        <div className="w-full max-w-xs space-y-3">
          <FacebookLoginButton />
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border border-border bg-card text-foreground text-sm font-semibold hover:bg-muted/50 active:scale-[0.98] transition-all"
          >
            <User className="w-4 h-4 text-muted-foreground" />
            Continue with Email
          </Link>
        </div>

        {/* Privacy footnote */}
        <p className="mt-8 text-[11px] text-muted-foreground/50 max-w-xs">
          By signing in you agree to our{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-muted-foreground">
            Privacy Policy
          </Link>.
        </p>
      </div>
    </div>
  );
}
