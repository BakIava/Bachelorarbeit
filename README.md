# Docker Setup 

You can start the containers by following command:

```
    docker compose up
```

This will pull the images from the Docker Hub. 

To start your local state follow these steps:

1. First build backend:
1.1 Execute command in `./backend` directory: 

```
    npm i
```

1.2 Execute command in `./backend` directory:

```
    npm run build
```

2. Now build frontend:
2.1 Execute command in `./frontend` directory: 

```
    npm i
```

2.2 Execute command in `./frontend` directory: 

```
    ng build --prod
```

3. Now execute following to start local containers command:

```
    docker compose -f .\docker-compose-local.yml up
```