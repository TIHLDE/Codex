"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var splitContent = function (content, tokenSize, overlap) {
    // const text = content.replace(/\n/g, ' ');
    // const words = text.split(/\s+/);
    // const sections: string[] = [];
    if (tokenSize === void 0) { tokenSize = 200; }
    if (overlap === void 0) { overlap = 50; }
    // for (let i = 0; i < words.length; i += (tokenSize - overlap)) {
    //     const section = words.slice(i, i + tokenSize).join(' ');
    //     sections.push(section);
    //     // Break if the next section would be less than tokenSize - overlap in size
    //     if (i + tokenSize >= words.length) {
    //       break;
    //     }
    //   }
    // return sections;
    var text = content.replace(/\n/g, ' ');
    var words = text.split(/\s+/);
    var sections = [];
    var inCodeBlock = false;
    for (var i = 0; i < words.length; i += (tokenSize - overlap)) {
        var sectionWords = [];
        var sectionLength = 0;
        var j = i;
        while (j < words.length && sectionLength < tokenSize) {
            var word = words[j];
            sectionWords.push(word);
            sectionLength++;
            if (word.includes('```')) {
                inCodeBlock = !inCodeBlock;
            }
            if (sectionLength >= tokenSize && inCodeBlock) {
                sectionLength--; // Continue adding words if in code block
            }
            else if (sectionLength >= tokenSize && !inCodeBlock) {
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
exports.default = splitContent;
