import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try {

    } catch (error: any) {
        console.error("Error: ", error);

        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}