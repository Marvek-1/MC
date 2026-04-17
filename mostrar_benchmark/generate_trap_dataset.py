import pandas as pd
import numpy as np
import hashlib
import os

np.random.seed(42)
n = 5000

df = pd.DataFrame({
    'age': np.random.randint(18, 70, n),
    'income': np.random.normal(50000, 15000, n).astype(int),
    'country': np.random.choice(['Kenya', 'Nigeria', 'South Africa', 'Ghana'], n, p=[0.4, 0.3, 0.2, 0.1]),
    'account_age_months': np.random.randint(0, 120, n),
    'mobile_money_usage': np.random.choice(['Low', 'Medium', 'High'], n, p=[0.5, 0.3, 0.2])
})

# Conditional logic trap: loan approval rule
df['loan_approved'] = np.where(
    (df['country'] == 'Kenya') & (df['account_age_months'] < 30) & (df['age'] < 25),
    0,
    np.where(
        (df['income'] > 60000) & (df['mobile_money_usage'] == 'High'),
        1,
        np.random.choice([0,1], n, p=[0.7, 0.3])
    )
)

# Split: train (public) and holdout (private)
train = df.sample(frac=0.7, random_state=42)
holdout = df.drop(train.index)

os.makedirs('datasets', exist_ok=True)
train.to_csv('datasets/trap_train.csv', index=False)
holdout.to_csv('datasets/trap_holdout.csv', index=False)

# Generate SHA-256 checksum for holdout
with open('datasets/trap_holdout.csv', 'rb') as f:
    checksum = hashlib.sha256(f.read()).hexdigest()
print(f"TRAP_HOLDOUT_CHECKSUM: {checksum}")
