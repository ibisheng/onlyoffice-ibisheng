GRUNT = grunt
GRUNT_FLAGS = --no-color -v 

OUTPUT_DIR = deploy
OUTPUT = $(OUTPUT_DIR)

PRODUCT_VERSION ?= 0.0.0
BUILD_NUMBER ?= 0

GRUNT_ENV += PRODUCT_VERSION=$(PRODUCT_VERSION)
GRUNT_ENV += BUILD_NUMBER=$(BUILD_NUMBER)

WEBAPPS_DIR = web-apps
WEBAPPS = $(OUTPUT)/$(WEBAPPS_DIR)
NODE_MODULES = build/node_modules ../web-apps/build/node_modules
WEBAPPS_FILES += ../web-apps/deploy/web-apps/apps/api/documents/api.js
WEBAPPS_FILES += ../web-apps/deploy/web-apps/apps/documenteditor/main/app.js
WEBAPPS_FILES += ../web-apps/deploy/web-apps/apps/presentationeditor/main/app.js
WEBAPPS_FILES += ../web-apps/deploy/web-apps/apps/spreadsheeteditor/main/app.js
SDKJS_FILES += word/sdk-all.js
SDKJS_FILES += cell/sdk-all.js
SDKJS_FILES += slide/sdk-all.js

.PHONY: all

all: $(WEBAPPS)

$(WEBAPPS): $(WEBAPPS_FILES)
	mkdir -p $(OUTPUT)/$(WEBAPPS_DIR) && \
		cp -r -t $(OUTPUT)/$(WEBAPPS_DIR) ../$(WEBAPPS_DIR)/deploy/** 

$(WEBAPPS_FILES): $(NODE_MODULES) $(SDKJS_FILES)
	cd ../$(WEBAPPS_DIR)/build  && \
		$(GRUNT_ENV) $(GRUNT) deploy-$(filter %editor documents,$(subst /, ,$(@D)))-component $(GRUNT_FLAGS)

$(NODE_MODULES):
	cd $(@D) && \
		npm install

$(SDKJS_FILES): $(NODE_MODULES)
	cd build && \
		$(GRUNT_ENV) $(GRUNT) build_$(@D) $(GRUNT_FLAGS)
	
clean:
	rm -f $(WEBAPPS_FILES) $(SDKJS_FILES)
