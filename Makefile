CSS := $(shell find src -type f -name '*.css' ! -name '*.min.css')
MIN_CSS := $(patsubst %.css, %.min.css, $(CSS))

all: index.html

clean:
	$(RM) index.html
	$(RM) $(MIN_CSS)

index.html: $(MIN_CSS)
	yarn run tiddlywiki --version
	yarn run tiddlywiki doc/ --verbose --build

%.min.css: %.css
	yarn run tailwindcss -m -i $< -o $@
