---
title: Docker Commands
description: A structured reference page for Docker commands, options, examples, and practical notes.
category: DevOps
tags:
     - Docker
     - Containers
     - DevOps
status: published
---

## 1. Docker Command Structure

Most Docker commands follow this pattern:

```bash
docker <command> <subcommand> [options] [arguments]
```

For example:

```bash
docker container run -d -p 8080:80 nginx
```

Breakdown:

```text
docker
  │
  ├── container
  │
  ├── run
  │
  ├── -d
  │
  ├── -p 8080:80
  │
  └── nginx
```

Docker also provides shorter aliases:

```bash
docker run
```

instead of:

```bash
docker container run
```

The official documentation describes `docker` as the base command for the Docker CLI. You can get command-specific help with `--help`. ([Docker Documentation][1])

---

# 2. The Most Important Commands

If you're learning Docker, master these first:

```text
docker version
docker info
docker pull
docker images
docker build
docker run
docker ps
docker stop
docker start
docker restart
docker rm
docker logs
docker exec
docker inspect
docker cp
docker stats
docker tag
docker push
docker login
docker volume
docker network
docker system
```

---

# 3. `docker version`

Displays Docker client and server/Engine version information. ([Docker Documentation][2])

### Syntax

```bash
docker version
```

### Useful option

```bash
docker version --format '{{.Server.Version}}'
```

Get only the server version.

```bash
docker version --format '{{.Client.Version}}'
```

Get client version.

```bash
docker version --format '{{json .}}'
```

Output JSON.

---

# 4. `docker info`

Displays information about the Docker Engine.

```bash
docker info
```

Useful for understanding:

```text
Containers
Images
Storage driver
Docker root directory
CPUs
Memory
Operating system
Architecture
Docker version
```

Useful diagnostic command:

```bash
docker info
```

---

# 5. `docker --help`

Very important.

```bash
docker --help
```

You can also ask for help on a specific command:

```bash
docker run --help
```

```bash
docker build --help
```

```bash
docker volume --help
```

```bash
docker network --help
```

Think of `--help` as your built-in Docker manual.

---

# 6. Image Commands

Images are managed with:

```bash
docker image
```

or shorthand commands such as:

```bash
docker images
```

---

## `docker images`

Lists local images.

```bash
docker images
```

Equivalent modern form:

```bash
docker image ls
```

### Useful options

```bash
docker images -a
```

Show all images, including intermediate/dangling images.

```bash
docker images -q
```

Only show image IDs.

```bash
docker images --no-trunc
```

Don't truncate IDs.

```bash
docker images --filter "dangling=true"
```

Filter results.

```bash
docker images --format "{{.Repository}}:{{.Tag}}"
```

Custom output.

---

# 7. `docker pull`

Downloads an image from a registry.

```bash
docker pull nginx
```

Specific tag:

```bash
docker pull nginx:1.27
```

Specific platform:

```bash
docker pull --platform linux/amd64 nginx
```

### Important concept

```text
Registry
   ↓
docker pull
   ↓
Local image
```

---

# 8. `docker build`

Builds an image from a Dockerfile.

```bash
docker build -t myapp .
```

Breakdown:

```text
docker build
     ↓
Build image

-t myapp
     ↓
Give image name "myapp"

.
     ↓
Current directory = build context
```

The official reference describes `docker image build` as building an image from a Dockerfile and lists options such as `--file`, `--tag`, `--build-arg`, `--no-cache`, `--pull`, `--platform`, and `--target`. ([Docker Documentation][3])

### Important options

#### `-t` / `--tag`

```bash
docker build -t myapp:1.0 .
```

Give the image a name/tag.

---

#### `-f` / `--file`

```bash
docker build -f Dockerfile.dev -t myapp:dev .
```

Use a different Dockerfile.

---

#### `--no-cache`

```bash
docker build --no-cache -t myapp .
```

Don't use previous build cache.

Useful when troubleshooting builds.

---

#### `--pull`

```bash
docker build --pull -t myapp .
```

Attempt to pull a newer version of the base image.

---

#### `--build-arg`

```bash
docker build \
  --build-arg VERSION=1.0 \
  -t myapp .
```

Pass a build-time variable.

Dockerfile:

```dockerfile
ARG VERSION
```

---

#### `--platform`

```bash
docker build --platform linux/amd64 -t myapp .
```

Build for a specific platform.

---

#### `--target`

Useful with multi-stage Dockerfiles:

```bash
docker build --target development -t myapp:dev .
```

---

# 9. `docker run`

This is arguably the most important Docker command.

```bash
docker run nginx
```

It creates and starts a new container from an image. If the image isn't available locally, Docker can pull it first. ([Docker Documentation][4])

General syntax:

```bash
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

---

# 10. `docker run -d`

Run in detached/background mode.

```bash
docker run -d nginx
```

Instead of keeping your terminal attached to the container, Docker returns the container ID.

```text
Terminal
   │
   └── container running in background
```

`-d` = `--detach`.

---

# 11. `docker run --name`

Give a container a meaningful name.

```bash
docker run --name my-nginx nginx
```

Instead of Docker generating a random name, you get:

```text
my-nginx
```

Then:

```bash
docker stop my-nginx
```

is easier to remember.

---

# 12. `docker run -p`

Publish a container port to the host.

```bash
docker run -p 8080:80 nginx
```

Meaning:

```text
Host port 8080
      ↓
Container port 80
```

Syntax:

```text
-p HOST_PORT:CONTAINER_PORT
```

For example:

```bash
docker run -p 3000:3000 myapp
```

```bash
docker run -p 8080:8080 backend
```

---

## Bind to a specific host address

```bash
docker run -p 127.0.0.1:8080:8080 myapp
```

This restricts the published port to the host's loopback interface rather than all host interfaces.

---

# 13. `docker run -e`

Set an environment variable.

```bash
docker run -e DB_HOST=mysql myapp
```

Multiple variables:

```bash
docker run \
  -e DB_HOST=mysql \
  -e DB_PORT=3306 \
  -e DB_NAME=ecommerce \
  myapp
```

---

# 14. `docker run --env-file`

Load environment variables from a file.

```bash
docker run --env-file .env myapp
```

Example `.env`:

```text
DB_HOST=mysql
DB_PORT=3306
DB_NAME=ecommerce
```

This is useful, but don't commit secrets into Git.

---

# 15. `docker run -v`

Mount a volume or bind mount.

### Named volume

```bash
docker run \
  -v mysql-data:/var/lib/mysql \
  mysql
```

Meaning:

```text
mysql-data
     ↓
/var/lib/mysql
```

### Bind mount

```bash
docker run \
  -v ./src:/app/src \
  myapp
```

Meaning:

```text
Host ./src
    ↓
Container /app/src
```

---

# 16. `--mount`

`--mount` is another, more explicit way to specify mounts.

Example volume:

```bash
docker run \
  --mount source=mysql-data,target=/var/lib/mysql \
  mysql
```

Bind mount:

```bash
docker run \
  --mount type=bind,source="$(pwd)/src",target=/app/src \
  myapp
```

### Beginner recommendation

Understand both:

```bash
-v
```

and:

```bash
--mount
```

`--mount` is more verbose but often easier to read for complicated mount configurations.

---

# 17. `docker run --network`

Attach a container to a network.

```bash
docker run \
  --network mynetwork \
  --name backend \
  myapp
```

Create network first:

```bash
docker network create mynetwork
```

Then:

```bash
docker run --network mynetwork --name mysql mysql
```

Now:

```text
backend
   │
   │
Docker network
   │
   ↓
mysql
```

---

# 18. `docker run --restart`

Configure container restart behavior.

Examples:

```bash
docker run --restart no myapp
```

```bash
docker run --restart always myapp
```

```bash
docker run --restart unless-stopped myapp
```

```bash
docker run --restart on-failure myapp
```

Useful for services that should automatically restart after failure or Docker daemon restarts.

---

# 19. `docker run -it`

Very common when working with shells.

```bash
docker run -it ubuntu bash
```

Two flags:

```text
-i
interactive

-t
pseudo-terminal
```

Together:

```bash
-it
```

means:

> Give me an interactive terminal.

---

# 20. `docker run --rm`

Automatically remove the container when it exits.

```bash
docker run --rm ubuntu echo "Hello"
```

Useful for temporary containers.

For example:

```bash
docker run --rm alpine uname -a
```

After the command finishes, the container is removed.

---

# 21. `docker run --hostname`

Set the container hostname.

```bash
docker run --hostname myserver nginx
```

---

# 22. `docker run --user`

Run the container process as a specific user.

```bash
docker run --user 1000:1000 myapp
```

Useful for avoiding unnecessary root execution.

---

# 23. `docker run --workdir`

Set the working directory.

```bash
docker run --workdir /app myapp
```

Inside the container:

```text
working directory = /app
```

---

# 24. Common `docker run` Pattern

You'll frequently write commands like:

```bash
docker run -d \
  --name backend \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=docker \
  --network app-network \
  backend:1.0
```

Read it as:

```text
-d
→ background

--name backend
→ container name

-p 8080:8080
→ publish port

-e ...
→ environment variable

--network app-network
→ connect to network

backend:1.0
→ image
```

---

# 25. `docker ps`

Shows running containers.

```bash
docker ps
```

Equivalent:

```bash
docker container ls
```

The official reference lists options including `-a`, `-f`, `--format`, `-n`, `-l`, `--no-trunc`, `-q`, and `-s`. ([Docker Documentation][5])

### Show all containers

```bash
docker ps -a
```

This includes stopped containers.

### Only IDs

```bash
docker ps -q
```

### Last created container

```bash
docker ps -l
```

### Last N containers

```bash
docker ps -n 5
```

### Don't truncate

```bash
docker ps --no-trunc
```

### Filter

```bash
docker ps --filter "status=running"
```

---

# 26. `docker start`

Starts an existing stopped container.

```bash
docker start mycontainer
```

Attach to it:

```bash
docker start -a mycontainer
```

Interactive:

```bash
docker start -ai mycontainer
```

`docker start` starts stopped containers; it does not create a new container. ([Docker Documentation][6])

This distinction is important:

```text
docker run
→ create + start NEW container

docker start
→ start EXISTING container
```

---

# 27. `docker stop`

Gracefully stop a running container.

```bash
docker stop mycontainer
```

Multiple:

```bash
docker stop container1 container2 container3
```

Timeout:

```bash
docker stop -t 30 mycontainer
```

Meaning:

> Give the process up to 30 seconds to stop before Docker forcefully terminates it.

---

# 28. `docker restart`

Restart a container.

```bash
docker restart mycontainer
```

With timeout:

```bash
docker restart -t 30 mycontainer
```

---

# 29. `docker kill`

Immediately terminate a container's main process.

```bash
docker kill mycontainer
```

You can specify a signal:

```bash
docker kill --signal SIGKILL mycontainer
```

Difference:

```text
stop
→ graceful shutdown

kill
→ immediate termination
```

---

# 30. `docker rm`

Remove a stopped container.

```bash
docker rm mycontainer
```

Multiple:

```bash
docker rm container1 container2
```

Force removal:

```bash
docker rm -f mycontainer
```

### Remove all stopped containers

```bash
docker container prune
```

Be careful with prune commands.

---

# 31. `docker logs`

View container logs.

```bash
docker logs mycontainer
```

Follow logs:

```bash
docker logs -f mycontainer
```

`-f` = follow.

Show timestamps:

```bash
docker logs -t mycontainer
```

Last 100 lines:

```bash
docker logs --tail 100 mycontainer
```

Logs since a particular time:

```bash
docker logs --since 10m mycontainer
```

Combine:

```bash
docker logs -f --tail 100 mycontainer
```

This is one of your most important debugging commands.

---

# 32. `docker exec`

Execute a command inside a **running** container.

```bash
docker exec mycontainer ls
```

Interactive shell:

```bash
docker exec -it mycontainer bash
```

If bash isn't available:

```bash
docker exec -it mycontainer sh
```

The official reference specifies that `docker exec` runs a new command inside a running container. ([Docker Documentation][7])

---

## Important `exec` options

### `-i`

Keep STDIN open:

```bash
docker exec -i mycontainer sh
```

### `-t`

Allocate a terminal:

```bash
docker exec -t mycontainer sh
```

Usually:

```bash
docker exec -it mycontainer sh
```

### `-u`

Run as a particular user:

```bash
docker exec -u 1000 -it mycontainer sh
```

### `-e`

Set environment variable for the command:

```bash
docker exec -e MODE=debug mycontainer env
```

### `-w`

Set working directory:

```bash
docker exec -w /app mycontainer pwd
```

---

# 33. `docker inspect`

Shows low-level information about a Docker object.

```bash
docker inspect mycontainer
```

You can inspect:

```text
container
image
volume
network
```

Examples:

```bash
docker inspect mycontainer
```

```bash
docker inspect myapp:1.0
```

```bash
docker inspect myvolume
```

Very useful for troubleshooting.

---

# 34. `docker stats`

Shows live resource usage.

```bash
docker stats
```

You can inspect one:

```bash
docker stats mycontainer
```

Typical information:

```text
CPU %
Memory usage
Memory %
Network I/O
Block I/O
PIDs
```

Useful options include:

```bash
docker stats --no-stream
```

Get a single snapshot instead of continuous streaming.

```bash
docker stats --all
```

Include stopped containers.

The official reference documents `--all`, `--format`, `--no-stream`, and `--no-trunc`. ([Docker Documentation][8])

---

# 35. `docker top`

Shows processes running inside a container.

```bash
docker top mycontainer
```

Useful when investigating what the container is actually running.

---

# 36. `docker cp`

Copy files between host and container.

### Container → host

```bash
docker cp mycontainer:/app/log.txt ./log.txt
```

### Host → container

```bash
docker cp ./config.json mycontainer:/app/config.json
```

Useful for quick inspection or transferring files.

---

# 37. `docker rename`

Rename a container.

```bash
docker rename old-name new-name
```

---

# 38. `docker attach`

Attach your terminal to the container's main process.

```bash
docker attach mycontainer
```

This is different from:

```bash
docker exec
```

### `exec`

Starts a **new process** inside the container.

```bash
docker exec -it mycontainer sh
```

### `attach`

Connects to the container's existing main process.

```bash
docker attach mycontainer
```

For normal debugging, `exec` is often what you want.

---

# 39. `docker create`

Creates a container without starting it.

```bash
docker create --name mycontainer nginx
```

Then:

```bash
docker start mycontainer
```

The official documentation explicitly describes `docker create` as creating the container without starting it. ([Docker Documentation][9])

Remember:

```text
docker create
→ create only

docker run
→ create + start
```

---

# 40. `docker image ls`

Modern structured form of:

```bash
docker images
```

```bash
docker image ls
```

Useful:

```bash
docker image ls -a
```

```bash
docker image ls -q
```

---

# 41. `docker image inspect`

```bash
docker image inspect myapp:1.0
```

Shows image metadata.

---

# 42. `docker image rm`

Remove an image.

```bash
docker image rm myapp:1.0
```

Alias:

```bash
docker rmi myapp:1.0
```

Force:

```bash
docker rmi -f myapp:1.0
```

You generally cannot remove an image that's still required by existing containers without first removing those containers or otherwise resolving the dependency.

---

# 43. `docker image prune`

Remove unused/dangling images.

```bash
docker image prune
```

Remove all unused images:

```bash
docker image prune -a
```

Be careful:

```bash
-a
```

can remove more images than you expect.

---

# 44. `docker tag`

Create another tag/reference for an image.

```bash
docker tag myapp:1.0 username/myapp:1.0
```

Now conceptually:

```text
myapp:1.0
      │
      └── username/myapp:1.0
```

The image itself isn't necessarily duplicated just because you added another tag.

---

# 45. `docker push`

Push an image to a registry.

```bash
docker push username/myapp:1.0
```

Typical workflow:

```bash
docker build -t myapp:1.0 .

docker tag myapp:1.0 username/myapp:1.0

docker login

docker push username/myapp:1.0
```

---

# 46. `docker login`

Authenticate with a registry.

```bash
docker login
```

For a specific registry:

```bash
docker login registry.example.com
```

For automation, Docker supports `--password-stdin` rather than putting a password directly into the command line. ([Docker Documentation][10])

Example:

```bash
echo "$TOKEN" | docker login --username USERNAME --password-stdin
```

Avoid:

```bash
docker login -u username -p password
```

because putting secrets directly in command arguments can expose them.

---

# 47. `docker logout`

Logout:

```bash
docker logout
```

Specific registry:

```bash
docker logout registry.example.com
```

---

# 48. Volume Commands

Docker volume commands:

```bash
docker volume
```

---

## List volumes

```bash
docker volume ls
```

---

## Create volume

```bash
docker volume create mydata
```

---

## Inspect volume

```bash
docker volume inspect mydata
```

---

## Remove volume

```bash
docker volume rm mydata
```

---

## Remove unused volumes

```bash
docker volume prune
```

Be careful: this removes unused volumes.

---

# 49. Network Commands

Main command:

```bash
docker network
```

---

## List networks

```bash
docker network ls
```

---

## Create network

```bash
docker network create mynetwork
```

---

## Inspect network

```bash
docker network inspect mynetwork
```

---

## Connect container

```bash
docker network connect mynetwork mycontainer
```

---

## Disconnect container

```bash
docker network disconnect mynetwork mycontainer
```

---

## Remove network

```bash
docker network rm mynetwork
```

---

## Remove unused networks

```bash
docker network prune
```

---

# 50. `docker system`

This is your Docker cleanup/diagnostics group.

```bash
docker system df
```

Shows Docker disk usage.

Very useful.

```bash
docker system prune
```

Remove unused Docker resources.

More aggressive:

```bash
docker system prune -a
```

Include unused images.

Include volumes:

```bash
docker system prune -a --volumes
```

⚠️ **Be very careful with this command.**

It can remove:

```text
stopped containers
unused networks
unused images
unused build cache
volumes, if --volumes is specified
```

Don't blindly use:

```bash
docker system prune -a --volumes
```

on a machine containing data you care about.

---

# 51. `docker system df`

One of the best commands when Docker is consuming lots of disk space:

```bash
docker system df
```

You can get more detailed information:

```bash
docker system df -v
```

---

# 52. `docker events`

Shows real-time Docker events.

```bash
docker events
```

Useful for advanced troubleshooting.

For example:

```text
container start
container stop
image pull
network create
volume create
```

---

# 53. `docker history`

Shows image layers/history.

```bash
docker history myapp:1.0
```

Very useful when learning:

```text
Dockerfile
   ↓
Layers
```

You can see the commands that contributed to the image history.

---

# 54. `docker diff`

Shows filesystem changes made inside a container.

```bash
docker diff mycontainer
```

This can show files that were:

```text
Added
Changed
Deleted
```

Useful for understanding the container's writable layer.

---

# 55. `docker export`

Export a container's filesystem as a tar archive:

```bash
docker export mycontainer -o container.tar
```

Important:

> This exports the container filesystem, not a normal Docker image with its layer history/configuration.

---

# 56. `docker import`

Create an image from a filesystem archive:

```bash
docker import container.tar myimage:1.0
```

This is less common in normal application development.

---

# 57. `docker save`

Save one or more Docker images to a tar archive.

```bash
docker save -o myapp.tar myapp:1.0
```

Useful for moving images without a registry.

---

# 58. `docker load`

Load an image archive:

```bash
docker load -i myapp.tar
```

Relationship:

```text
docker save
     ↓
 image.tar
     ↓
docker load
```

This is different from:

```text
docker export
     ↓
container filesystem
```

---

# 59. Important Difference: `save` vs `export`

### `docker save`

Works with:

```text
IMAGE
```

Preserves image information/layers.

### `docker export`

Works with:

```text
CONTAINER
```

Exports its filesystem as a tar archive.

Remember:

```text
docker save
→ image

docker export
→ container filesystem
```

---

# 60. `docker wait`

Wait for a container to stop and return its exit code.

```bash
docker wait mycontainer
```

Useful in scripts and automation.

---

# 61. `docker pause`

Pause processes inside a container:

```bash
docker pause mycontainer
```

Resume:

```bash
docker unpause mycontainer
```

Not something you'll use every day.

---

# 62. `docker update`

Update certain resource constraints/configuration for an existing container.

Example:

```bash
docker update --memory 512m mycontainer
```

CPU example:

```bash
docker update --cpus 1.5 mycontainer
```

Useful for resource management.

---

# 63. `docker rename`

```bash
docker rename old-name new-name
```

Simple but useful.

---

# 64. `docker search`

Search Docker Hub:

```bash
docker search nginx
```

For example:

```bash
docker search redis
```

For serious production decisions, inspect the image's publisher, documentation, security information, and provenance rather than choosing an image solely from a search result.

---

# 65. Useful Command Categories

Here's the structure I'd recommend memorizing:

```text
DOCKER
│
├── INFORMATION
│   ├── docker version
│   ├── docker info
│   └── docker --help
│
├── IMAGES
│   ├── docker pull
│   ├── docker build
│   ├── docker images
│   ├── docker image ls
│   ├── docker image inspect
│   ├── docker tag
│   ├── docker push
│   ├── docker rmi
│   ├── docker image prune
│   └── docker history
│
├── CONTAINERS
│   ├── docker run
│   ├── docker create
│   ├── docker ps
│   ├── docker start
│   ├── docker stop
│   ├── docker restart
│   ├── docker kill
│   ├── docker rm
│   ├── docker logs
│   ├── docker exec
│   ├── docker inspect
│   ├── docker cp
│   ├── docker stats
│   ├── docker top
│   ├── docker diff
│   └── docker rename
│
├── STORAGE
│   ├── docker volume ls
│   ├── docker volume create
│   ├── docker volume inspect
│   ├── docker volume rm
│   └── docker volume prune
│
├── NETWORK
│   ├── docker network ls
│   ├── docker network create
│   ├── docker network inspect
│   ├── docker network connect
│   ├── docker network disconnect
│   ├── docker network rm
│   └── docker network prune
│
├── REGISTRY
│   ├── docker login
│   ├── docker logout
│   ├── docker pull
│   ├── docker tag
│   └── docker push
│
└── SYSTEM
    ├── docker system df
    ├── docker system prune
    └── docker events
```

---

# 66. The Commands You Should Memorize First

Don't try to memorize everything above immediately.

Start with these:

### Information

```bash
docker version
docker info
docker --help
```

### Images

```bash
docker images
docker pull nginx
docker build -t myapp:1.0 .
docker tag myapp:1.0 username/myapp:1.0
docker push username/myapp:1.0
```

### Containers

```bash
docker run
docker ps
docker ps -a
docker start
docker stop
docker restart
docker rm
docker logs
docker exec
docker inspect
docker stats
```

### Volumes

```bash
docker volume ls
docker volume create
docker volume inspect
docker volume rm
```

### Networks

```bash
docker network ls
docker network create
docker network inspect
docker network connect
docker network disconnect
docker network rm
```

### Cleanup

```bash
docker image prune
docker container prune
docker volume prune
docker network prune
docker system df
docker system prune
```

---

# 67. The 15 Commands I Want You to Know Really Well

For your level, these are the core commands:

| Command          | Purpose                          |
| ---------------- | -------------------------------- |
| `docker pull`    | Download image                   |
| `docker build`   | Build image                      |
| `docker images`  | List images                      |
| `docker run`     | Create + start container         |
| `docker ps`      | List running containers          |
| `docker ps -a`   | List all containers              |
| `docker stop`    | Stop container                   |
| `docker start`   | Start existing container         |
| `docker restart` | Restart container                |
| `docker rm`      | Remove container                 |
| `docker logs`    | View logs                        |
| `docker exec`    | Execute command inside container |
| `docker inspect` | Detailed object information      |
| `docker volume`  | Manage persistent storage        |
| `docker network` | Manage container networking      |

Once these become comfortable, the rest of Docker becomes much easier.

---

# 68. Most Important `docker run` Flags

If you only memorize one group of options, memorize these:

```text
-d
--name
-p
-P
-e
--env-file
-v
--mount
--network
-it
--rm
--restart
--hostname
--user
-w
```

For example:

```bash
docker run -d \
  --name ecommerce-api \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=docker \
  --network ecommerce-network \
  --restart unless-stopped \
  ecommerce-api:1.0
```

If you can read this command comfortably, you're already becoming productive with Docker.

---

# 69. The Most Important Docker Workflow

Eventually your normal workflow will look like this:

```text
                 DEVELOPMENT
                      │
                      ↓
                 Dockerfile
                      │
                      │ docker build
                      ↓
                Docker Image
                      │
                      │ docker run
                      ↓
                 Container
                 /       \
                /         \
           Volume         Network
              │              │
              ↓              ↓
        Persistent       Other containers
           data
```

For distribution:

```text
Docker Image
     │
     │ docker tag
     ↓
username/myapp:1.0
     │
     │ docker push
     ↓
Registry
     │
     │ docker pull
     ↓
Production server
     │
     ↓
Container
```

---

# 70. One Command That Will Save You Constantly

When you don't know the options:

```bash
docker <command> --help
```

For example:

```bash
docker run --help
```

```bash
docker build --help
```

```bash
docker volume create --help
```

```bash
docker network create --help
```

Docker's official CLI documentation itself recommends using `--help` to display command help. ([Docker Documentation][1])

And the official Docker reference is the authoritative place to check the exact options for your installed/current Docker version. ([Docker Documentation][11])

---

# 71. What About Docker Compose?

You'll eventually encounter:

```bash
docker compose up
docker compose down
docker compose build
docker compose logs
docker compose exec
docker compose ps
```

Docker Compose is specifically for defining and running **multi-container applications**. ([Docker Documentation][12])

For example:

```text
Next.js
   +
Spring Boot
   +
MySQL
   +
Redis
```

But based on the learning path you requested earlier, I recommend that we **don't jump into Compose yet**.

You now have the terminology and command foundation needed for the next important topic:

# Next: Docker Under the Hood

We'll take this exact command:

```bash
docker run -d -p 8080:8080 myapp:1.0
```

and trace what happens internally:

```text
Docker CLI
     ↓
Docker API
     ↓
dockerd
     ↓
Docker Engine
     ↓
Image
     ↓
Container configuration
     ↓
container runtime
     ↓
Linux namespaces
     ↓
Linux cgroups
     ↓
Network
     ↓
Container process
```