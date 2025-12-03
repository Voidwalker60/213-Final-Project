# 213 Final Project
Online Booking System
Created by Maddie, Prabhjot, and Simranjot
## Description
This project is a Booking system written in HTML, CSS, Javascript, and PHP, primarily made for concerts and other large events. This is built to be fully selfhostable, and is free for enterprise and private usage.

## Deployment instructions
1. Requires a running MariaDB or MYSQL server.
2. Create databases and tables by running:
```bash
mysql -u root -p < sql.txt
 ```
3. PHP must be installed on the server.
   1. The following php modules must be enabled in php.ini:
       - mysqli
       - calendar
       - json
   2. The mail function should be configured with your SMTP server of choice in php.ini.
2. Runs via apache
3. Set admin password via *page*/admin
4. Comes Preseeded with events
5. Premade credentials are:
```
admin@stubhub.com, password123
jane.smith@gmail.com, userpass456
```
