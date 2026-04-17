import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

os.makedirs('datasets', exist_ok=True)

np.random.seed(42)
n = 10000

start_date = datetime(2024, 1, 1)
timestamps = [start_date + timedelta(
    minutes=int(x)) for x in np.cumsum(np.random.exponential(30, n))]
df = pd.DataFrame({
    'timestamp': timestamps,
    'user_id': np.random.randint(1, 500, n),
    'amount': np.random.lognormal(3, 1, n).astype(int),
    'transaction_type': np.random.choice(['Send', 'Receive', 'Airtime', 'PayBill'], n)
})
df = df.sort_values('timestamp')

train = df[df['timestamp'] < datetime(2024, 6, 1)]
holdout = df[df['timestamp'] >= datetime(2024, 6, 1)]

train.to_csv('datasets/temporal_train.csv', index=False)
holdout.to_csv('datasets/temporal_holdout.csv', index=False)
