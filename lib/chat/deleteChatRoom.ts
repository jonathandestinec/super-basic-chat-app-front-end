export default async function deleteChatRoom(chatId: string, loginInfo: Me) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

    console.log("Deleting...", chatId)

    const response = await fetch(`${apiUrl}/api/chat/${chatId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginInfo.token}`
        },
        credentials: "include"
    })

    if (!response.ok) {
        return null
    }

    return await response.json() as Chat
}