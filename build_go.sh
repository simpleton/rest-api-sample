***REMOVED***

export VTTOP=$(pwd***REMOVED***
export VTROOT="${VTROOT:-${VTTOP/\/src\/github.com\/simpleton\/tinker-api/}}"
# VTTOP sanity check
if [[ "$VTTOP" == "${VTTOP/\/src\/github.com\/simpleton\/tinker-api/}" ]]; then
  echo "WARNING: VTTOP($VTTOP***REMOVED*** does not contain src/github.com/simpleton/tinker-api"
***REMOVED***

export GOTOP=$VTTOP

function prepend_path(***REMOVED***
{
  # $1 path variable
  # $2 path to add
  if [ -d "$2" ] && [[ ":$1:" != *":$2:"* ]]; then
    echo "$2:$1"
  ***REMOVED***
    echo "$1"
  ***REMOVED***
}

export GOPATH=$(prepend_path $GOPATH $VTROOT***REMOVED***

export GOPATH="$PWD:$GOPATH"

go build -o ./bin/tinker-api
