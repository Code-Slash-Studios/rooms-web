init:
	npm install

local:
	docker compose build
	docker compose up -d

run:
	docker compose build
	docker compose up

stop:
	docker compose down

restart:
	systemctl restart rooms-web
