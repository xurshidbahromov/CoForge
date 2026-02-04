import sqlite3
import os

DB_PATH = "coforge.db"

def add_column():
    if not os.path.exists(DB_PATH):
        print(f"Database {DB_PATH} not found.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        # Check if column exists
        cursor.execute("PRAGMA table_info(task)")
        columns = [info[1] for info in cursor.fetchall()]
        
        if "assigned_to" in columns:
            print("Column 'assigned_to' already exists in 'task' table.")
        else:
            print("Adding 'assigned_to' column to 'task' table...")
            cursor.execute("ALTER TABLE task ADD COLUMN assigned_to INTEGER")
            conn.commit()
            print("Column added successfully.")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    add_column()
