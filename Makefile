CONTAINER=RVJ
IMAGE=rvj-img
LAUNCH=docker run --name $(CONTAINER) -d -p 3000:3000 -v $(shell pwd):/app $(IMAGE) deno task start

init:
	docker build -t $(IMAGE) . && $(LAUNCH)

up:
	$(LAUNCH)

stop:
	docker stop $(CONTAINER)

down:
	docker rm -v $(CONTAINER)

sh:
	docker exec -it $(CONTAINER) sh

ps:
	docker ps