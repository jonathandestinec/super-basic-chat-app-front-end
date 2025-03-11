"use client"

export const storeUser = async (user: Me) => {
    // Store user in LocalStorage
    localStorage.setItem("me", JSON.stringify(user))
}