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

async function getProfileData() {
  try {
    const { stdout } = await execAsync(
      'npx convex data profiles --format=jsonl',
      { 
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, AUTH_SECRET: 'aaabbbcccdddeeefff0011223344556677889900aabbccddeeff00112233' }
      }
    );
    
    const customerProfiles = [];
    const captainProfiles = [];
    
    for (const line of stdout.trim().split('\n')) {
      if (line.trim()) {
        const profile = JSON.parse(line);
        if (profile.role === 'customer') {
          customerProfiles.push(profile._id);
        } else if (profile.role === 'captain') {
          captainProfiles.push(profile._id);
        }
      }
    }
    
    return { customerProfiles, captainProfiles };
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    return null;
  }
}

async function getOrderIds() {
  try {
    const { stdout } = await execAsync(
      'npx convex data orders --format=jsonl',
      { 
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, AUTH_SECRET: 'aaabbbcccdddeeefff0011223344556677889900aabbccddeeff00112233' }
      }
    );
    
    const orderIds = [];
    for (const line of stdout.trim().split('\n')) {
      if (line.trim()) {
        const order = JSON.parse(line);
        orderIds.push(order._id);
      }
    }
    
    return orderIds;
  } catch (error) {
    console.error('⚠️ لم نستطع الحصول على order IDs (قد لا توجد طلبات بعد):', error.message);
    return [];
  }
}

async function prepareDataWithProfileIds() {
  console.log('📥 جاري الحصول على profile IDs...');
  const profiles = await getProfileData();
  if (!profiles) return;
  
  const { customerProfiles, captainProfiles } = profiles;
  console.log(`✅ تم الحصول على ${customerProfiles.length} customer profile`);
  console.log(`✅ تم الحصول على ${captainProfiles.length} captain profile`);
  
  // ===== تحديث الطلبات =====
  if (data.orders && Array.isArray(data.orders)) {
    const ordersData = data.orders.map((order, index) => ({
      customerId: customerProfiles[index % customerProfiles.length],
      storeId: 'temp_store_id',
      captainId: captainProfiles[index % captainProfiles.length],
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

    const outputFile = path.join(__dirname, 'orders-with-profiles.jsonl');
    fs.writeFileSync(outputFile, ordersData.map(o => JSON.stringify(o)).join('\n'), 'utf8');
    console.log(`✅ تم إعداد orders-with-profiles.jsonl (${ordersData.length} سجل)`);
  }

  // ===== تحديث المحافظ =====
  if (data.wallets && Array.isArray(data.wallets)) {
    // لكن أولاً نحتاج على user IDs ليس profile IDs للمحافظ
    const { stdout: usersOut } = await execAsync(
      'npx convex data users --format=jsonl',
      { 
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, AUTH_SECRET: 'aaabbbcccdddeeefff0011223344556677889900aabbccddeeff00112233' }
      }
    );
    
    const userIds = [];
    for (const line of usersOut.trim().split('\n')) {
      if (line.trim()) {
        const user = JSON.parse(line);
        userIds.push(user._id);
      }
    }
    
    const walletsData = data.wallets.map((wallet, index) => ({
      userId: userIds[index % userIds.length],
      type: wallet['نوع المحفظة'] || 'customer',
      balance: parseFloat(wallet['الرصيد'] || wallet['balance'] || '0') || 0,
      currency: 'EGP',
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }));

    const outputFile = path.join(__dirname, 'wallets-with-ids.jsonl');
    fs.writeFileSync(outputFile, walletsData.map(w => JSON.stringify(w)).join('\n'), 'utf8');
    console.log(`✅ تم إعداد wallets-with-ids.jsonl (${walletsData.length} سجل)`);
  }

  // ===== تحديث المراجعات =====
  if (data.reviews && Array.isArray(data.reviews)) {
    const orderIds = await getOrderIds();
    
    const reviewsData = data.reviews.map((review, index) => ({
      customerId: customerProfiles[index % customerProfiles.length],
      storeId: 'temp_store_id',
      orderId: orderIds[index % orderIds.length] || 'temp_order_id',
      rating: parseFloat(review['التقييم'] || review['rating'] || '5') || 5,
      comment: review['التعليق'] || review['comment'] || '',
      createdAt: Date.now()
    }));

    const outputFile = path.join(__dirname, 'reviews-with-profiles.jsonl');
    fs.writeFileSync(outputFile, reviewsData.map(r => JSON.stringify(r)).join('\n'), 'utf8');
    console.log(`✅ تم إعداد reviews-with-profiles.jsonl (${reviewsData.length} سجل)`);
  }

  console.log('\n✨ اكتمل إعداد البيانات مع profile IDs');
}

prepareDataWithProfileIds().catch(console.error);
