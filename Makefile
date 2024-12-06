init:
	npm install


run:
	docker compose build
	docker compose up -d
stop:
	docker compose down

build:
	npx remix vite:build

prod:
	build
	npm start
dev:
	npm run dev

test:
	npx remix vite:build --dry-run