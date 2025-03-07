import me from "@/lib/auth/me";
import React from "react";

export default function useUser() {
    const [loginInfo, setLoginInfo] = React.useState<Me | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);

        me()
            .then((me) => {
                console.log(me);

                if (!me) {
                    setLoginInfo(null);
                }

                setLoginInfo(me);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return {
        loginInfo,
        isLoading
    }
}