sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo apt-get install libpq-dev

cargo install diesel_cli --no-default-features --features postgres
sudo -u postgres createdb my_database_name
