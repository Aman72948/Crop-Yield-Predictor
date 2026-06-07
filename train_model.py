import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib

# ════════════════════════════════════
# STEP 1 — Kaggle Data Load Karo
# ════════════════════════════════════
print("📂 Kaggle data load ho raha hai...")
df1 = pd.read_csv('Crop_recommendation.csv')

df1.columns = df1.columns.str.strip()
df1 = df1.rename(columns={
    'temperature': 'TEMP',
    'humidity':    'HUMIDITY',
    'rainfall':    'RAINFALL',
    'label':       'CROP',
    'N':           'N',
    'P':           'P',
    'K':           'K',
    'ph':          'PH'
})

print(f"✅ Kaggle Rows: {len(df1)}")

# ════════════════════════════════════
# STEP 2 — Punjab Data Load Karo
# ════════════════════════════════════
print("\n📂 Punjab Government data load ho raha hai...")
df2 = pd.read_csv('soil_data.csv')

df2.columns = df2.columns.str.strip().str.upper()
print(f"Punjab Columns: {df2.columns.tolist()}")

df2 = df2.rename(columns={
    'NITROGEN':      'N',
    'PHOSPHORUS':    'P',
    'POTASSIUM(K)':  'K',
    'TEMP(°C)':      'TEMP',
    'TEMP(C)':       'TEMP',
    'TEMPERATURE':   'TEMP',
    'HUMIDITY':      'HUMIDITY',
    'RAINFALL':      'RAINFALL',
    'LABEL':         'CROP',
    'CROP':          'CROP',
    'PH':            'PH'
})

print(f"✅ Punjab Rows: {len(df2)}")

# ════════════════════════════════════
# STEP 3 — Sirf Zaroori Columns Lo
# ════════════════════════════════════
cols = ['N', 'P', 'K', 'PH', 'TEMP', 'HUMIDITY', 'RAINFALL', 'CROP']

df1 = df1[cols]
df2 = df2[cols]

# ════════════════════════════════════
# STEP 4 — Dono Merge Karo
# ════════════════════════════════════
df = pd.concat([df1, df2], ignore_index=True)

df['CROP'] = df['CROP'].str.lower().str.strip()
df = df.dropna()

print(f"\n✅ Total Merged Rows: {len(df)}")
print(f"✅ Crops: {sorted(df['CROP'].unique())}")

# ════════════════════════════════════
# STEP 5 — Train Test Split
# ════════════════════════════════════
X = df[['N', 'P', 'K', 'PH', 'TEMP', 'HUMIDITY', 'RAINFALL']]
y = df['CROP']

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

print(f"\n📊 Training Data: {len(X_train)} rows")
print(f"📊 Testing Data:  {len(X_test)} rows")

# ════════════════════════════════════
# STEP 6 — Model Train Karo
# ════════════════════════════════════
print("\n🤖 Model train ho raha hai...")

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)
model.fit(X_train, y_train)

# ════════════════════════════════════
# STEP 7 — Accuracy Check Karo
# ════════════════════════════════════
preds = model.predict(X_test)
accuracy = accuracy_score(y_test, preds)

print(f"\n✅ Accuracy: {accuracy*100:.2f}%")
print("\n📊 Classification Report:")
print(classification_report(y_test, preds))

# ════════════════════════════════════
# STEP 8 — Model Save Karo
# ════════════════════════════════════
joblib.dump(model, 'model.pkl')
print("\n✅ model.pkl saved!")
print("🚀 Training Complete!")