import { GitConnectScreen } from "../components/git-connect-screen";
import { VaultShellLayout } from "../components/vault-shell-layout";

export default function GitConnectPage() {
  return (
    <VaultShellLayout
      activeHub="git"
      title="Settings - Git Integrations"
      subtitle="Connect repository and configure monitoring pipeline"
    >
      <GitConnectScreen embeddedInLayout />
    </VaultShellLayout>
  );
}
