export default async function ME() {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

    const res = await fetch(`${apiUrl}/api/me`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) {
        return null;
    }

    const data = await res.json();

    return data;

}
