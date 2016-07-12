# tinker-api
RESTful api for  tinker web


## How To Develop

### How to Build

```
1. Install latest Go and Glide
2. git clone https://github.com/simpleton/tinker-api.git src/github.com/simpleton/tinker-api
3. cd src/github.com/simpleton/tinker-api
4. make prepare
5. make
```

### How to write migration for db

1. run `./migration.sh create <your_action>`, it will generate the `<your_action>.up.sql` and `<your_action>.down.sql` ***REMOVED***le in `migrations` folder.
2. write the sql script in both ***REMOVED***le, plz don't drop table in `<your_action>.down.sql`
3. run `./migration.sh up` to upgrade the db to latest status

  * `./migration.sh next +n` apply the next n migrations
  * `./migration.sh next -n` roll back the previous n migrations
  * `./migration.sh version` show current version
  * `./migration.sh redo` roll back the most recently applied migration, then run it again
