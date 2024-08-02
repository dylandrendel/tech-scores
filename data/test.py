# parse csv file and get length of data
import pandas as pd
df = pd.read_csv("jobs_2024-08-01.csv")
print(df.head())

print(len(df))
# create a list of most common words in english, like the, and, a etc
# listCommonWords = ["the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"]
# wordCountsInDescription = df["description"].str.lower().str.str.split(' ').explode().str.strip().value_counts()
# # do the same but removes commas

# # write above to a csv
# wordCountsInDescription.to_csv("word_counts.csv")
# # do something cool using pandas for analytics
# print(df["title"].value_counts())

