export default async function addMember(chatId: string, userId: string, loginInfo: Me) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

    const response = await fetch(`${apiUrl}/api/chat/${chatId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginInfo.token}`
        },
        body: JSON.stringify({
            userId
        }),
        credentials: "include"
    })

    if (!response.ok) {
        return null
    }

    return await response.json() as Chat
}