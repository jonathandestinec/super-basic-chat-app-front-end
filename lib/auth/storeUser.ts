"use server"

import { cookies } from "next/headers"

export const storeUser = async (user: Me) => {
    const cookieStore = await cookies()
    cookieStore.set({
        name: "me",
        value: JSON.stringify(user),
        path: "/",
        maxAge: 60 * 60 * 24 * 7
    })
}