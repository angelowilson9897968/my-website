import sqlite3

# ✅ Connect to the database
conn = sqlite3.connect('portfolios.db')
cursor = conn.cursor()

# ✅ Create the portfolios table
cursor.execute('''
CREATE TABLE IF NOT EXISTS portfolios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    risk_score INTEGER NOT NULL UNIQUE,
    expected_return REAL NOT NULL,
    standard_deviation REAL NOT NULL
)
''')

# ✅ Create the assets table
cursor.execute('''
CREATE TABLE IF NOT EXISTS assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_name TEXT NOT NULL UNIQUE
)
''')

# ✅ Create the portfolio_assets table
cursor.execute('''
CREATE TABLE IF NOT EXISTS portfolio_assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    portfolio_id INTEGER NOT NULL,
    asset_id INTEGER NOT NULL,
    allocation_percentage REAL NOT NULL,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios (id),
    FOREIGN KEY (asset_id) REFERENCES assets (id)
)
''')

# ✅ Commit and close
conn.commit()
conn.close()

print("✅ Database schema created successfully!")
