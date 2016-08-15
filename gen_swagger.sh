***REMOVED***
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" ***REMOVED***" && pwd ***REMOVED***"
cd ${DIR}
swagger-codegen generate -i ./swagger/swagger.yml -l swagger -o ./swagger/
swagger generate model -f ./swagger/swagger.yml