function trimString(string: string, maxLength: number): string {
    return string.length > maxLength ? `${string.substring(0, maxLength)}...` : string;
};

export { trimString };