// matchFormation.ts（不再是 React 组件！）
//const backend_url = process.env.BACKEND_URL || "https://backend.ginrummys.ca";
const backend_url = "http://localhost:8080";
export async function createRoom(): Promise<string | null> {
  try {
    const response = await fetch(`${backend_url}/api/match_create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bot: 'False'
      })
    });
    const data = await response.json();
    const matchID = data["match_id"];
    return matchID;
  } catch (err) {
    return null;
  }
}

export interface JoinRoomResponse {
  result: number;
  message: string;
}

export async function joinRoom(matchID: string): Promise<JoinRoomResponse> {
  try {
    const response = await fetch(`${backend_url}/api/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ matchid: matchID })
    });

    const data = await response.json();
    return { result: data.result, message: data.message };
  } catch (err) {
    return { result: -1, message: "Join failed due to network error" };
  }
}

export interface RoomStatusResponse {
  result: number;
  message: string;
}

export async function checkRoomStatus(matchID: string): Promise<RoomStatusResponse> {
  try {
    const response = await fetch(`${backend_url}/api/room_status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ matchid: matchID })
    });
    const data = await response.json();
    return { result: data.result, message: data.message };
  } catch (err) {
    console.error("Failed to check room status", err);
    return { result: -1, message: "Network error" };
  }
}