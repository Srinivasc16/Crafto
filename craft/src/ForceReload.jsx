import React, { useEffect, useState } from "react";
import Home from "./Home";

const HomeWrapper = () => {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const hasReloaded = sessionStorage.getItem("homeReloaded");

        if (!hasReloaded) {
            sessionStorage.setItem("homeReloaded", "true");
            window.location.reload();
        } else {
            setShouldRender(true);
        }
    }, []);

    return shouldRender ? <Home /> : null;
};

export default HomeWrapper;
