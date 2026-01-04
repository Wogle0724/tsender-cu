/**
 * Calculates the total from a newline-separated string of numbers.
 * Example input:
 * "100\n200\n300"
 */
export function calculateTotal(amounts: string): number {
    if (!amounts || typeof amounts !== "string") {
        return 0;
    }

    const numbers = amounts
        .split(/(?:\r?\n|,)+/) // split by commas or newlines (handles CRLF)
        .map(amt => amt.trim())
        .filter(amt => amt.length > 0)
        .map(amt => parseFloat(amt))
        .filter(num => !isNaN(num));

    return numbers.reduce((acc, curr) => acc + curr, 0);
}
