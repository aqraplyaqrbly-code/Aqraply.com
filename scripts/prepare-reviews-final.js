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
        try {
          const order = JSON.parse(line);
          orderIds.push(order._id);
        } catch (e) {}
      }
    }
    
    return orderIds;
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    return [];
  }
}

async function prepareReviews() {
  try {
    console.log('📥 جاري الحصول على IDs...');

    const { stdout: profilesOut } = await execAsync(
      'npx convex data profiles --format=jsonl',
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

    const customerProfiles = [];
    const storeIds = [];
    
    for (const line of profilesOut.trim().split('\n')) {
      if (line.trim()) {
        const profile = JSON.parse(line);
        if (profile.role === 'customer') {
          customerProfiles.push(profile._id);
        }
      }
    }

    for (const line of storesOut.trim().split('\n')) {
      if (line.trim()) {
        const store = JSON.parse(line);
        storeIds.push(store._id);
      }
    }

    const orderIds = await getOrderIds();
    console.log(`✅ تم الحصول على ${customerProfiles.length} customer profile`);
    console.log(`✅ تم الحصول على ${storeIds.length} store`);
    console.log(`✅ تم الحصول على ${orderIds.length} order`);

    if (data.reviews && Array.isArray(data.reviews)) {
      const reviewsData = data.reviews.map((review, index) => ({
        customerId: customerProfiles[index % customerProfiles.length],
        storeId: storeIds[index % storeIds.length],
        orderId: orderIds[index % orderIds.length],
        rating: parseFloat(review['التقييم'] || review['rating'] || '5') || 5,
        comment: review['التعليق'] || review['comment'] || '',
        createdAt: Date.now()
      }));

      const outputFile = path.join(__dirname, 'reviews-final.jsonl');
      fs.writeFileSync(outputFile, reviewsData.map(r => JSON.stringify(r)).join('\n'), 'utf8');
      console.log(`✅ 4️⃣ تم إعداد reviews-final.jsonl (${reviewsData.length} سجل)`);
    }
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
}

prepareReviews();
