## Delivery notes:

- This submission was completed in 19 hours, in two sits (Thursday - 10 hours, Sunday: 9 hours). I wanted to get this implementation with even more features but given the hard deadline and the crappy week with a family trip of 3 days included I wasn't able to do more.

## Project Notes:

- Using pnpm as the package manager: `npm i pnpm`
- When starting the Libretranslate container, by design it takes random times to download the language, and it may even crash when doing so. You can restart the container if it fails and it should be good. If anything, you can login into the container and install the language models directly running
```bash
./venv/bin/python scripts/install_models.py --load_only_lang_codes "$models";
```

# BACKEND

## Stack: PNPM + Nest Framework + Libretranslate + PostgreSQL

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

- Copy the backend/.env.example file to backend/.env
- Make modifications as you see fit

## Docker container

Docker compose starts the following containers:
- Backend API
- PostgreSQL
- Libretranslate

```bash
# clean slate
docker-compose build -no-cache
# spin
docker-compose up
```

This is the recommended setup. You can run the backend API locally if you want, and use your local pg db as well, up to you. For Libretranslate you'd need to setup a local server, the app does not support external hosts (I didn't add the key param when calling the API).

## Running the backend api without containers

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# test coverage
$ pnpm run test:cov
```

### Libraries used
- class-transformer: For otf transformations
- class-validator: For validation decorators
- typeorm: Our ORM

# FRONTEND

## Stack: PNPM + Vite + React + Cypress

- Copy the backend/.env.example file to backend/.env
- Make modifications as you see fit

## Docker container

Docker compose starts the following containers:
- Frontend API

```bash
# clean slate
docker-compose build -no-cache
# spin
docker-compose up
```


### Run the app locally
```bash
pnpm run dev
```

### Run e2e Tests (console)
```bash
pnpm run e2e
```

### Run e2e Tests (UI)
```bash
pnpm run e2e:open
```

### Libraries used

- moment: Date handling
- cypress: E2E tests
- vite: Our development server
- TailwindCSS: Styling
- react-device-detect: Used to detect mobile devices


## License

Nest is [MIT licensed](LICENSE).

