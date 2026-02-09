import { NextRequest, NextResponse } from "next/server";
import axios from 'axios'

function isNotValid(url: string){
    const pattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    if(pattern.test(url)){
        return false;
    }
    else{
        return true;
    }
}

export async function POST(request: NextRequest){
    try {
        const form = await request.formData();
        const url = form.get('url') as string;
        
        if(!url || isNotValid(url)){
            return NextResponse.json(
                { error: 'URL is required and must be valid' },
                { status: 400 }
            )
        }

        // PhishTank API requires application/x-www-form-urlencoded format
        const params = new URLSearchParams();
        params.append('url', url);
        params.append('format', 'json');

        const response = await axios.post(
            "https://checkurl.phishtank.com/checkurl/",
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'phishtank/security-toolkit'
                },
                timeout: 10000 // 10 second
            }
        );

        // Return the PhishTank response
        return NextResponse.json({
            success: true,
            url: url,
            result: response.data
        });

    } catch (error: any) {
        console.error("Error: ", error);
        
        // Handle axios-specific errors
        if (error.response) {
            return NextResponse.json(
                { 
                    error: "PhishTank API error", 
                    details: error.response.data || error.message 
                },
                { status: error.response.status || 500 }
            );
        }
        
        if (error.code === 'ECONNABORTED') {
            return NextResponse.json(
                { error: "Request timeout" },
                { status: 504 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}