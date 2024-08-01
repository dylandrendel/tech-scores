#!/bin/bash

# Check if at least two arguments are provided
if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <start_date> <end_date>"
  exit 1
fi

start_date=$1
end_date=$2

echo "Resetting the database..."
npx prisma migrate reset 
#--force

# Convert start and end dates to seconds since the epoch
start_sec=$(date -j -f "%Y-%m-%d" "$start_date" "+%s")
end_sec=$(date -j -f "%Y-%m-%d" "$end_date" "+%s")

# Loop over each day
for (( d="$start_sec"; d<="$end_sec"; d+=86400 )); do
  current_date=$(date -j -f "%s" "$d" "+%Y-%m-%d")
  echo "Adding data for $current_date..."
  tsx data/add_data "$current_date"
done

echo "Data addition completed."