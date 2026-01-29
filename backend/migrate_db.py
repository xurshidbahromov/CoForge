from app.core.database import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as conn:
        print("Starting migration...")
        
        # 1. Add hashed_password if it doesn't exist
        conn.execute(text("ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS hashed_password VARCHAR"))
        
        # 2. Make github_id optional
        conn.execute(text("ALTER TABLE \"user\" ALTER COLUMN github_id DROP NOT NULL"))
        
        # 3. Make email unique and indexed if possible (SQLModel usually handles index, but let's ensure uniqueness)
        try:
            conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_user_email ON \"user\" (email)"))
        except Exception as e:
            print(f"Warning on email index: {e}")
            
        conn.commit()
        print("Migration completed successfully.")

if __name__ == "__main__":
    migrate()
