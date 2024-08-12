"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var splitter_1 = require("./splitter");
var parseTitle = function (content) {
    var titleMatch = content.match(/^---\s*title:\s*(.*?)\s*---/s);
    return titleMatch ? titleMatch[1] : null;
};
var removeTitle = function (content) {
    return content.replace(/^---\s*title:\s*(.*?)\s*---/s, '');
};
var parsePath = function (path) {
    var normalizedPath = path.replace(/\\/g, '/');
    var docsIndex = normalizedPath.indexOf('/docs/');
    if (docsIndex !== -1) {
        var docsPath = normalizedPath.substring(docsIndex + 1);
        var lastSlashIndex = docsPath.lastIndexOf('/');
        if (lastSlashIndex !== -1) {
            docsPath = docsPath.substring(0, lastSlashIndex);
        }
        return docsPath;
    }
    return '';
};
var parseMDFile = function (document) {
    var title = parseTitle(document.content);
    var content = removeTitle(document.content);
    var sections = (0, splitter_1.default)(content);
    var path = parsePath(document.path);
    return sections.map(function (section, index) { return ({
        title: title || path,
        url: path,
        content: section,
        index: index
    }); });
};
exports.default = parseMDFile;
