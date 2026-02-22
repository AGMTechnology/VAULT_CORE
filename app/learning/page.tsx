import { LearningScreen } from "../components/learning-screen";
import { VaultShellLayout } from "../components/vault-shell-layout";

export default function LearningPage() {
  return (
    <VaultShellLayout
      activeHub="learning"
      title="Learning - Post-Mortem"
      subtitle="Lessons capture and memory context"
    >
      <LearningScreen embeddedInLayout />
    </VaultShellLayout>
  );
}
