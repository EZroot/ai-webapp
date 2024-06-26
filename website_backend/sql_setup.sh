sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo apt-get install libpq-dev

cargo install diesel_cli --no-default-features --features postgres
sudo -u postgres createdb my_database_name
#and create the table based on schema.rs

sudo -u postgres psql
\password postgres


#creating table
#postgres \c database_name and \dt to view tables
sudo -u postgres psql

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    password_hash VARCHAR(255),
    email VARCHAR(255),
    role VARCHAR(255)
);

#check nginx logs
sudo awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr
sudo awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | awk '{print $2}'

#setup API key and WEB_TOKEN env variables
#when making a service, you must set these in the service file too


sudo apt install geoip-bin   # For Debian/Ubuntu
while read ip; do echo -n "$ip "; geoiplookup "$ip"; done < ips.txt
