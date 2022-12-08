# Docker Setup 

You can start the containers by following command:

```
    docker compose up
```

This will pull the images from the Docker Hub. 


# Local Docker Setup

To start your local state follow these steps:

First build backend:
1. Execute command in `./backend` directory: 

```
    npm i
```

2. Execute command in `./backend` directory:

```
    npm run build
```

Now build frontend:
1. Execute command in `./frontend` directory: 

```
    npm i
```

2. If you havent installed Angular CLI yet:

```
    npm install -g @angular/cli@13.3.3
```

3. Execute command in `./frontend` directory: 

```
    ng build --prod
```

Now execute following to start local containers command:

```
    docker compose -f .\docker-compose-local.yml up
```