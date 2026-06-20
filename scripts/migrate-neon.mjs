#!/usr/bin/env node
/**
 * Alternatif untuk `prisma migrate dev` saat menggunakan Neon HTTP pooler.
 * Jalankan: node scripts/migrate-neon.mjs <path-to-sql-file>
 *
 * Cara generate SQL: npx prisma migrate diff --from-migrations prisma/migrations --to-schema prisma/schema.prisma --script
 */
import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'

const sqlFile = process.argv[2]
if (!sqlFile) {
  console.error('Usage: node scripts/migrate-neon.mjs <migration.sql>')
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)
const migration = readFileSync(sqlFile, 'utf-8')

const statements = migration
  .replace(/--[^\n]*/g, '')
  .split(';')
  .map((s) => s.trim())
  .filter((s) => s.length > 3)

console.log(`Applying ${statements.length} statements from ${sqlFile}...`)

for (let i = 0; i < statements.length; i++) {
  try {
    await sql.query(statements[i])
    process.stdout.write('.')
  } catch (e) {
    if (e.message.includes('already exists') || e.message.includes('does not exist')) {
      process.stdout.write('s')
    } else {
      console.error(`\n[${i}] Error: ${e.message}`)
      process.exit(1)
    }
  }
}
console.log('\n✅ Migration applied!')
