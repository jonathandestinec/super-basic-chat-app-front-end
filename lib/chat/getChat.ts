import ME from "../auth/me";

export default async function getChat(roomId: string) {
    const me = await ME();

    if (!me) {
        return {
            _id: "",
            members: [],
            messages: [],
        };
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
    const response = await fetch(`${apiUrl}/api/message/${roomId}`, {
        headers: {
            Authorization: `Bearer ${me.token}`
        }
    });

    if (!response.ok) {
        return {
            _id: "",
            members: [],
            messages: [],
        };
    }

    const data = await response.json();

    return {
        _id: data._id,
        members: data.members,
        messages: data.messages,
    } as Chat;
}