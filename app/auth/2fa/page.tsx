import TwoFAClient from "@/components/auth/2fa/TwoFaClient";

export default function Page({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const n = searchParams?.next;

  const nextPath = n && n.startsWith("/") ? n : "/dashboard";

  const normalizedNext =
    nextPath.startsWith("/auth/reset-callback") ? "/auth/reset-password" : nextPath;

  return <TwoFAClient nextPath={normalizedNext} />;

  // const nextPath = n && n.startsWith("/") ? n : "/dashboard";
  // return <TwoFAClient nextPath={nextPath} />;
}