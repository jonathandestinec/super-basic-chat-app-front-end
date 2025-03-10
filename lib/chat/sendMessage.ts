import ME from "@/lib/auth/me";

export const sendMessage = async (loginInfo: Me, chatId: string, message: string) => {

    const me = await ME();

    if (!me) {
        return null
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

    const response = await fetch(`${apiUrl}/api/message/${chatId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${me.token}`
        },
        body: JSON.stringify({
            text: message
        }),
        credentials: "include"
    })

    const data = await response.json()

    if (!response.ok) {
        return null
    }

    return data as Message
}