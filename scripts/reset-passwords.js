#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// دالة لـ hash كلمة المرور (نفس الطريقة التي يستخدمها Convex Auth)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// البيانات الأصلية
const dataFile = path.join(__dirname, 'imported_data.json');
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// إنشاء ملف تحديث كلمات المرور
if (data.users && Array.isArray(data.users)) {
  const updates = data.users
    .filter(u => u['البريد الإلكتروني'] || u.email)
    .map(user => ({
      email: user['البريد الإلكتروني'] || user.email || '',
      password: 'Password123!', // كلمة مرور موحدة سهلة
      hashedPassword: hashPassword('Password123!')
    }))
    .filter(u => u.email);

  console.log('📧 قائمة الإيميلات وكلمات المرور الجديدة:');
  console.log('');
  console.log('البريد الإلكتروني                     | كلمة المرور');
  console.log(''.padEnd(80, '='));
  
  updates.forEach(u => {
    console.log(`${u.email.padEnd(35)} | ${u.password}`);
  });

  console.log(''.padEnd(80, '='));
  console.log(`\n✅ إجمالي المستخدمين: ${updates.length}`);
  console.log('\n💡 يمكنك الآن تسجيل الدخول باستخدام أي من الإيميلات أعلاه');
  console.log('   وكلمة المرور: Password123!');

  // حفظ قائمة كلمات المرور
  const outputFile = path.join(__dirname, 'login-credentials.txt');
  const content = [
    '🔐 بيانات تسجيل الدخول لجميع المستخدمين',
    ''.padEnd(80, '='),
    '',
    ...updates.map(u => `📧 ${u.email}\n   🔑 ${u.password}\n`),
    ''.padEnd(80, '='),
    `✅ إجمالي: ${updates.length} مستخدم`
  ].join('\n');

  fs.writeFileSync(outputFile, content, 'utf8');
  console.log(`\n✅ تم حفظ البيانات في: scripts/login-credentials.txt`);
}
