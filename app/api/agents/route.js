import { getContractApi, normalizeQuery, readJson } from "../_lib/core-api.js";
import { runApi } from "../_lib/response.js";

export const runtime = "nodejs";

export async function GET(request) {
  const contractApi = getContractApi();
  const query = normalizeQuery(request.nextUrl.searchParams);
  return runApi(async () => contractApi.getAgentProfiles(query));
}

export async function POST(request) {
  const contractApi = getContractApi();
  return runApi(async () => {
    const payload = await readJson(request);
    return contractApi.postAgentProfile(payload);
  });
}
