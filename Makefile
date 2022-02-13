all: index.html

clean:
	$(RM) index.html
	$(RM) src/plugins/motion/files/styles.min.css

index.html: src/plugins/motion/files/styles.min.css
	yarn run tiddlywiki --version
	yarn run tiddlywiki doc/ --verbose --build

%.min.css: %.css
	yarn run tailwindcss -m -i $< -o $@
