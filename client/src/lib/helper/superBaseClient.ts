import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    "https://qdwjxshdozpcmmlrxcio.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkd2p4c2hkb3pwY21tbHJ4Y2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MTQ3NTEsImV4cCI6MjA1NTA5MDc1MX0.vFntnfbYJJ4dM5ORDTos-p7jHfU7669xz9al5Xkbflc"
)