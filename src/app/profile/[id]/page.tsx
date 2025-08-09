'use client';

import { useParams } from "next/navigation";
import React from "react";

const SomeOneProfile = () => {
     const params = useParams<{ id: string }>();
    console.log(params);
    return <div>someone profile</div>;
};

export default SomeOneProfile;
