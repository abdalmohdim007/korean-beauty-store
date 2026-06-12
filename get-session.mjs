import { readFileSync, readdirSync } from 'fs'
import os from 'os'
import path from 'path'

const dbPath = path.join(
  os.homedir(),
  'Library/Application Support/Google/Chrome/Profile 1/Local Storage/leveldb'
)

// Read all .log and .ldb files
const files = readdirSync(dbPath).filter(f => f.endsWith('.log') || f.endsWith('.ldb'))
let allData = ''

for (const file of files) {
  try {
    const buf = readFileSync(path.join(dbPath, file))
    allData += buf.toString('binary')
  } catch (e) {}
}

// Search for auth token patterns
const tokenRegex = /access_token["\s:]+([A-Za-z0-9\-_.]+)/g
const refreshRegex = /refresh_token["\s:]+([A-Za-z0-9\-_.]+)/g

let match
const found = new Set()

while ((match = tokenRegex.exec(allData)) !== null) {
  if (match[1].length > 50) {
    found.add('ACCESS:' + match[1].slice(0, 100))
  }
}
while ((match = refreshRegex.exec(allData)) !== null) {
  if (match[1].length > 10) {
    found.add('REFRESH:' + match[1].slice(0, 100))
  }
}

if (found.size > 0) {
  found.forEach(t => console.log(t))
} else {
  console.log('No auth tokens found in localStorage')

  // Show what supabase keys exist
  const supaIdx = allData.indexOf('supabase.com')
  if (supaIdx > -1) {
    console.log('Context around supabase.com:')
    console.log(allData.slice(Math.max(0, supaIdx-20), supaIdx+500).replace(/[^\x20-\x7E\n]/g, '·'))
  }
}
