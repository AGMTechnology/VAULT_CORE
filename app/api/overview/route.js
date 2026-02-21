import { NextResponse } from "next/server";

import { getContractApi } from "../_lib/core-api.js";
import { buildOverview } from "../_lib/overview.js";

export const runtime = "nodejs";

export async function GET() {
  try {
    const payload = await buildOverview(getContractApi());
    return NextResponse.json(payload, { status: 200 });
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
