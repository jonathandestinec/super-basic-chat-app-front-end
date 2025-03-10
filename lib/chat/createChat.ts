export default async function createChat(loginInfo: Me, member: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/chat/${member}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${loginInfo.token}`
        }
    })

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message);
    }

    return data;
}