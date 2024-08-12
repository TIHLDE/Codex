

const splitContent = (content: string, tokenSize: number = 200, overlap: number = 50): string[] => {
    // const text = content.replace(/\n/g, ' ');
    // const words = text.split(/\s+/);
    // const sections: string[] = [];

    // for (let i = 0; i < words.length; i += (tokenSize - overlap)) {
    //     const section = words.slice(i, i + tokenSize).join(' ');
    //     sections.push(section);
    
    //     // Break if the next section would be less than tokenSize - overlap in size
    //     if (i + tokenSize >= words.length) {
    //       break;
    //     }
    //   }
    
    // return sections;
    const text = content.replace(/\n/g, ' ');
    const words = text.split(/\s+/);
    const sections: string[] = [];
    let inCodeBlock = false;

    for (let i = 0; i < words.length; i += (tokenSize - overlap)) {
        let sectionWords = [];
        let sectionLength = 0;
        let j = i;

        while (j < words.length && sectionLength < tokenSize) {
            const word = words[j];
            sectionWords.push(word);
            sectionLength++;
            
            if (word.includes('```')) {
                inCodeBlock = !inCodeBlock;
            }

            if (sectionLength >= tokenSize && inCodeBlock) {
                sectionLength--; // Continue adding words if in code block
            } else if (sectionLength >= tokenSize && !inCodeBlock) {
                break;
            }
            j++;
        }

        sections.push(sectionWords.join(' '));

        // Break if the next section would be less than tokenSize - overlap in size
        if (j + tokenSize >= words.length) {
            break;
        }
    }

    return sections;
};


export default splitContent;