import React from "react";

const Authenticated = ({ user }) => (
    <div>
        <h1>Bienvenido, {user.email}</h1>
    </div>
);

export default Authenticated;
