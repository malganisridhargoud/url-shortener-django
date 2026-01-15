# MySQL Schema Files - Complete Guide

## ✅ What Was Created

Your MySQL database has been exported to **4 SQL files** in the `mysql_backups/` folder:

| File | Size | Description |
|------|------|-------------|
| `schema_only.sql` | 11 KB | Database structure only (tables, indexes, constraints) |
| `data_only.sql` | 9.5 KB | Data only (no table definitions) |
| `complete_backup.sql` | 20 KB | Complete backup (structure + data) |
| `backup_20260115_174551.sql` | 20 KB | Timestamped complete backup |

## 📁 File Locations

All files are in:
```
/home/sr/Downloads/qr/url/authenticated-urlshortener-django/backend/mysql_backups/
```

## 🔍 What's Inside

### Schema File (`schema_only.sql`)

Contains CREATE TABLE statements for all 13 tables:
- `application_shortenedurl` - Your URL shortener data
- `auth_user`, `auth_group`, `auth_permission` - Django authentication
- `django_admin_log`, `django_session` - Django admin & sessions
- `token_blacklist_*` - JWT token management
- And more...

### Data File (`data_only.sql`)

Contains INSERT statements for all your data:
- 3 users (ssr, srr, sri)
- 1 shortened URL
- All permissions and content types

### Complete Backup (`complete_backup.sql`)

Contains both structure AND data - everything needed to recreate your entire database.

## 🔄 How to Use These Files

### Restore Complete Database
```bash
# Drop and recreate database (CAUTION: destroys existing data!)
mysql -u root -p -e "DROP DATABASE IF EXISTS urlshortener_db; CREATE DATABASE urlshortener_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Restore from backup
mysql -u urlshortener_user -p'sr@123' urlshortener_db < mysql_backups/complete_backup.sql
```

### Restore Only Schema (Empty Tables)
```bash
mysql -u urlshortener_user -p'sr@123' urlshortener_db < mysql_backups/schema_only.sql
```

### Restore Only Data
```bash
# First create tables, then load data
mysql -u urlshortener_user -p'sr@123' urlshortener_db < mysql_backups/schema_only.sql
mysql -u urlshortener_user -p'sr@123' urlshortener_db < mysql_backups/data_only.sql
```

## 🔁 Create New Backups Anytime

Run the export script again:
```bash
cd /home/sr/Downloads/qr/url/authenticated-urlshortener-django/backend
./export_mysql_schema.sh
```

This will create a new timestamped backup each time.

## 📤 Share or Version Control

These SQL files can be:
- ✅ Added to Git for version control
- ✅ Shared with team members
- ✅ Used to set up development/staging environments
- ✅ Kept as backups before major changes

## 🎯 Common Use Cases

### 1. Deploy to Another Server
```bash
# On new server, create database and user first
mysql -u root -p -e "CREATE DATABASE urlshortener_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p -e "CREATE USER 'urlshortener_user'@'localhost' IDENTIFIED BY 'sr@123';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON urlshortener_db.* TO 'urlshortener_user'@'localhost';"

# Then restore
mysql -u urlshortener_user -p'sr@123' urlshortener_db < complete_backup.sql
```

### 2. Reset Database to Clean State
```bash
# Keep schema, remove all data
mysql -u urlshortener_user -p'sr@123' urlshortener_db -e "DROP DATABASE urlshortener_db;"
mysql -u urlshortener_user -p'sr@123' -e "CREATE DATABASE urlshortener_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u urlshortener_user -p'sr@123' urlshortener_db < mysql_backups/schema_only.sql
```

### 3. Clone Database for Testing
```bash
# Create test database
mysql -u root -p -e "CREATE DATABASE urlshortener_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u urlshortener_user -p'sr@123' urlshortener_test < mysql_backups/complete_backup.sql
```

## 🔐 Security Note

The `complete_backup.sql` and `data_only.sql` files contain:
- ✅ User passwords (hashed, safe)
- ✅ All your application data
- ⚠️ **Don't commit to public repositories if data is sensitive**

## 📊 View Schema Visually

Open `schema_only.sql` in any text editor to see:
- Table structures
- Column types
- Indexes
- Foreign key relationships
- Constraints

This is useful for understanding your database structure without connecting to MySQL!
