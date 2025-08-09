'use client';

import { useParams } from "next/navigation";
import React from "react";

const page = () => {
     const params = useParams<{ id: string }>();
    console.log(params);
    return <div>someone profile</div>;
};

export default page;
