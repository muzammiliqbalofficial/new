import * as path from 'path';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const email = process.argv[2];

if (!email) {
  console.error('Usage: npm run create-admin -- <email>');
  process.exit(1);
}

function generatePassword(): string {
  return crypto.randomBytes(12).toString('base64url');
}

async function main() {
  const { getServiceSupabase } = await import('../src/lib/supabase');
  const supabase = getServiceSupabase();
  const password = generatePassword();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error('Failed to create admin user:', error.message);
    process.exit(1);
  }

  console.log('\n==============================================');
  console.log('Admin account created.');
  console.log(`Email:    ${email}`);
  console.log(`Password: ${password}`);
  console.log('==============================================');
  console.log('Save this password now — it will not be shown again.');
  console.log(`User id: ${data.user?.id}\n`);
}

main();
