type ContractLifecycleState = "intake" | "qualification" | "enrichment" | "validation" | "publication" | string;

export const NEXT_STATE: Record<string, string | undefined> = {
  intake: "qualification",
  qualification: "enrichment",
  enrichment: "validation",
  validation: "publication"
};

const CONTRACT_STATE_PROGRESS: Record<string, number> = {
  intake: 0.2,
  qualification: 0.35,
  enrichment: 0.55,
  validation: 0.75,
  publication: 1
};

export function getContractStatusBadge(lifecycleState: ContractLifecycleState): {
  label: "COMPLETED" | "ACTIVE" | "PENDING";
  tone: "success" | "primary" | "neutral";
} {
  if (lifecycleState === "publication") return { label: "COMPLETED", tone: "success" };
  if (lifecycleState === "validation" || lifecycleState === "enrichment") return { label: "ACTIVE", tone: "primary" };
  return { label: "PENDING", tone: "neutral" };
}

export function getContractProgress(lifecycleState: ContractLifecycleState): number {
  return CONTRACT_STATE_PROGRESS[lifecycleState] ?? 0.2;
}

export function toContractCardViewModel(contract: any) {
  const contractId = contract?.meta?.contractId || "unknown";
  const nextState = NEXT_STATE[contract?.lifecycleState];
  const progress = getContractProgress(contract?.lifecycleState);
  const acceptance = Array.isArray(contract?.acceptance) ? contract.acceptance : [];
  const completedAcceptance = Math.min(acceptance.length, Math.round(acceptance.length * progress));
  const dependenciesCount = Array.isArray(contract?.scope?.dependencies) ? contract.scope.dependencies.length : 0;
  const testsTotal = Array.isArray(contract?.testPlan) ? contract.testPlan.length : 0;
  const testsDone = Math.min(testsTotal, Math.round(testsTotal * progress));
  const status = getContractStatusBadge(contract?.lifecycleState);
  const criteria = acceptance.map((criterion: string, index: number) => ({
    text: criterion,
    done: index < completedAcceptance
  }));

  return {
    contractId,
    nextState,
    testsTotal,
    testsDone,
    dependenciesCount,
    status,
    criteria
  };
}
