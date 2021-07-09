import type React from 'react'

interface PageProps {
    state?: Record<string, any>;
    className?: string;
}

declare const Page: React.FC<PageProps>

export = Page
