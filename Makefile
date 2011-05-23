
move.min.js: move.js
	@uglifyjs $(UGLIFY_FLAGS) $< > $@ \
	  && du move.js \
	  && du move.min.js

clean:
	rm -f move.min.js

.PHONY: clean