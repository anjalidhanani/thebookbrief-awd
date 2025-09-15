export default function extractTextFromHtml(htmlString: string) {
    const regex = /<[^>]*>([^<]*)<\/[^>]*>/g;
    let result = '';
    let match;

    while ((match = regex.exec(htmlString)) !== null) {
        result += match[1].trim() + ' ';
    }

    return result.trim();
}
