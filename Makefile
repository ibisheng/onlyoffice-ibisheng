GRUNT = grunt
GRUNT_FLAGS = --no-color -v 

OUTPUT_DIR = deploy
OUTPUT = $(OUTPUT_DIR)

WEBAPPS_DIR = web-apps
WEBAPPS = $(OUTPUT)/$(WEBAPPS_DIR)
NODE_MODULES = build/node_modules ../web-apps/build/node_modules
WEBAPPS_FILES = ../web-apps/deploy/web-apps/apps/documenteditor/main/app.js ../web-apps/deploy/web-apps/apps/presentationeditor/main/app.js ../web-apps/deploy/web-apps/apps/spreadsheeteditor/main/app.js
SDKJS_FILES = word/sdk-all.js cell/sdk-all.js slide/sdk-all.js

all: $(WEBAPPS)

$(WEBAPPS): $(WEBAPPS_FILES)
	mkdir -p $(OUTPUT)/$(WEBAPPS_DIR) && \
		cp -r -t $(OUTPUT)/$(WEBAPPS_DIR) ../$(WEBAPPS_DIR)/deploy/** 

$(WEBAPPS_FILES): $(NODE_MODULES) $(SDKJS_FILES)
	cd ../$(WEBAPPS_DIR)/build  && \
		$(GRUNT) deploy-$(filter %editor,$(subst /, ,$(@D))) $(GRUNT_FLAGS)

$(NODE_MODULES):
	cd $(@D) && \
		npm install

$(SDKJS_FILES): $(NODE_MODULES)
	cd build && \
		$(GRUNT) build_$(@D) $(GRUNT_FLAGS)
	
clean:
	rm -f $(WEBAPPS_FILES) $(SDKJS_FILES)
