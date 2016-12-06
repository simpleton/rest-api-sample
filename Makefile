all: build

build: rest-api-sample

# go build -o ./bin/rest-api-sample
rest-api-sample:
	@bash build_go.sh

clean:
	@rm -rf bin
	go clean

prepare:
	proxychains4 glide install

test:
	$(info ************ NO TEST CURRENTLY ************)

run: rest-api-sample
	./bin/rest-api-sample
