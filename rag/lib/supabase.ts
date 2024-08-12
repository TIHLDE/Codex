import supaBaseClient from "./client";
import { Section } from "./markdownParser";
import embeddContent from "./openAI";


const uploadSections = async (sections: Section[]) => {
    const { data, error } = await supaBaseClient
        .from('documents')
        .insert({
            url: sections[0].url,
            title: sections[0].title,
            tag: 'docs'
        })
        .select('id');
    
    if (error) {
        console.error('Error inserting document:', error);
        return;
    };

    const documentId = data[0].id;

    for (const section of sections) {
        const embeddedContent = await embeddContent(section.content);
        await supaBaseClient
            .from('sections')
            .insert({
                document_id: documentId,
                content: section.content,
                embedding: embeddedContent
            })
    }
};


export default uploadSections;