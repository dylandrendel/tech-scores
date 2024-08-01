echo "Running jobspy for today..."
/usr/local/bin/python3 jobspy_my.py
echo "Jobspy completed."

echo "Adding data for today..."
tsx add_data
echo "Data addition completed."