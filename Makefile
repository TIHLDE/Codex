.PHONY: prod
prod:
	docker build -t codex.tihlde.org .
	- docker rm -f codex.tihlde.org
	docker run --env-file .env -p 5000:3000 --name codex.tihlde.org --restart unless-stopped -d codex.tihlde.org

