# Backend Documentation

## Running for dev

1. install docker
   https://docs.docker.com/engine/install/ubuntu/

2. Install bun and node
   https://bun.sh/docs/installation
   https://nodejs.org/en/download/package-manager

3. To install dependencies:

   ```sh
    bun install
    cp .env.example .env
   ```

4. Get the container up and running:

   ```sh
    docker compose up
   ```

5. set dev db

   ```
    bun db:migrate
    bun db:seed
   ```

6. Run dev server:

   ```sh
    bun run dev
   ```

7. open http://localhost:3000

8. simple test: http://localhost:3000/api/v1/client/1

## Database Schema

https://dbdiagram.io/d/HajimeApp-66c7953da346f9518cd505b4
