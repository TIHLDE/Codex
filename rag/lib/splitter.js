"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var splitContent = function (content, tokenSize, overlap) {
    if (tokenSize === void 0) { tokenSize = 200; }
    if (overlap === void 0) { overlap = 50; }
    var text = content.replace(/\n/g, ' ');
    var words = text.split(/\s+/);
    var sections = [];
    for (var i = 0; i < words.length; i += (tokenSize - overlap)) {
        var section = words.slice(i, i + tokenSize).join(' ');
        sections.push(section);
        // Break if the next section would be less than tokenSize - overlap in size
        if (i + tokenSize >= words.length) {
            break;
        }
    }
    return sections;
};
exports.default = splitContent;
