import { getContractApi, readJson } from "../../../_lib/core-api.js";
import { runApi } from "../../../_lib/response.js";

export const runtime = "nodejs";

export async function POST(request, context) {
  const contractApi = getContractApi();
  return runApi(async () => {
    const payload = await readJson(request);
    return contractApi.postContractTransition(context.params.id, payload);
  });
}
