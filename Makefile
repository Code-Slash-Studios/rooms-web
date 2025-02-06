init:
	npm install

run:
	podman build . -t rooms-web
	podman run --name rooms-web-container -p 8081:8081 rooms-web

run-prod:
	podman build . -t rooms-web-prod
	podman run --name rooms-web-container-prod -p 8080:8080 rooms-web-prod

stop:
	podman stop rooms-web-container
stop-prod:
	podman stop rooms-web-container-prod

build:
	npm run build

prod:
	make build
	npm run start

dev:
	make build
	npm run dev

test:
	npx remix vite:build --dry-run

local:
	podman build . -t rooms-web
	podman run -d --name rooms-web-container -p 8081:8081 rooms-web

restart:
	systemctl restart rooms-web
