init:
	npm install


run:
	docker compose build
	docker compose up -d
stop:
	docker compose down

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