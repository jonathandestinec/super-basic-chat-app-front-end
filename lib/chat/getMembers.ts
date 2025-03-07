import ME from "../auth/me";
import fetchUser from "./fetchUser";

export default async function getMembers(roomId: string) {

    const me = await ME();

    if (!me) {
        return [];
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
    const response = await fetch(`${apiUrl}/api/chat/${roomId}`, {
        headers: {
            Authorization: `Bearer ${me.token}`
        }
    });
    const data = await response.json();

    const membersIds = data.members;

    if (!response.ok) {
        return [];
    }

    // Fetch members info

    const _membersData: User[] = []

    for (const id of membersIds) {
        const memberData = await fetchUser(id);
        if (!memberData) continue
        _membersData.push(memberData as User)
    }
    console.log("_membersData")
    return _membersData;

}