import sqlite3

# ✅ Connect to the database
conn = sqlite3.connect('portfolios.db')
cursor = conn.cursor()

# ✅ List of assets to insert
assets = [
    'Apple Inc.', 'Microsoft Corporation', 'NVIDIA Corporation', 'Alphabet Inc.', 'Amazon.com, Inc.',
    'Meta Platforms Inc.', 'Tesla Inc.', 'Reliance Industries Ltd.', 'Tata Consultancy Services', 
    'HDFC Bank Ltd.', 'Larsen & Toubro Ltd.', 'ITC', 'Persistent Systems Ltd.', 'Zomato', 'Trent Ltd.', 
    'Dixon Technologies (India) Ltd.', 'Polycab India Ltd.', 'Sobha Ltd.', 'LT Foods Ltd.', 
    'Mama Earth', 'PCBL Chemical Ltd.', 'Cholamandalam Financial Holdings Ltd.', 'Bitcoin', 
    'Ethereum', 'Solana', 'Govt Bond', 'Gold', 'Copper', 'US Dollar'
]

# ✅ Insert assets into the table (if not already present)
for asset in assets:
    cursor.execute('''
        INSERT OR IGNORE INTO assets (asset_name) 
        VALUES (?)
    ''', (asset,))

# ✅ Commit and close
conn.commit()
conn.close()

print("✅ Assets inserted successfully!")
