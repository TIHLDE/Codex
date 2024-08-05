import supaBaseClient, { openaiClient } from "./lib/client";
import embeddContent from "./lib/openAI";


const query = async () => {
    const prompt = 'Hvordan kan jeg finne ut mer om Pablo Escobar?';

    const embeddings = await embeddContent(prompt);

    const { data: documents } = await supaBaseClient.rpc('match_documents_filter', {
        query_embedding: embeddings,
        match_threshold: 0.5,
        match_count: 5,
        filter_tag: 'docs'
    });

    let contextText = ''

    for (let i = 0; i < documents.length; i++) {
        const document = documents[i]
        const content = document.content
    
        contextText += `${content.trim()}\n---\n`
    }

    const LLMPrompt = `
        Du er en veldig engasjert representant for Codex som elsker å hjelpe utviklere! Gitt følgende instrukser fra Codex sin dokumentasjon, svar på spørsmål med kun gitt informasjon. Hvis du er usikker og svaret ikke ligger i dokumentasjonen, svar "Beklager, jeg vet ikke hvordan jeg skal hjelpe med det.".

        Instrukser: ${contextText}

        Spørsmål: """
        ${prompt}
        """

        Svar på norsk og i markdown-format, med relevante kodeblokker hvis det er nødvendig.
    `;

    const completion = await openaiClient.chat.completions.create({
        messages: [
            { role: 'system', content: LLMPrompt },
        ],
        model: 'gpt-4o-mini'
    });

    console.log(completion.choices[0]);
}


query();