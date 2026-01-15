# SQLite to MySQL Migration Guide

## Current Status

✅ PyMySQL installed  
✅ Cryptography package installed  
✅ MySQL database created (`urlshortener_db`)  
✅ MySQL user created (`urlshortener_user`)  
✅ Django settings updated to use MySQL  

## Problem

You've already changed your `settings.py` to use MySQL, but you need to export data from SQLite first. The `dumpdata` command is now trying to connect to MySQL instead of SQLite.

## Solution: Two Options

### Option 1: Temporarily Revert to SQLite for Data Export (Recommended)

This is the cleanest approach to migrate your existing data.

#### Step 1: Temporarily revert database settings

Edit `/home/sr/Downloads/qr/url/authenticated-urlshortener-django/backend/backend/settings.py` and change the `DATABASES` configuration back to SQLite temporarily:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

#### Step 2: Export data from SQLite

```bash
cd /home/sr/Downloads/qr/url/authenticated-urlshortener-django/backend
source venv/bin/activate
python manage.py dumpdata > datadump.json
```

#### Step 3: Change back to MySQL settings

Edit `settings.py` again and restore the MySQL configuration:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'urlshortener_db',
        'USER': 'urlshortener_user',
        'PASSWORD': 'your_password_here',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'charset': 'utf8mb4',
        },
    }
}
```

#### Step 4: Run migrations on MySQL

```bash
python manage.py migrate
```

#### Step 5: Load the data into MySQL

```bash
python manage.py loaddata datadump.json
```

#### Step 6: Verify the migration

```bash
python manage.py runserver
```

---

### Option 2: Start Fresh with MySQL (No Data Migration)

If you don't need to preserve your existing SQLite data, you can simply:

```bash
cd /home/sr/Downloads/qr/url/authenticated-urlshortener-django/backend
source venv/bin/activate
python manage.py migrate
python manage.py createsuperuser
```

This will create all the necessary tables in MySQL and let you create a new admin user.

---

## Recommended Next Steps

1. **Choose your approach** (Option 1 if you have important data, Option 2 if starting fresh is okay)
2. **Follow the steps** for your chosen option
3. **Test your application** by running the development server
4. **Optional**: Delete or backup the old `db.sqlite3` file once everything works

## Additional Notes

- The `pymysql.install_as_MySQLdb()` line in your settings.py is correct and needed
- Make sure your MySQL server is running before attempting migrations
- If you encounter any authentication issues, you may need to adjust the MySQL user's authentication plugin
