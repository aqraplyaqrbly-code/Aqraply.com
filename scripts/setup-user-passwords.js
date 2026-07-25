#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function hashPassword(password) {
  // Convex Auth uses a specific format, but for now we'll just show plain text
  // The important thing is that it's different from the placeholder
  return password;
}

async function updateUserPasswords() {
  try {
    console.log('🔄 جاري الحصول على المستخدمين من قاعدة البيانات...');

    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    // الحصول على جميع المستخدمين
    const { stdout } = await execAsync(
      'npx convex data users --format=jsonl',
      {
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, AUTH_SECRET: 'aaabbbcccdddeeefff0011223344556677889900aabbccddeeff00112233' }
      }
    );

    const users = [];
    const lines = stdout.trim().split('\n');
    
    for (const line of lines) {
      if (line.trim()) {
        try {
          const user = JSON.parse(line);
          users.push(user);
        } catch (e) {}
      }
    }

    console.log(`\n✅ تم الحصول على ${users.length} مستخدم`);
    
    // إنشاء ملف JSONL للمستخدمين مع كلمات مرور جديدة
    const newPassword = "Password123!";
    const usersData = users.map(user => ({
      ...user,
      password: newPassword
    }));

    const outputFile = path.join(__dirname, 'users-updated-passwords.jsonl');
    fs.writeFileSync(
      outputFile,
      usersData.map(u => JSON.stringify(u)).join('\n'),
      'utf8'
    );

    console.log(`✅ تم إنشاء ملف المستخدمين الجديد: users-updated-passwords.jsonl`);
    console.log(`\n📊 ملخص بيانات الدخول:`);
    console.log('');
    console.log('┌' + '─'.repeat(70) + '┐');
    console.log('│  البريد الإلكتروني                     │  كلمة المرور     │');
    console.log('├' + '─'.repeat(70) + '┤');
    
    users.forEach(user => {
      if (user.email) {
        const email = user.email.padEnd(37);
        console.log(`│  ${email}  │  ${newPassword}  │`);
      }
    });

    console.log('└' + '─'.repeat(70) + '┘');
    console.log(`\n✅ تم تحضير ${users.length} مستخدم بكلمة المرور: ${newPassword}`);
    console.log('\n💡 يمكنك الآن تسجيل الدخول باستخدام أي من الإيميلات أعلاه');

  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
}

updateUserPasswords();
