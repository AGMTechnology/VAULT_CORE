import { MonitoringScreen } from "../components/monitoring-screen";
import { VaultShellLayout } from "../components/vault-shell-layout";

export default function MonitoringPage() {
  return (
    <VaultShellLayout
      activeHub="monitoring"
      title="Monitoring - System Audit"
      subtitle="System logs, traces, and audit trail"
    >
      <MonitoringScreen embeddedInLayout />
    </VaultShellLayout>
  );
}
