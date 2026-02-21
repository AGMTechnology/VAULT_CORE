import { getContractApi, readJson } from "../../../_lib/core-api.js";
import { runApi } from "../../../_lib/response.js";

export const runtime = "nodejs";

export async function GET(_request, context) {
  const contractApi = getContractApi();
  return runApi(async () => contractApi.getExecutionPackage(context.params.id));
}

export async function POST(request, context) {
  const contractApi = getContractApi();
  return runApi(async () => {
    const payload = await readJson(request);
    return contractApi.postExecutionPackage(context.params.id, payload);
  });
}
