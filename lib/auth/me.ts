"use server"
import { cookies } from "next/headers"

export default async function me() {
    const cookieStore = await cookies();
    cookieStore.getAll();

    const me = cookieStore.get("me")?.value

    if (!me) {
        return null
    }

    const loginInfo: Me = JSON.parse(me)

    // verifyToken
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/verify-token/${loginInfo.token}`)

    if (!res.ok) {
        return null
    }

    return loginInfo
}
