FROM postgres:14-alpine

# (Optional) If you need to add custom configuration files or scripts, you can copy them here
# COPY custom_pg_config.conf /etc/postgresql/postgresql.conf
# COPY init_script.sql /docker-entrypoint-initdb.d/

# You may add additional configurations or customizations here if needed

# db에 한글 넣을 때 안깨지도록 설정 추가
ADD ./postgresql.conf /etc/postgresql/conf.d/postgresql.conf