all: build

build: tinker-api

# go build -o ./bin/tinker-api
tinker-api:
	@bash build_go.sh

clean:
	@rm -rf bin
	go clean

prepare:
	glide install

test:
	$(info ************ NO TEST CURRENTLY ***************REMOVED***

run: tinker-api
	./bin/tinker-api
