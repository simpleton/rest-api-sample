***REMOVED***

version=`git log --date=iso --pretty=format:"%cd @%h" -1`
if [ $? -ne 0 ]; then
    version="not a git repo"
***REMOVED***

compile=`date +"%F %T %z"`" by "`go version`

cat << EOF | gofmt > core/hack/version.go
package hack

***REMOVED***
    Version = "$version"
    Compile = "$compile"
***REMOVED***
EOF