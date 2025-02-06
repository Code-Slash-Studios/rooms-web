init:
	npm install

build:
	podman build . t rooms-web

run:
	make build
	podman run --name rooms-web-container -p 8081:8081 rooms-web

build-prod:
	podman build . -t rooms-web-prod

run-prod:
	make build-prod
	podman run --name rooms-web-container-prod -p 8080:8080 rooms-web-prod

stop:
	podman stop rooms-web-container
stop-prod:
	podman stop rooms-web-container-prod

prod:
	npm run build
	npm run start
dev:
	npm run build
	npm run dev

test:
	npx remix vite:build --dry-run

local:
	podman build . -t rooms-web
	podman run -d --name rooms-web-container -p 8081:8081 rooms-web

restart:
	systemctl restart rooms-web
