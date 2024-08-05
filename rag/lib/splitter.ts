

const splitContent = (content: string, tokenSize: number = 200, overlap: number = 50): string[] => {
    const text = content.replace(/\n/g, ' ');
    const words = text.split(/\s+/);
    const sections: string[] = [];

    for (let i = 0; i < words.length; i += (tokenSize - overlap)) {
        const section = words.slice(i, i + tokenSize).join(' ');
        sections.push(section);
    
        // Break if the next section would be less than tokenSize - overlap in size
        if (i + tokenSize >= words.length) {
          break;
        }
      }
    
    return sections;
};


export default splitContent;