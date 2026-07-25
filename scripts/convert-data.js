#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, 'imported_data.json');
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// خريطة تحويل الأسماء العربية إلى الإنجليزية
const fieldMappings = {
  'الاسم': 'name',
  'رقم الموبايل': 'phone',
  'البريد الإلكتروني': 'email',
  'العنوان': 'address',
  'العنوان الكامل': 'address',
  'اسم المتجر': 'storeName',
  'اسم المالك': 'ownerName',
  'الكتب الالكترونية': 'email',
  'الهاتف': 'phone',
};

function transformRecord(record) {
  const transformed = {};
  for (const [key, value] of Object.entries(record)) {
    const newKey = fieldMappings[key] || key;
    transformed[newKey] = value;
  }
  return transformed;
}

// تحويل البيانات
const transformedData = {};
Object.entries(data).forEach(([tableName, records]) => {
  if (Array.isArray(records) && records.length > 0) {
    transformedData[tableName] = records.map(record => 
      typeof record === 'object' ? transformRecord(record) : record
    );
    console.log(`✅ تم تحويل ${tableName}: ${records.length} سجل`);
  }
});

// إنشاء ملفات JSONL جديدة
Object.entries(transformedData).forEach(([tableName, records]) => {
  if (records.length > 0) {
    const outputFile = path.join(__dirname, `${tableName}-converted.jsonl`);
    const content = records.map(record => JSON.stringify(record)).join('\n');
    fs.writeFileSync(outputFile, content, 'utf8');
    console.log(`📄 تم إنشاء: ${tableName}-converted.jsonl`);
  }
});

console.log('\n✨ اكتمل تحويل البيانات بنجاح');
