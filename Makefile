.PHONY: all clean deploy

CSS := $(shell find src -type f -name '*.css' ! -name '*.min.css')
MIN_CSS := $(patsubst %.css, %.min.css, $(CSS))
TS := $(shell find src -type f -name '*.ts')
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

index.html: $(MIN_CSS) $(MIN_JS)
	yarn run tiddlywiki --version
	yarn run tiddlywiki doc/ --verbose --build

%.min.css: %.css
	yarn run tailwindcss -m -i $< -o $@

%.min.js: %.ts
	yarn run tsc
	terser $*.js -o $@
