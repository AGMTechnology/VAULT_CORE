import { NextResponse } from "next/server";

function toMessage(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function runApi(action) {
  try {
    const result = await action();
    return NextResponse.json(result.body ?? {}, { status: result.status ?? 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected API error",
        details: [toMessage(error?.message) || "unknown"],
      },
      { status: 500 },
    );
  }
}
