# Next Start CLI

A CLI tool to quickly create and set up Next.js projects with shadcn/ui components.

## Features

- Creates a new Next.js project with TypeScript, Tailwind CSS, and ESLint
- Initializes and configures shadcn/ui
- Option to add common shadcn/ui components
- Optional admin dashboard setup with pre-configured components:
  - Sidebar navigation
  - Login page

## Installation

```sh
npm install -g next-start-cli
```

## Usage

Run the CLI:

```sh
next-start-cli
```

With admin dashboard:

```sh
next-start-cli --admin
```

Without git commiting changes made by CLI tool:
```sh
next-start-cli --no-git
```
Note:
#### Use ```--no-git``` when tesing locally for development

<br>
The CLI will guide you through:

- Project name selection
- Next.js version selection
- shadcn/ui theme configuration
- Component installation

## Project Structure

The generated project includes:

```
my-app/
├── src/
│   ├── app/
│   │   ├── dashboard/ # Admin dashboard (if --admin flag used)
│   │   └── login/     # Login page (if --admin flag used)
│   └── components/
│       └── ui/        # shadcn/ui components
```

## Options

- `--admin` or `-a`: Includes admin dashboard components
- `--no-git`: Skit changes commiting in CLI tool

## Development

## License

ISC

## Author

Yasith Silva