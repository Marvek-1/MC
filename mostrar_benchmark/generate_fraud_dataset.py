import kagglehub
import pandas as pd
import hashlib
import os

os.makedirs('datasets', exist_ok=True)

path = kagglehub.dataset_download("ieee-fraud-detection", path=".")
# Load transaction data (adjust filename as needed)
df = pd.read_csv(f"{path}/train_transaction.csv")

# Holdout split
train = df.sample(frac=0.7, random_state=42)
holdout = df.drop(train.index)

train.to_csv('datasets/fraud_train.csv', index=False)
holdout.to_csv('datasets/fraud_holdout.csv', index=False)

# Checksum
with open('datasets/fraud_holdout.csv', 'rb') as f:
    print("FRAUD_HOLDOUT_CHECKSUM: " + hashlib.sha256(f.read()).hexdigest())
