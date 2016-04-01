GRUNT = grunt
GRUNT_FLAGS = --no-color -v 

OUTPUT_DIR = deploy
OUTPUT = $(OUTPUT_DIR)

WEBAPPS_DIR = web-apps
WEBAPPS = $(OUTPUT)/$(WEBAPPS_DIR)
GRUNT_FILES = build/Gruntfile.js.out ../web-apps/build/Gruntfile.js.out

all: $(WEBAPPS)

$(WEBAPPS): $(GRUNT_FILES)
	mkdir -p $(OUTPUT)/$(WEBAPPS_DIR) && \
		cp -r -t $(OUTPUT)/$(WEBAPPS_DIR) ../$(WEBAPPS_DIR)/deploy/** 

$(GRUNT_FILES):
	cd $(@D) && \
		npm install && \
		$(GRUNT) $(GRUNT_FLAGS)
	echo "Done" > $@
	
clean:
	rm -f $(GRUNT_FILES)
