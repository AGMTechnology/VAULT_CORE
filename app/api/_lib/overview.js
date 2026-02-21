function toTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function buildOverview(contractApi) {
  const [contractsResult, memoryResult, agentsResult, skillsResult, docsResult] = await Promise.all([
    contractApi.getContracts(),
    contractApi.getMemoryEntries({ projectId: "all", limit: 200 }),
    contractApi.getAgentProfiles({}),
    contractApi.getSkillCards({}),
    contractApi.getProjectDocsChecklist({ projectId: "vault-core" }),
  ]);

  const contracts = Array.isArray(contractsResult.body?.contracts) ? contractsResult.body.contracts : [];
  const memoryEntries = Array.isArray(memoryResult.body?.entries) ? memoryResult.body.entries : [];
  const agentProfiles = Array.isArray(agentsResult.body?.profiles) ? agentsResult.body.profiles : [];
  const skillCards = Array.isArray(skillsResult.body?.cards) ? skillsResult.body.cards : [];
  const checklist = docsResult.body?.checklist || { requiredDocs: [], reviewedDocs: [] };
  const requiredDocs = Array.isArray(checklist.requiredDocs) ? checklist.requiredDocs : [];
  const reviewedDocs = Array.isArray(checklist.reviewedDocs) ? checklist.reviewedDocs : [];
  const reviewedSet = new Set(reviewedDocs.map((item) => String(item).toLowerCase()));
  const reviewedCount = requiredDocs.filter((item) => reviewedSet.has(String(item).toLowerCase())).length;
  const docsReviewedRatio = requiredDocs.length > 0 ? `${Math.round((reviewedCount / requiredDocs.length) * 100)}%` : "0%";

  const contractsByState = contracts.reduce((accumulator, contract) => {
    const key = toTrimmedString(contract?.lifecycleState) || "unknown";
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  return {
    metrics: {
      contracts: contracts.length,
      publishedContracts: contracts.filter((item) => item.lifecycleState === "publication").length,
      memoryEntries: memoryEntries.length,
      activeAgents: agentProfiles.filter((item) => toTrimmedString(item.status).toLowerCase() === "active").length,
      skillCards: skillCards.length,
      docsReviewedRatio,
    },
    contractsByState,
    topMemoryLessons: memoryEntries.slice(0, 5).map((entry) => ({
      id: entry.id,
      projectId: entry.projectId,
      featureScope: entry.featureScope,
      taskType: entry.taskType,
      lessonCategory: entry.lessonCategory,
      content: entry.content,
    })),
    latestContracts: contracts.slice(0, 5).map((contract) => ({
      contractId: contract.meta?.contractId,
      title: contract.scope?.title,
      lifecycleState: contract.lifecycleState,
      assignee: contract.meta?.assignee,
      updatedAt: contract.updatedAt,
    })),
    updatedAt: new Date().toISOString(),
  };
}
