init:
	npm install
	mkfile .env

build:
	podman build . -t rooms-web-image

podman:
	podman build . -t rooms-web-image
	podman run --name rooms-web -p 8080:8080 -d rooms-web-image

stop:
	podman stop rooms-web
kill:
	podman stop rooms-web
	podman rm rooms-web

prod:
	npm run build
	npm run start
dev:
	npm run build
	npm run dev

test:
	npx remix vite:build --dry-run
