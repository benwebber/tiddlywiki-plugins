.PHONY: all clean deploy test

CSS := $(shell find src -type f -name '*.css' ! -name '*.min.css')
MIN_CSS := $(patsubst %.css, %.min.css, $(CSS))
TS := $(shell find src -type f -name '*.ts' ! -name '*.d.ts')
JS := $(patsubst %.ts, %.js, $(TS))
MIN_JS := $(patsubst %.js, %.min.js, $(JS))

all: index.html

clean:
	$(RM) index.html
	$(RM) $(MIN_CSS)
	$(RM) $(JS)
	$(RM) $(MIN_JS)

deploy:
	./bin/deploy

test: $(MIN_JS)
	yarn run tiddlywiki test/

index.html: $(MIN_CSS) $(MIN_JS)
	yarn run tiddlywiki --version
	yarn run tiddlywiki doc/ --verbose --build

%.min.css: %.css
	yarn run tailwindcss --input $< --output $@ --minify --content "$(shell echo $< | cut -d/ -f1-3 | sed 's|$$|/**/*.tid|')"

%.min.js: %.ts
	yarn run tsc
	terser $*.js -o $@
