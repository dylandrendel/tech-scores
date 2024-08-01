import csv
import datetime
from jobspy import scrape_jobs

jobs = scrape_jobs(
    site_name=["indeed", "glassdoor"],
    search_term="software engineer",
    location="USA",
    results_wanted=600,
    hours_old=24, # (only Linkedin/Indeed is hour specific, others round up to days old)
    country_indeed='USA',  # only needed for indeed / glassdoor
    
    # linkedin_fetch_description=True # get full description , direct job url , company industry and job level (seniority level) for linkedin (slower)
    # proxies=["31.222.254.113"],
    
)
print(f"Found {len(jobs)} jobs")
print(jobs.head())
# # find jobs with React in the title or description
# react_jobs = jobs[jobs["title"].str.contains("React", case=False) | jobs["description"].str.contains("React", case=False)]
# print(f"Found {len(react_jobs)} React jobs")
# get today's date in the format YYYY-MM-DD
today = datetime.datetime.now().strftime("%Y-%m-%d")
jobs.to_csv(f"jobs_{today}.csv", quoting=csv.QUOTE_NONNUMERIC, escapechar="\\", index=False) # to_excel