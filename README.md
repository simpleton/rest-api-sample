# rest-api-sample
A RESTful api project wirrten by golang(echo).


## How To Develop

### How to Build

```
1. Install latest Go and Glide
2. git clone https://github.com/simpleton/rest-api-sample.git src/github.com/simpleton/rest-api-sample
3. cd src/github.com/simpleton/rest-api-sample
4. make prepare
5. make
```

### How to write migration for db

1. run `./migration.sh create <your_action>`, it will generate the `<your_action>.up.sql` and `<your_action>.down.sql` file in `migrations` folder.
2. write the sql script in both file, plz don't drop table in `<your_action>.down.sql`
3. run `./migration.sh up` to upgrade the db to latest status

  * `./migration.sh next +n` apply the next n migrations
  * `./migration.sh next -n` roll back the previous n migrations
  * `./migration.sh version` show current version
  * `./migration.sh redo` roll back the most recently applied migration, then run it again

4. add self to project library in IDEA setting, when you are using IDEA.

### How to write api

1. write the spec in `swagger/swagger.yml`

  * online editor `http://editor.swagger.io/#/`

2. run `./gen_swagger.sh` to generate models and swagger.json which is used by swagger-ui
3. write routing in `routing.go` file
4. implement logic in accordant handler file
5. please use the [jsend](https://labs.omniti.com/labs/jsend) as the response format
