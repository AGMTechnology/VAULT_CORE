import { NextResponse } from "next/server";

import { getContractApi } from "../_lib/core-api.js";

export const runtime = "nodejs";

function toTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function aggregateRules(contracts) {
  const byRuleId = new Map();
  for (const contract of contracts) {
    const rules = Array.isArray(contract?.rulesBundle?.rules) ? contract.rulesBundle.rules : [];
    for (const rule of rules) {
      const ruleId = toTrimmedString(rule?.ruleId);
      if (!ruleId || byRuleId.has(ruleId)) {
        continue;
      }
      byRuleId.set(ruleId, {
        ruleId,
        severity: toTrimmedString(rule?.severity) || "blocker",
        description: toTrimmedString(rule?.description) || "",
      });
    }
  }
  return Array.from(byRuleId.values()).sort((left, right) => left.ruleId.localeCompare(right.ruleId));
}

export async function GET(request) {
  const contractApi = getContractApi();
  try {
    const contractId = request.nextUrl.searchParams.get("contractId");
    if (contractId) {
      const contractResponse = await contractApi.getContract(contractId);
      return NextResponse.json(
        {
          rules: contractResponse.status === 200 ? aggregateRules([contractResponse.body.contract]) : [],
          qualityGates: contractResponse.body?.contract?.qualityGates || {},
        },
        { status: 200 },
      );
    }

    const contractsResponse = await contractApi.getContracts();
    const contracts = Array.isArray(contractsResponse.body?.contracts) ? contractsResponse.body.contracts : [];
    return NextResponse.json(
      {
        rules: aggregateRules(contracts),
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected API error",
        details: [String(error?.message || "unknown")],
      },
      { status: 500 },
    );
  }
}
