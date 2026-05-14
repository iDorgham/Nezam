#!/bin/bash

URL="https://wypzseqcwwvtjijshuya.supabase.co"
KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cHpzZXFjd3d2dGppanNodXlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODc0MTksImV4cCI6MjA5NDI2MzQxOX0.STWDPY0mNIAvxWWzz3is_exIcbicLU_WGluYeTjMqk8"

echo "Seeding data via curl..."

# 1. Create Venue
VENUE_RES=$(curl -s -X POST "$URL/rest/v1/venues" \
  -H "apikey: $KEY" \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"name": "The Club", "location": "Main Street"}')

echo "Venue Response: $VENUE_RES"

# Extract ID
VENUE_ID=$(echo $VENUE_RES | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$VENUE_ID" ]; then
  echo "Failed to create venue or extract ID"
  exit 1
fi

echo "Venue created: $VENUE_ID"

# 2. Create Tables
TABLES_RES=$(curl -s -X POST "$URL/rest/v1/tables" \
  -H "apikey: $KEY" \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "[
    {\"venue_id\": \"$VENUE_ID\", \"table_number\": \"VIP 1\", \"capacity\": 6, \"min_spend\": 10000, \"status\": \"occupied\"},
    {\"venue_id\": \"$VENUE_ID\", \"table_number\": \"Table 1\", \"capacity\": 4, \"min_spend\": 5000, \"status\": \"occupied\"},
    {\"venue_id\": \"$VENUE_ID\", \"table_number\": \"Bar 1\", \"capacity\": 2, \"min_spend\": 2000, \"status\": \"available\"}
  ]")

echo "Tables Response: $TABLES_RES"

# Extract IDs
VIP1_ID=$(echo $TABLES_RES | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
T1_ID=$(echo $TABLES_RES | grep -o '"id":"[^"]*' | head -2 | tail -1 | cut -d'"' -f4)
B1_ID=$(echo $TABLES_RES | grep -o '"id":"[^"]*' | head -3 | tail -1 | cut -d'"' -f4)

echo "Tables created: VIP1=$VIP1_ID, T1=$T1_ID, B1=$B1_ID"

# 3. Create Reservations
RES_RES=$(curl -s -X POST "$URL/rest/v1/reservations" \
  -H "apikey: $KEY" \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "[
    {\"table_id\": \"$VIP1_ID\", \"guest_name\": \"John Doe\", \"status\": \"arrived\"},
    {\"table_id\": \"$T1_ID\", \"guest_name\": \"Jane Smith\", \"status\": \"arrived\"},
    {\"table_id\": \"$B1_ID\", \"guest_name\": \"Bob Johnson\", \"status\": \"pending\"}
  ]")

echo "Reservations Response: $RES_RES"
echo "Seed complete!"
