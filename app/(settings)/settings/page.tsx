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
        <section>
          <PageHeader
            className="scroll-mt-20 mb-4"
            id="profile-settings"
            title='Profile Settings'
            subtitle='Update your personal information'
          />

          <ProfileSettingsForm />

          <Divider />
        </section>

        <section>
          <PageHeader
            className="scroll-mt-20 mb-4"
            id="billing-settings"
            title='Billing & Tokens'
            subtitle='Manage your token balance, payment methods and billing history'
          />

          <BillingTokensSection />

          <Divider />
        </section>

        <section>
          <PageHeader
            className="scroll-mt-20 mb-4"
            id="security-settings"
            title="Security Settings"
            subtitle="Manage your password and secure your account with 2FA."
          />

          <TwoFA />
        </section>
      </main>
    </App>
  );
}
