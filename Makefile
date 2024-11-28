init:
	npm install

run:
	docker compose build
	docker compose up

stop:
	docker compose down

restart:
	systemctl restart rooms-web
