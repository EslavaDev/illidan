import type React from 'react'

interface ScriptProps {
    src?: string | string[];
}

declare const Script: React.ComponentType<ScriptProps> & {
    peek: () => void;
    rewind: () => { type: string; src: string }[];
}

export = Script
