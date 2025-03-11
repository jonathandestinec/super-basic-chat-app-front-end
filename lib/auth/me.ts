"use client"

export default async function me() {

    // Get me from localStorage
    const me = localStorage.getItem("me")

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
