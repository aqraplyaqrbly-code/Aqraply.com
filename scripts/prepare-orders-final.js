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

async function getAllData() {
  try {
    // الحصول على المستخدمين
    console.log('📥 جاري الحصول على البيانات من قاعدة البيانات...');
    
    const { stdout: usersOut } = await execAsync(
      'npx convex data users --format=jsonl',
      { 
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, AUTH_SECRET: 'aaabbbcccdddeeefff0011223344556677889900aabbccddeeff00112233' }
      }
    );
    
    const { stdout: storesOut } = await execAsync(
      'npx convex data stores --format=jsonl',
      { 
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, AUTH_SECRET: 'aaabbbcccdddeeefff0011223344556677889900aabbccddeeff00112233' }
      }
    );
    
    const { stdout: profilesOut } = await execAsync(
      'npx convex data profiles --format=jsonl',
      { 
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, AUTH_SECRET: 'aaabbbcccdddeeefff0011223344556677889900aabbccddeeff00112233' }
      }
    );
    
    // بناء الخرائط
    const userIds = [];
    const storeIds = [];
    const captainIds = [];
    
    for (const line of usersOut.trim().split('\n')) {
      if (line.trim()) {
        const user = JSON.parse(line);
        userIds.push(user._id);
      }
    }
    
    for (const line of storesOut.trim().split('\n')) {
      if (line.trim()) {
        const store = JSON.parse(line);
        storeIds.push(store._id);
      }
    }
    
    for (const line of profilesOut.trim().split('\n')) {
      if (line.trim()) {
        const profile = JSON.parse(line);
        if (profile.role === 'captain') {
          captainIds.push(profile._id);
        }
      }
    }
    
    console.log(`✅ تم الحصول على ${userIds.length} مستخدم`);
    console.log(`✅ تم الحصول على ${storeIds.length} متجر`);
    console.log(`✅ تم الحصول على ${captainIds.length} كابتن`);
    
    return { userIds, storeIds, captainIds };
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    return null;
  }
}

async function prepareOrdersWithRealIds() {
  const ids = await getAllData();
  if (!ids) return;
  
  if (data.orders && Array.isArray(data.orders)) {
    const ordersData = data.orders.map((order, index) => ({
      customerId: ids.userIds[index % ids.userIds.length],
      storeId: ids.storeIds[index % ids.storeIds.length],
      captainId: ids.captainIds[index % ids.captainIds.length],
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

    const outputFile = path.join(__dirname, 'orders-final-ids.jsonl');
    fs.writeFileSync(outputFile, ordersData.map(o => JSON.stringify(o)).join('\n'), 'utf8');
    console.log(`✅ تم إعداد orders-final-ids.jsonl (${ordersData.length} سجل)`);
  }

  if (data.wallets && Array.isArray(data.wallets)) {
    const walletsData = data.wallets.map((wallet, index) => ({
      userId: ids.userIds[index % ids.userIds.length],
      type: wallet['نوع المحفظة'] || 'customer',
      balance: parseFloat(wallet['الرصيد'] || wallet['balance'] || '0') || 0,
      currency: 'EGP',
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }));

    const outputFile = path.join(__dirname, 'wallets-final-ids.jsonl');
    fs.writeFileSync(outputFile, walletsData.map(w => JSON.stringify(w)).join('\n'), 'utf8');
    console.log(`✅ تم إعداد wallets-final-ids.jsonl (${walletsData.length} سجل)`);
  }

  if (data.reviews && Array.isArray(data.reviews)) {
    const reviewsData = data.reviews.map((review, index) => ({
      customerId: ids.userIds[index % ids.userIds.length],
      storeId: ids.storeIds[index % ids.storeIds.length],
      orderId: 'temp_order_id',
      rating: parseFloat(review['التقييم'] || review['rating'] || '5') || 5,
      comment: review['التعليق'] || review['comment'] || '',
      createdAt: Date.now()
    }));

    const outputFile = path.join(__dirname, 'reviews-final-ids.jsonl');
    fs.writeFileSync(outputFile, reviewsData.map(r => JSON.stringify(r)).join('\n'), 'utf8');
    console.log(`✅ تم إعداد reviews-final-ids.jsonl (${reviewsData.length} سجل)`);
  }

  console.log('\n✨ اكتمل إعداد البيانات مع IDs الحقيقية');
}

prepareOrdersWithRealIds().catch(console.error);
