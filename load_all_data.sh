#!/bin/bash

# This script generates SQL files and provides instructions for loading
# all medical terms data into the database

echo "Generating SQL for all CSV files..."

node generate_insert_sql.mjs new_terms.csv > insert_new_terms.sql
node generate_insert_sql.mjs medical_terms_part1.csv > insert_medical_terms_part1.sql

echo "Generated SQL files:"
echo "  - insert_new_terms.sql (163 records)"
echo "  - insert_medical_terms_part1.sql (200 records)"
echo ""
echo "To load the data, you can:"
echo "1. Use the MCP Supabase tools to execute each batch"
echo "2. Copy the SQL into Supabase SQL Editor and run it"
echo "3. Use psql if you have direct database access"
echo ""
echo "Example using psql:"
echo "  psql \$DATABASE_URL < insert_new_terms.sql"
echo "  psql \$DATABASE_URL < insert_medical_terms_part1.sql"
