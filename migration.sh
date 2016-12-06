#!/usr/bin/env bash

account="sim_psql"
password="db_password"
local_port="3333"
remote="proxy_address"
db_address="db_address"

tunnel_name="sqlTunnel"

ssh -M -S ${tunnel_name} -fnNT -L ${local_port}:${db_address} ${remote}

if [ $1 = "create" ]; then
    migrate -url postgres://${account}:${password}@localhost:${local_port}/tinker?sslmode=disable -path ./migrations create $2
elif [ $1 = "version" ]; then
    migrate -url postgres://${account}:${password}@localhost:${local_port}/tinker?sslmode=disable -path ./migrations version
elif [ $1 = "up" ]; then
    migrate -url postgres://${account}:${password}@localhost:${local_port}/tinker?sslmode=disable -path ./migrations up
elif [ $1 = "down" ]; then
    migrate -url postgres://${account}:${password}@localhost:${local_port}/tinker?sslmode=disable -path ./migrations down
elif [ $1 = "next" ]; then
    migrate -url postgres://${account}:${password}@localhost:${local_port}/tinker?sslmode=disable -path ./migrations migrate $2
elif [ $1 = "redo" ]; then
    migrate -url postgres://${account}:${password}@localhost:${local_port}/tinker?sslmode=disable -path ./migrations redo
else
    echo "only support 'create', 'version', 'up', 'next', 'redo' command"
fi

ssh -S ${tunnel_name} -O exit ${remote}