build-orderDispatchedHandler:
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