import type React from 'react'

declare const Head: React.ComponentType<{}> & {
    peek: () => void;
    rewind: () => string[];
}

export = Head
