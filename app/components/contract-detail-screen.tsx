"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GitBranch } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  ContractCard,
  MemoryViewer,
  Stack,
  Text
} from "../../design-system/components";
import { toContractCardViewModel } from "./workspace-adapter";
import { ContractScreenShell } from "./contract-screen-shell";

type MemorySourceEntry = {
  readonly id?: string;
  readonly lessonCategory?: string;
  readonly content?: string;
};

type ContractDetail = {
  readonly meta?: {
    readonly contractId?: string;
  };
  readonly lifecycleState?: string;
  readonly scope?: {
    readonly title?: string;
    readonly summary?: string;
    readonly dependencies?: ReadonlyArray<string>;
  };
  readonly memoryContext?: {
    readonly entries?: ReadonlyArray<MemorySourceEntry>;
  };
  readonly acceptance?: ReadonlyArray<string>;
  readonly testPlan?: ReadonlyArray<string>;
};

type ContractDetailScreenProps = {
  readonly contractId: string;
  readonly embeddedInLayout?: boolean;
};

function toMemoryType(category: string | undefined): "lesson" | "rule" | "skill" | "context" {
  if (category === "success") return "lesson";
  if (category === "decision") return "rule";
  if (category === "constraint") return "skill";
  return "context";
}

function fallbackCriteria(criteria: ReadonlyArray<{ readonly text: string; readonly done: boolean }>) {
  if (criteria.length > 0) return criteria;
  return [{ text: "No acceptance criteria defined.", done: false }];
}

function withShell(
  content: ReactNode,
  breadcrumb: string,
  embeddedInLayout: boolean
) {
  if (embeddedInLayout) {
    return <div className="vc-contract-shell-body">{content}</div>;
  }

  return <ContractScreenShell breadcrumb={breadcrumb}>{content}</ContractScreenShell>;
}

export function ContractDetailScreen({ contractId, embeddedInLayout = false }: ContractDetailScreenProps) {
  const router = useRouter();
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadContract = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/contracts/${encodeURIComponent(contractId)}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to load contract.");
      }
      setContract(payload?.contract ?? null);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Unable to load contract.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    loadContract();
  }, [loadContract]);

  const viewModel = useMemo(() => (contract ? toContractCardViewModel(contract) : null), [contract]);

  const memoryEntries = useMemo(() => {
    const entries = contract?.memoryContext?.entries ?? [];
    return entries.slice(0, 6).map((entry, index) => ({
      id: String(entry.id || `${contractId}-${index}`),
      type: toMemoryType(entry.lessonCategory),
      title: entry.content || "Context entry",
      source: entry.id ? `memory:${entry.id}` : "memory-hub",
      timestamp: "injected",
      relevance: Math.max(55, 92 - (index * 8))
    }));
  }, [contract, contractId]);

  const dependencies = contract?.scope?.dependencies ?? [];
  const contractTitle = contract?.scope?.title || contractId;
  const breadcrumb = `Contract - ${contractTitle}`;

  if (loading) {
    return withShell(
      <div className="vc-contract-screen-feedback">
        <Card className="vc-contract-screen-feedback-card">
          <Text as="h3" size="xl">Loading contract</Text>
          <Text size="sm" tone="muted">Retrieving contract detail and context memory.</Text>
        </Card>
      </div>,
      breadcrumb,
      embeddedInLayout
    );
  }

  if (error) {
    return withShell(
      <div className="vc-contract-screen-feedback">
        <Card className="vc-contract-screen-feedback-card">
          <Text as="h3" size="xl" tone="error">Unable to load contract</Text>
          <Text size="sm" tone="muted">{error}</Text>
          <Stack direction="row" gap="2">
            <Button onClick={() => router.push("/contracts")}>Back</Button>
            <Button tone="primary" onClick={loadContract}>Retry</Button>
          </Stack>
        </Card>
      </div>,
      breadcrumb,
      embeddedInLayout
    );
  }

  if (!contract || !viewModel) {
    return withShell(
      <div className="vc-contract-screen-feedback">
        <Card className="vc-contract-screen-feedback-card">
          <Text as="h3" size="xl">Contract not found</Text>
          <Text size="sm" tone="muted">The selected contract is unavailable.</Text>
          <Button tone="primary" onClick={() => router.push("/contracts")}>Back to Browser</Button>
        </Card>
      </div>,
      breadcrumb,
      embeddedInLayout
    );
  }

  return withShell(
    <div className="vc-contract-detail-screen">
      <section className="vc-contract-detail-main">
        <ContractCard
          contractId={viewModel.contractId}
          title={contract.scope?.title || viewModel.contractId}
          summary={contract.scope?.summary || "No scope summary available for this contract."}
          criteria={fallbackCriteria(viewModel.criteria)}
          dependenciesCount={viewModel.dependenciesCount}
          testsDone={viewModel.testsDone}
          testsTotal={viewModel.testsTotal}
          statusLabel={viewModel.status.label}
          statusTone={viewModel.status.tone}
        />
      </section>

      <aside className="vc-contract-detail-side">
        {memoryEntries.length > 0 ? (
          <MemoryViewer entries={memoryEntries} />
        ) : (
          <Card className="vc-contract-detail-empty-panel">
            <Text as="h3" size="2xl">No context memory</Text>
            <Text size="md" tone="muted">This contract has no injected memory entries yet.</Text>
          </Card>
        )}

        <Card className="vc-contract-deps-card">
          <Text size="2xs" tone="soft" uppercase>DEPENDENCIES</Text>
          {dependencies.length > 0 ? (
            <div className="vc-contract-deps-list">
              {dependencies.map((dependency) => (
                <Badge key={dependency} tone="primary" mono className="vc-contract-dependency-chip">
                  <GitBranch size={12} strokeWidth={1.75} aria-hidden="true" />
                  {dependency}
                </Badge>
              ))}
            </div>
          ) : (
            <Text size="md" tone="muted">No dependencies linked to this contract.</Text>
          )}
        </Card>
      </aside>
    </div>,
    breadcrumb,
    embeddedInLayout
  );
}
