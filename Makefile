.PHONY: all clean deploy

CSS := $(shell find src -type f -name '*.css' ! -name '*.min.css')
MIN_CSS := $(patsubst %.css, %.min.css, $(CSS))
TS := $(shell find src -type f -name '*.ts')
MIN_JS := $(patsubst %.ts, %.min.js, $(TS))

all: index.html

clean:
	$(RM) index.html
	$(RM) $(MIN_CSS)

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
