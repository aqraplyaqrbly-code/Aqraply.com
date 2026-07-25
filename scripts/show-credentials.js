#!/usr/bin/env node

async function resetPasswords() {
  try {
    console.log('🔄 بيانات الدخول للموقع\n');
    
    console.log('📧 بيانات الدخول المتاحة:');
    console.log('');
    console.log('┌' + '─'.repeat(78) + '┐');
    console.log('│  البريد الإلكتروني                     │  كلمة المرور          │');
    console.log('├' + '─'.repeat(78) + '┤');
    
    const emails = [
      'ahmed@example.com',
      'fatma@example.com',
      'mohamed@example.com',
      'khadija@example.com',
      'youssef@example.com',
      'nadia@example.com',
      'kareem@example.com',
      'mona@example.com',
      'hassan@example.com'
    ];

    emails.forEach(email => {
      console.log(`│  ${email.padEnd(35)}  │  Password123!       │`);
    });

    console.log('└' + '─'.repeat(78) + '┘');
    console.log('');
    console.log('✅ جميع المستخدمين يستخدمون كلمة المرور نفسها: Password123!');
    console.log('');
    console.log('🔗 رابط الموقع: http://localhost:5177/');
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
}

resetPasswords();
