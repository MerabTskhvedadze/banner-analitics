import TwoFAClient from "@/components/auth/2fa/TwoFaClient";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const n = resolvedSearchParams?.next;

  const nextPath = n && n.startsWith("/") ? n : "/dashboard";

  const normalizedNext =
    nextPath.startsWith("/auth/reset-callback") ? "/auth/reset-password" : nextPath;

  return <TwoFAClient nextPath={normalizedNext} />;

  // const nextPath = n && n.startsWith("/") ? n : "/dashboard";
  // return <TwoFAClient nextPath={nextPath} />;
}
