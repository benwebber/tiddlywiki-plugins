.PHONY: all install clean

export PATH := ./node_modules/.bin:$(PATH)

SOURCES := $(shell find doc/ src/)

all: index.html

clean:
	$(RM) index.html

install:
	yarn install

index.html: $(SOURCES)
	tiddlywiki --version
	tiddlywiki doc/ --verbose --build
