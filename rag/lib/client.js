"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openaiClient = void 0;
require('dotenv').config();
var supabase_js_1 = require("@supabase/supabase-js");
var openai_1 = require("openai");
var SUPBASE_URL = process.env.SUPABASE_URL;
var SUPBASE_KEY = process.env.SUPABASE_KEY;
var OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!SUPBASE_URL || !SUPBASE_KEY || !OPENAI_API_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY or OPENAI_API_KEY');
}
var supaBaseClient = (0, supabase_js_1.createClient)(SUPBASE_URL, SUPBASE_KEY);
exports.openaiClient = new openai_1.default({
    apiKey: OPENAI_API_KEY
});
exports.default = supaBaseClient;
