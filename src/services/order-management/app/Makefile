
build-orderDispatchedHandler:
	$(MAKE) build-lambda-common

build-startOrderAcceptance:
	$(MAKE) build-lambda-common

build-stockChecker:
	$(MAKE) build-lambda-common

build-paymentProcessor:
	$(MAKE) build-lambda-common

build-orderAcceptanceResult:
	$(MAKE) build-lambda-common

build-OnConnectFunction:
	$(MAKE) build-lambda-common

build-OnDisconnectFunction:
	$(MAKE) build-lambda-common

build-cancelOrderCommandHandler:
	$(MAKE) build-lambda-common

build-lambda-common:
	npm install
# workaround https://github.com/aws/aws-sam-cli/issues/2565
	npm rebuild
	npm run lint
	npm run fast-test
	npm run fast-compile
	npm prune --production
ifeq ($(OS),Windows_NT)
	Xcopy /E /I node_modules $(ARTIFACTS_DIR)\node_modules
	Xcopy /E /I dist\src $(ARTIFACTS_DIR)\dist\src
else
	cp -R node_modules $(ARTIFACTS_DIR)/node_modules
	cp -R dist $(ARTIFACTS_DIR)/dist
endif