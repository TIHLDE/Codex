import { openaiClient } from "./client";


const embeddContent = async (content: string): Promise<number[]> => {
    const response = await openaiClient.embeddings.create({
        model: 'text-embedding-3-small',
        input: content
    })

    return response.data[0].embedding;
};


export default embeddContent;