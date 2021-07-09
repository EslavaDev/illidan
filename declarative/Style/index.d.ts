import React from "react";

const Style: React.ComponentType<{ src: string }> & {
    peek: () => void;
    rewind: () => {type: string; src: string}[];
}

export = Style
