BACKEND_IMAGE_NAME = server
BACKEND_IMAGE_TAG = latest

BACKEND_DIR = .

.PHONY: build up down

build:
	docker build -f $(BACKEND_DIR)/Dockerfile -t $(BACKEND_IMAGE_NAME):$(BACKEND_IMAGE_TAG) $(BACKEND_DIR)

up:
	docker-compose up -d

down:
	docker-compose down