import { getContractApi } from "../../../_lib/core-api.js";
import { runApi } from "../../../_lib/response.js";

export const runtime = "nodejs";

export async function GET(_request, context) {
  const contractApi = getContractApi();
  return runApi(async () => contractApi.getAgentWorkload(context.params.id));
}
