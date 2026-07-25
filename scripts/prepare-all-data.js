#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, 'imported_data.json');
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// ===== 1. تحويل بيانات الكباتن إلى Profiles =====
if (data.captains && Array.isArray(data.captains)) {
  const captainsData = data.captains.map(captain => ({
    userId: 'temp_user_id',
    role: 'captain',
    fullName: captain['الاسم'] || captain['الكابتن'] || '',
    phone: captain['رقم الموبايل'] || captain['phone'] || '',
    phoneVerified: true,
    email: captain['البريد الإلكتروني'] || '',
    isActive: true,
    isOnline: true,
    lastSeen: Date.now(),
    registrationDate: Date.now(),
    isSuspended: false,
    location: {
      address: captain['منطقة التغطية'] || 'Cairo',
      addressAr: captain['منطقة التغطية'] || 'القاهرة',
      latitude: 30.0444,
      longitude: 31.2357
    }
  }));

  const outputFile = path.join(__dirname, 'captains-final.jsonl');
  fs.writeFileSync(outputFile, captainsData.map(c => JSON.stringify(c)).join('\n'), 'utf8');
  console.log(`✅ 1️⃣ تم إنشاء captains-final.jsonl (${captainsData.length} سجل)`);
}

// ===== 2. تحويل بيانات الطلبات =====
if (data.orders && Array.isArray(data.orders)) {
  const ordersData = data.orders.map(order => ({
    customerId: 'temp_customer_id',
    storeId: 'temp_store_id',
    captainId: 'temp_captain_id',
    items: [],
    totalAmount: parseFloat(order['المجموع'] || order['total'] || '0') || 0,
    deliveryFee: 20,
    status: 'pending',
    customerLocation: {
      address: order['عنوان التسليم'] || order['address'] || '',
      addressAr: order['عنوان التسليم'] || order['address'] || '',
      latitude: 30.0444,
      longitude: 31.2357
    },
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }));

  const outputFile = path.join(__dirname, 'orders-final.jsonl');
  fs.writeFileSync(outputFile, ordersData.map(o => JSON.stringify(o)).join('\n'), 'utf8');
  console.log(`✅ 2️⃣ تم إنشاء orders-final.jsonl (${ordersData.length} سجل)`);
}

// ===== 3. تحويل بيانات المحافظ =====
if (data.wallets && Array.isArray(data.wallets)) {
  const walletsData = data.wallets.map(wallet => ({
    userId: 'temp_user_id',
    type: wallet['نوع المحفظة'] || 'customer',
    balance: parseFloat(wallet['الرصيد'] || wallet['balance'] || '0') || 0,
    currency: 'EGP',
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }));

  const outputFile = path.join(__dirname, 'wallets-final.jsonl');
  fs.writeFileSync(outputFile, walletsData.map(w => JSON.stringify(w)).join('\n'), 'utf8');
  console.log(`✅ 3️⃣ تم إنشاء wallets-final.jsonl (${walletsData.length} سجل)`);
}

// ===== 4. تحويل بيانات المراجعات =====
if (data.reviews && Array.isArray(data.reviews)) {
  const reviewsData = data.reviews.map(review => ({
    customerId: 'temp_customer_id',
    storeId: 'temp_store_id',
    orderId: 'temp_order_id',
    rating: parseFloat(review['التقييم'] || review['rating'] || '5') || 5,
    comment: review['التعليق'] || review['comment'] || '',
    createdAt: Date.now()
  }));

  const outputFile = path.join(__dirname, 'reviews-final.jsonl');
  fs.writeFileSync(outputFile, reviewsData.map(r => JSON.stringify(r)).join('\n'), 'utf8');
  console.log(`✅ 4️⃣ تم إنشاء reviews-final.jsonl (${reviewsData.length} سجل)`);
}

console.log('\n✨ اكتمل إعداد جميع البيانات للاستيراد بنجاح');
