import { NextRequest, NextResponse } from "next/server";
import ollama from "ollama";

export async function POST(request: NextRequest) {
  try {
    const {prompt} = await request.json();
    const response = await ollama.chat({
      model: "llama3.2:3b",
      messages: [{ role: "user", content: prompt }],
    });
    console.log(response.message.content);
    return NextResponse.json({
        success: true,
        output: response.message.content,
    })
  } catch (error: any) {
    NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
