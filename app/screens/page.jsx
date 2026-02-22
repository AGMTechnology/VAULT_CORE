import {
  ContractScreen,
  DashboardScreen,
  ExecutionScreen,
  LearningScreen,
  MonitoringScreen
} from "../../src/screens";

export default function ScreensPage() {
  return (
    <div>
      <DashboardScreen />
      <ExecutionScreen />
      <ContractScreen />
      <MonitoringScreen />
      <LearningScreen />
    </div>
  );
}
