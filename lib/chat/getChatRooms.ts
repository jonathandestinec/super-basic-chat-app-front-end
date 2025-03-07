export default async function getChatRooms(loginInfo: Me) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/chat-rooms`, {
        headers: {
            Authorization: `Bearer ${loginInfo.token}`
        }
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