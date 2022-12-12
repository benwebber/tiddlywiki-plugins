.PHONY: all clean deploy test

CSS := $(shell find src -type f -name '*.css' ! -name '*.min.css')
MIN_CSS := $(patsubst %.css, %.min.css, $(CSS))
TS := $(shell find src -type f -name '*.ts' ! -name '*.d.ts')
JS := $(patsubst %.ts, %.js, $(TS))
MIN_JS := $(patsubst %.js, %.min.js, $(JS))

all: dist/index.html dist/library/index.html

clean:
	$(RM) dist/index.html
	$(RM) -r dist/library

cleanall: clean
	$(RM) $(MIN_CSS)
	$(RM) $(JS)
	$(RM) $(MIN_JS)

deploy:
	./bin/deploy

test: $(MIN_JS)
	yarn run tiddlywiki test/

dist/index.html: $(MIN_CSS) $(MIN_JS)
	yarn run tiddlywiki --version
	yarn run tiddlywiki doc/ --output dist/ doc/ --verbose --build index

dist/library/index.html: dist/index.html
	TIDDLYWIKI_PLUGIN_PATH=doc/ yarn run tiddlywiki doc/ --output dist/library --verbose --build library

%.min.css: %.css
	yarn run tailwindcss --input $< --output $@ --minify --content "$(shell echo $< | cut -d/ -f1-3 | sed 's|$$|/**/*.tid|')"

%.min.js: %.ts
	yarn run tsc
	terser $*.js -o $@
