#!/usr/bin/env node

/**
 * استيراد البيانات من ملفات MarkDown إلى Convex
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// قراءة ملفات البيانات
const dataExportDir = path.join(__dirname, '..', 'Aqraply_Data_Export');

console.log(`📁 البحث عن البيانات في: ${dataExportDir}`);
console.log(`📁 الملفات الموجودة:`, fs.readdirSync(dataExportDir));

function parseMarkdownTable(content) {
  const lines = content.split('\n');
  const tableStart = lines.findIndex(line => line.includes('|'));
  
  if (tableStart === -1) return [];
  
  const headers = lines[tableStart]
    .split('|')
    .map(h => h.trim())
    .filter(h => h);
  
  // تخطي سطر الفاصل
  const dataStart = tableStart + 2;
  const data = [];
  
  for (let i = dataStart; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || !line.includes('|')) break;
    
    const values = line
      .split('|')
      .map(v => v.trim())
      .filter((v, idx) => idx > 0 && idx <= headers.length);
    
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx];
      });
      data.push(row);
    }
  }
  
  return data;
}

// قراءة البيانات من الملفات
function loadDataFromMarkdown() {
  const usersFile = path.join(dataExportDir, '01_Users_المستخدمين.md');
  const storesFile = path.join(dataExportDir, '02_Stores_المتاجر.md');
  const captainsFile = path.join(dataExportDir, '03_Captains_الكباتن.md');
  const ordersFile = path.join(dataExportDir, '04_Orders_الطلبات.md');
  const walletsFile = path.join(dataExportDir, '05_Wallets_المحافظ.md');
  const reviewsFile = path.join(dataExportDir, '06_Reviews_المراجعات.md');

  const data = {};

  try {
    if (fs.existsSync(usersFile)) {
      const content = fs.readFileSync(usersFile, 'utf8');
      data.users = parseMarkdownTable(content);
      console.log(`✅ تم قراءة ${data.users.length} مستخدم`);
    }
  } catch (e) {
    console.error('❌ خطأ في قراءة ملف المستخدمين:', e.message);
  }

  try {
    if (fs.existsSync(storesFile)) {
      const content = fs.readFileSync(storesFile, 'utf8');
      data.stores = parseMarkdownTable(content);
      console.log(`✅ تم قراءة ${data.stores.length} متجر`);
    }
  } catch (e) {
    console.error('❌ خطأ في قراءة ملف المتاجر:', e.message);
  }

  try {
    if (fs.existsSync(captainsFile)) {
      const content = fs.readFileSync(captainsFile, 'utf8');
      data.captains = parseMarkdownTable(content);
      console.log(`✅ تم قراءة ${data.captains.length} كابتن`);
    }
  } catch (e) {
    console.error('❌ خطأ في قراءة ملف الكباتن:', e.message);
  }

  try {
    if (fs.existsSync(ordersFile)) {
      const content = fs.readFileSync(ordersFile, 'utf8');
      data.orders = parseMarkdownTable(content);
      console.log(`✅ تم قراءة ${data.orders.length} طلب`);
    }
  } catch (e) {
    console.error('❌ خطأ في قراءة ملف الطلبات:', e.message);
  }

  try {
    if (fs.existsSync(walletsFile)) {
      const content = fs.readFileSync(walletsFile, 'utf8');
      data.wallets = parseMarkdownTable(content);
      console.log(`✅ تم قراءة ${data.wallets.length} محفظة`);
    }
  } catch (e) {
    console.error('❌ خطأ في قراءة ملف المحافظ:', e.message);
  }

  try {
    if (fs.existsSync(reviewsFile)) {
      const content = fs.readFileSync(reviewsFile, 'utf8');
      data.reviews = parseMarkdownTable(content);
      console.log(`✅ تم قراءة ${data.reviews.length} مراجعة`);
    }
  } catch (e) {
    console.error('❌ خطأ في قراءة ملف المراجعات:', e.message);
  }

  return data;
}

// تصدير البيانات كـ JSON
const data = loadDataFromMarkdown();
const outputFile = path.join(__dirname, 'imported_data.json');
fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf8');

console.log(`\n📊 تم حفظ البيانات في: ${outputFile}`);
console.log('\nملخص البيانات المستوردة:');
Object.entries(data).forEach(([key, values]) => {
  console.log(`  - ${key}: ${values.length} سجل`);
});
