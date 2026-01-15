# Viewing MySQL Data & Understanding db.sqlite3

## How to View Your MySQL Data

Your data is now stored in MySQL, not in the `db.sqlite3` file anymore. Here are the ways to view it:

### Method 1: MySQL Command Line (After fixing password)

You need to update the MySQL user password to match what's in your `settings.py`:

```sql
sudo mysql -u root
ALTER USER 'urlshortener_user'@'localhost' IDENTIFIED BY 'sr@123';
FLUSH PRIVILEGES;
EXIT;
```

Then you can view your data:
```bash
mysql -u urlshortener_user -p'sr@123' -D urlshortener_db
```

Once in MySQL:
```sql
SHOW TABLES;                    -- See all tables
SELECT * FROM auth_user;        -- View users
SELECT * FROM application_shortenedurl;  -- View shortened URLs
```

### Method 2: Django Admin Interface

1. Start your server: `python manage.py runserver`
2. Visit: `http://127.0.0.1:8000/admin/`
3. Login with your superuser credentials
4. Browse all your data through the admin interface

### Method 3: MySQL GUI Tools

Install and use tools like:
- **MySQL Workbench** (Official MySQL GUI)
- **phpMyAdmin** (Web-based)
- **DBeaver** (Universal database tool)

Connection details:
- Host: `localhost`
- Port: `3306`
- Database: `urlshortener_db`
- Username: `urlshortener_user`
- Password: `sr@123`

### Method 4: Django Shell

```bash
source venv/bin/activate
python manage.py shell
```

Then in the shell:
```python
from django.contrib.auth.models import User
from application.models import ShortenedUrl

# View users
User.objects.all()
User.objects.count()

# View shortened URLs
ShortenedUrl.objects.all()
```

## About the db.sqlite3 File

**Yes, the `db.sqlite3` file is still there**, but it's **NO LONGER BEING USED** by your Django application.

### Why is it still there?
- It's just a leftover file from before the migration
- Your Django app is now configured to use MySQL (check `settings.py`)
- The file is harmless and can serve as a backup

### Should you delete it?
You have two options:

**Option 1: Keep it as a backup**
```bash
# Rename it to make it clear it's a backup
mv db.sqlite3 db.sqlite3.backup
```

**Option 2: Delete it**
```bash
# Only do this if you're sure the MySQL migration worked
rm db.sqlite3
```

### How to verify you're using MySQL, not SQLite?

Check your `settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',  # ← This confirms MySQL
        'NAME': 'urlshortener_db',
        # ...
    }
}
```

## Current Issue

The MySQL user password needs to be updated to match your `settings.py`. Run this command to fix it:

```bash
sudo mysql -u root -e "ALTER USER 'urlshortener_user'@'localhost' IDENTIFIED BY 'sr@123'; FLUSH PRIVILEGES;"
```

After fixing the password, your Django app will be able to connect to MySQL properly.
