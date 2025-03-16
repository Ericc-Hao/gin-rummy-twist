import { useState,useEffect, useRef } from 'react';

const backend_url = process.env.BACKEND_URL || "https://backend.ginrummys.ca";



export default function MatchFormation(){
    
    const [matchID, setMatchID] = useState<string | null>(null)
    if (matchID == null){create_room()}
    
    async function create_room(){
            console.log("aisudgaiusdghia")
            await fetch(`${backend_url}/api/match_create`, {
                    method: "GET",
                    headers: {
                    "Content-Type": "application/json",
                    },
                })
                .then((response) => response.json())
                .then((data) => {
                    setMatchID(data["match_id"])
                    }
                )
        }
    return (
        <div className="px-2 py-1 flex flex-row items-center rounded-lg bg-gray-300 text-gray-700 shadow-xl bg-opacity-60 mt-4">
            <div className="flex items-center space-x-2">
                <span>{matchID}</span>
            </div>
        </div>
    )
}
