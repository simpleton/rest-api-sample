***REMOVED***

ssh -fN -L 3333:rm-bp13c4p31fzlz36ye.pg.rds.aliyuncs.com:3433 root@120.55.119.4

migrate -url postgres://sim_psql:E1ffcf8dfbf3daeca5b6a0b89e9b8bbf@localhost:3333/tinker?sslmode=disable -path ./migrations create migration_$1