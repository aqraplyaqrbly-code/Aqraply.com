#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, 'imported_data.json');
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// إنشاء ملفات JSON منفصلة لكل جدول
Object.entries(data).forEach(([tableName, records]) => {
  if (Array.isArray(records) && records.length > 0) {
    const outputFile = path.join(__dirname, `${tableName}.jsonl`);
    const content = records.map(record => JSON.stringify(record)).join('\n');
    fs.writeFileSync(outputFile, content, 'utf8');
    console.log(`✅ تم إنشاء: ${outputFile} (${records.length} سجل)`);
  }
});

console.log('\n✨ تم إنشاء جميع ملفات الاستيراد بنجاح');
