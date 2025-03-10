export default async function deleteMessage(messageId: string, loginInfo: Me, chatId: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

    const response = await fetch(`${apiUrl}/api/message/${chatId}?mId=${messageId}`, {
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

    return await response.json() as Message
}