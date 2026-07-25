#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, 'imported_data.json');
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// تحويل بيانات المستخدمين
if (data.users && Array.isArray(data.users)) {
  const usersData = data.users.map(user => ({
    email: user['البريد الإلكتروني'] || '',
    phone: user['رقم الموبايل'] || '',
    name: user['الاسم'] || '',
    isAnonymous: false,
    password: 'placeholder_hashed_password'
  }));

  const outputFile = path.join(__dirname, 'users-final.jsonl');
  fs.writeFileSync(outputFile, usersData.map(u => JSON.stringify(u)).join('\n'), 'utf8');
  console.log(`✅ تم إنشاء users-final.jsonl (${usersData.length} سجل)`);
}

// تحويل بيانات المتاجر
if (data.stores && Array.isArray(data.stores)) {
  const storesData = data.stores.map(store => ({
    name: store['اسم المتجر'] || '',
    nameAr: store['اسم المتجر'] || '',
    description: 'متجر رائع',
    descriptionAr: 'متجر رائع',
    category: 'عام',
    ownerId: 'temp_owner_id', // سيتم تحديثه لاحقاً
    location: {
      address: store['العنوان الكامل'] || '',
      addressAr: store['العنوان الكامل'] || '',
      latitude: 30.0444,
      longitude: 31.2357
    },
    rating: 4.5,
    minOrderAmount: 50,
    deliveryFee: 20,
    estimatedDeliveryTime: 30,
    isActive: true,
    isOnline: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }));

  const outputFile = path.join(__dirname, 'stores-final.jsonl');
  fs.writeFileSync(outputFile, storesData.map(s => JSON.stringify(s)).join('\n'), 'utf8');
  console.log(`✅ تم إنشاء stores-final.jsonl (${storesData.length} سجل)`);
}

console.log('\n✨ اكتمل إعداد البيانات النهائية للاستيراد');
