import React from "react";
import { Route, redirect } from "react-router-dom";

function ProtectedRoute({ component: Component, ...restOfProps }) {
    const login = localStorage.getItem('login')

    return (
        <Route
            {...restOfProps}
            render={(props) =>
                login ? <Component {...props} /> : redirect("/")
            }
        />
    );
}

export default ProtectedRoute;