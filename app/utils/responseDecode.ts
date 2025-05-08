
export async function DecodeBody(response: Response): Promise<string> {
    return response.text().then((text) => {
        const decoder = new TextDecoder("utf-8");
        return decoder.decode(new Uint8Array(text.split("").map((c) => c.charCodeAt(0))));
    });
}