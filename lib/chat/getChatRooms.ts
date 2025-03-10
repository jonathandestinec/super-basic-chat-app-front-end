import ME from "@/lib/auth/me";

export default async function getChatRooms() {

    const me = await ME();

    if (!me) {
        return {
            rooms: [],
            message: "Not logged in",
            error: true
        };
    }

    console.log({ me })

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/chat-rooms`, {
        headers: {
            Authorization: `Bearer ${me.token}`,
        },
        credentials: "include"
    })

    if (!res.ok) {
        return {
            rooms: [],
            message: "Failed to fetch chat rooms",
            error: true
        }
    }

    const rooms: Room[] = await res.json()
    return {
        rooms: rooms,
        message: "",
        error: false
    }
}