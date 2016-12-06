#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ${DIR}
swagger-codegen generate -i ./swagger/swagger.yml -l swagger -o ./swagger/
swagger generate model -f ./swagger/swagger.yml