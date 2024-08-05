"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var readMarkdownFiles = function (dir, filesContent) {
    if (filesContent === void 0) { filesContent = {}; }
    var files = (0, fs_1.readdirSync)(dir);
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var filePath = (0, path_1.join)(dir, file);
        var stat = (0, fs_1.statSync)(filePath);
        if (stat.isDirectory()) {
            readMarkdownFiles(filePath, filesContent);
        }
        else if ((0, path_1.extname)(file) === '.md') {
            var content = (0, fs_1.readFileSync)(filePath, 'utf-8');
            filesContent[filePath] = content;
        }
    }
    return filesContent;
};
exports.default = readMarkdownFiles;
