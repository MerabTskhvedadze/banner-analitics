"use client";

import PageHeader from "@/components/settings/PageHeader";
import BillingTokensSection from "@/components/settings/billing/BillingTokensSection";
import ProfileSettingsForm from "@/components/settings/profile/ProfileSettingsForm";
import {
  App,
  Divider,
} from "antd";
import TwoFA from "@/components/settings/security/TwoFA";

export default function Page() {
  return (
    <App>
      <main>
        <section id="profile-settings" className="scroll-mt-24">
          <PageHeader
            className="mb-4"
            title='Profile Settings'
            subtitle='Update your personal information'
          />

          <ProfileSettingsForm />

          <Divider />
        </section>

        <section id="billing-settings" className="scroll-mt-24">
          <PageHeader
            className="mb-4"
            title='Billing & Tokens'
            subtitle='Manage your token balance, payment methods and billing history'
          />

          <BillingTokensSection />

          <Divider />
        </section>

        <section id="security-settings" className="scroll-mt-24">
          <PageHeader
            className="mb-4"
            title="Security Settings"
            subtitle="Manage your password and secure your account with 2FA."
          />

          <TwoFA />
        </section>
      </main>
    </App>
  );
}
