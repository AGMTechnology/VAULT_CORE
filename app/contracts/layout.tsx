import type { ReactNode } from "react";
import { ContractsSegmentShell } from "../components/contracts-segment-shell";

type ContractsLayoutProps = {
  readonly children: ReactNode;
};

export default function ContractsLayout({ children }: ContractsLayoutProps) {
  return <ContractsSegmentShell>{children}</ContractsSegmentShell>;
}

