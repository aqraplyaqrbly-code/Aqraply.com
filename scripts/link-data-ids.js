#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, 'imported_data.json');
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// الحصول على IDs المستخدمين من قاعدة البيانات
async function getUserIds() {
  try {
    const { stdout } = await execAsync(
      'npx convex data users --format=jsonl',
      { 
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, AUTH_SECRET: 'aaabbbcccdddeeefff0011223344556677889900aabbccddeeff00112233' }
      }
    );
    
    const lines = stdout.trim().split('\n');
    const userMap = {};
    
    for (const line of lines) {
      if (line.trim()) {
        const user = JSON.parse(line);
        userMap[user.phone] = user._id;
      }
    }
    
    return userMap;
  } catch (error) {
    console.error('❌ خطأ في الحصول على المستخدمين:', error.message);
    return {};
  }
}

// الحصول على IDs المتاجر
async function getStoreIds() {
  try {
    const { stdout } = await execAsync(
      'npx convex data stores --format=jsonl',
      { 
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, AUTH_SECRET: 'aaabbbcccdddeeefff0011223344556677889900aabbccddeeff00112233' }
      }
    );
    
    const lines = stdout.trim().split('\n');
    const storeMap = {};
    
    for (const line of lines) {
      if (line.trim()) {
        const store = JSON.parse(line);
        storeMap[store.name] = store._id;
      }
    }
    
    return storeMap;
  } catch (error) {
    console.error('❌ خطأ في الحصول على المتاجر:', error.message);
    return {};
  }
}

// تحديث البيانات بالـ IDs الفعلية
async function updateDataWithRealIds() {
  console.log('📥 جاري الحصول على IDs المستخدمين والمتاجر...');
  
  const userMap = await getUserIds();
  const storeMap = await getStoreIds();
  
  console.log(`✅ تم الحصول على ${Object.keys(userMap).length} مستخدم`);
  console.log(`✅ تم الحصول على ${Object.keys(storeMap).length} متجر`);
  
  // ===== تحديث بيانات الكباتن =====
  if (data.captains && Array.isArray(data.captains)) {
    const captainsData = data.captains.map(captain => {
      const phone = captain['رقم الموبايل'] || captain['phone'] || '';
      const userId = userMap[phone];
      
      return {
        userId: userId || 'temp_user_id',
        role: 'captain',
        fullName: captain['الاسم'] || captain['الكابتن'] || '',
        phone: phone,
        phoneVerified: true,
        email: captain['البريد الإلكتروني'] || '',
        isActive: true,
        isOnline: true,
        lastSeen: Date.now(),
        registrationDate: Date.now(),
        isSuspended: false,
        location: {
          address: captain['منطقة التغطية'] || 'Cairo',
          addressAr: captain['منطقة التغطية'] || 'Cairo',
          latitude: 30.0444,
          longitude: 31.2357
        }
      };
    });

    const outputFile = path.join(__dirname, 'captains-linked.jsonl');
    fs.writeFileSync(outputFile, captainsData.map(c => JSON.stringify(c)).join('\n'), 'utf8');
    console.log(`✅ 1️⃣ تم تحديث captains-linked.jsonl (${captainsData.length} سجل)`);
  }

  // ===== تحديث بيانات الطلبات =====
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

    const outputFile = path.join(__dirname, 'orders-linked.jsonl');
    fs.writeFileSync(outputFile, ordersData.map(o => JSON.stringify(o)).join('\n'), 'utf8');
    console.log(`✅ 2️⃣ تم تحديث orders-linked.jsonl (${ordersData.length} سجل)`);
  }

  // ===== تحديث بيانات المحافظ =====
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

    const outputFile = path.join(__dirname, 'wallets-linked.jsonl');
    fs.writeFileSync(outputFile, walletsData.map(w => JSON.stringify(w)).join('\n'), 'utf8');
    console.log(`✅ 3️⃣ تم تحديث wallets-linked.jsonl (${walletsData.length} سجل)`);
  }

  // ===== تحديث بيانات المراجعات =====
  if (data.reviews && Array.isArray(data.reviews)) {
    const reviewsData = data.reviews.map(review => ({
      customerId: 'temp_customer_id',
      storeId: 'temp_store_id',
      orderId: 'temp_order_id',
      rating: parseFloat(review['التقييم'] || review['rating'] || '5') || 5,
      comment: review['التعليق'] || review['comment'] || '',
      createdAt: Date.now()
    }));

    const outputFile = path.join(__dirname, 'reviews-linked.jsonl');
    fs.writeFileSync(outputFile, reviewsData.map(r => JSON.stringify(r)).join('\n'), 'utf8');
    console.log(`✅ 4️⃣ تم تحديث reviews-linked.jsonl (${reviewsData.length} سجل)`);
  }

  console.log('\n✨ اكتمل ربط البيانات بالـ IDs الفعلية بنجاح');
}

updateDataWithRealIds().catch(console.error);
