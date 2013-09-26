
build: components
	@component build

components: component.json
	@component install

clean:
	rm -rf build components

.PHONY: clean
