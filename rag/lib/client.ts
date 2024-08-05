require('dotenv').config();

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const SUPBASE_URL = process.env.SUPABASE_URL;
const SUPBASE_KEY = process.env.SUPABASE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SUPBASE_URL || !SUPBASE_KEY || !OPENAI_API_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY or OPENAI_API_KEY');
}

const supaBaseClient = createClient(SUPBASE_URL, SUPBASE_KEY);

export const openaiClient = new OpenAI({
  apiKey: OPENAI_API_KEY
});

export default supaBaseClient;