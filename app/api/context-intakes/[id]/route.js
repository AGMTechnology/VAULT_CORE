import { getContextApi } from "../../_lib/core-api.js";
import { runApi } from "../../_lib/response.js";

export const runtime = "nodejs";

export async function GET(_request, context) {
  const contextApi = getContextApi();
  return runApi(async () => contextApi.getContextIntake(context.params.id));
}
