#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// الحصول على user IDs الفعلية
async function createCustomerProfiles() {
  try {
    // قراءة بيانات المستخدمين الأصلية
    const dataFile = path.join(__dirname, 'imported_data.json');
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

    // قراءة ملف البيانات المستوردة لمعرفة IDs
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    const { stdout } = await execAsync(
      'npx convex data users --format=jsonl',
      { 
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, AUTH_SECRET: 'aaabbbcccdddeeefff0011223344556677889900aabbccddeeff00112233' }
      }
    );

    // بناء خريطة الهواتف إلى user IDs
    const phoneToUserId = {};
    const userIdList = [];
    
    for (const line of stdout.trim().split('\n')) {
      if (line.trim()) {
        const user = JSON.parse(line);
        phoneToUserId[user.phone] = user._id;
        userIdList.push(user._id);
      }
    }

    console.log(`✅ تم الحصول على ${userIdList.length} user IDs`);

    // إنشاء profiles للعملاء من بيانات المستخدمين
    if (data.users && Array.isArray(data.users)) {
      const customersData = data.users.map(user => {
        const userPhone = user['رقم الموبايل'] || user['phone'] || '';
        const userId = phoneToUserId[userPhone];
        
        if (!userId) {
          console.warn(`⚠️ لم نجد user ID للهاتف: ${userPhone}`);
        }

        return {
          userId: userId || userIdList[0], // fallback
          role: 'customer',
          fullName: user['الاسم'] || user['name'] || 'Unknown',
          phone: userPhone,
          phoneVerified: true,
          email: user['البريد الإلكتروني'] || user['email'] || '',
          isActive: true,
          isOnline: false,
          lastSeen: Date.now(),
          registrationDate: Date.now(),
          isSuspended: false,
          location: {
            address: user['العنوان'] || user['address'] || 'Cairo',
            addressAr: user['العنوان'] || user['address'] || 'القاهرة',
            latitude: 30.0444,
            longitude: 31.2357
          }
        };
      });

      const outputFile = path.join(__dirname, 'customers-profiles.jsonl');
      fs.writeFileSync(outputFile, customersData.map(c => JSON.stringify(c)).join('\n'), 'utf8');
      console.log(`✅ تم إعداد customers-profiles.jsonl (${customersData.length} سجل)`);
    }

  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
}

createCustomerProfiles();
