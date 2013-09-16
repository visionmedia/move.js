
UGLIFY_FLAGS = --no-mangle

build: move.min.js components index.js
	@component build --dev

components: component.json
	@component install --dev

move.js: components
	@component build --standalone move --name move --out .

move.min.js: move.js
	@uglifyjs $(UGLIFY_FLAGS) $< > $@ \
	  && du -h move.js \
	  && du -h move.min.js

clean:
	rm -rf build move.js components move.min.js

.PHONY: clean
