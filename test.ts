import { $ } from 'bun'

await $`quarto create project book test --no-open --no-prompt --quiet`.quiet()

process.exit(0)
