import ME from "../auth/me";

export default async function fetchUser(userId: string) {

    const me = await ME();

    if (!me) {
        return null;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
    const response = await fetch(`${apiUrl}/api/user/${userId}`, {
        headers: {
            Authorization: `Bearer ${me.token}`
        }
    });
    const data = await response.json();

    if (!response.ok) {
        return null
    }


    return data as User;
}