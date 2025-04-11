init:
	npm install

build-l:
	podman build . -t rooms-web

run-l:
	make build-l
	podman run --name rooms-web-container -p 8081:8080 -d rooms-web

build-prod:
	podman build . -t rooms-web-prod

run-prod:
	make build-prod
	podman run --name rooms-web-container-prod -p 8080:8080 -d rooms-web-prod

stop:
	podman stop rooms-web-container
stop-prod:
	podman stop rooms-web-container-prod
kill-prod:
	podman stop rooms-web-container-prod
	podman rm rooms-web-container-prod

prod:
	npm run build
	npm run start
dev:
	npm run build
	npm run dev

test:
	npx remix vite:build --dry-run
