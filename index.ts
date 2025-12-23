#!/usr/bin/env bun

import { mkdir, rename, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import {
  confirm,
  group,
  intro,
  isCancel,
  multiselect,
  type Option,
  outro,
  select,
  tasks,
  text,
} from '@clack/prompts'
import { $, file, sleep, spawn, write } from 'bun'
import color from 'picocolors'
import { description, version } from './package.json'
import {
  editJson,
  editYaml,
  getAvailableFolderName,
  handleCancel,
  initWorkspace,
} from './utils'

import type { CLIOptions, ResponseType } from './utils/types'

//
// Destructure text styles for easier access
//

const {
  bold: BOLD,
  // italic: ITALIC,
  underline: UNDERLINE,
  dim: DIM,
  // strikethrough: STRIKE,
} = color

const __cwd = process.cwd()
const cliOptions: CLIOptions = {
  objective: [
    { value: 'create', label: 'Create a new workspace' },
    { value: 'update', label: 'Update an existing workspace' },
    { value: 'exit', label: 'Exit' },
  ],
  projects: [
    {
      value: 'apps',
      label: 'Create new web apps.',
      // hint: "React, Vite, Tanstack",
      types: [
        {
          value: 'react',
          label: 'React',
          hint: '👍 minimal',
          callback: (name: string) => `bun init --react=shadcn ${name}`,
        },
        {
          value: 'vite',
          label: 'Vite',
          hint: '👍 WebXR',
          callback: (name: string) =>
            `bun create vite ${name} --template react-ts`,
        },
        {
          value: 'tanstack',
          label: 'Tanstack',
          hint: '👍 full-stack',
          callback: (name: string) =>
            `bun create @tanstack/start@latest ${name} --framework React --package-manager bun --toolchain biome --tailwind --no-git --add-ons shadcn,nitro`,
        },
      ],
    },
    {
      value: 'docs',
      label: 'Create new documentation.',
      // hint: "via Quarto",
      types: [
        {
          value: 'default',
          label: 'Default',
          hint: '👍 minimal document',
          callback: (name: string) =>
            `quarto create project default ${name} --no-open --no-prompt --quiet`,
        },
        {
          value: 'manuscript',
          label: 'Manuscript',
          hint: '👍 for print',
          callback: (name: string) =>
            `quarto create project manuscript ${name} --no-open --no-prompt --quiet`,
        },
        // {
        //   value: "book",
        //   label: "Booklet",
        //   hint: "👍 for web docs",
        //   callback: function (name: string) {
        //     return `quarto create project book ${name} --no-open --no-prompt --quiet`;
        //   },
        // },
        // {
        //   value: "blog",
        //   label: "Blogs",
        //   hint: "👍 for blog sites",
        //   callback: function (name: string) {
        //     return `quarto create project blog ${name} --no-open --no-prompt --quiet`;
        //   },
        // },
        {
          value: 'revealjs',
          label: 'Reveal.js',
          hint: '👍 for presentations',
          callback: (name: string) =>
            `quarto create project default ${name} --no-open --no-prompt --quiet`,
        },
      ],
    },
  ],
}

//
// Main function
//

async function main() {
  // Welcome message
  console.clear()
  console.info(DIM(`Welcome! ${description}\n`))

  // Start of CLI process
  intro(color.bgCyan(BOLD(` create-workspace `)) + DIM(` v${version}`))

  const { objective, name, overwrite, projects } = (await group(
    {
      objective: () =>
        select({
          message: 'What would you like to do?',
          options: cliOptions.objective as Option<string>[],
          initialValue: 'create',
        }).then((result) => {
          // Exit if user wants to
          result === 'exit' && handleCancel()
          return result
        }),
      name: ({ results: { objective } }) =>
        text({
          message: 'Enter the workspace name:',
          placeholder: objective === 'update' ? './' : 'my-workspace',
          validate(value) {
            if (value.length === 0) return `Value is required!`
            if (value.length > 20) return `Value is too long!`
            if (value.includes(' ')) return `Value cannot contain spaces!`
            if (
              objective === 'update' &&
              !file(resolve(__cwd, value, 'package.json')).size
            )
              return `Workspace does not exist!`
          },
        }),
      overwrite: async ({ results: { objective, name } }) => {
        if (objective === 'update') return false

        if (!file(resolve(__cwd, name as string, 'package.json')).size)
          return false

        const response = await confirm({
          message: `${color.yellowBright(BOLD('WARNING:'))} Workspace "${name}" already exists. Do you want to ${UNDERLINE('overwrite')} it?`,
          initialValue: false,
        })

        !response && handleCancel() // Exit if user does not want to overwrite

        return response
      },
      projects: async ({ results: { name } }) => {
        const types = (await multiselect({
          message: `Add projects to the workspace (${name})?`,
          options: cliOptions.projects as unknown as Option<string>[],
          required: false,
        })) as string[]

        if (types.length === 0) return []

        isCancel(types) && handleCancel()

        const apps =
          types.includes('apps') &&
          ((await multiselect({
            message: 'Select web app framework(s)',
            options: cliOptions.projects?.find(
              (option) => option.value === 'apps',
            )?.types as Option<string>[],
            required: true,
          })) as string[])

        isCancel(apps) && handleCancel()

        const docs =
          types.includes('docs') &&
          ((await multiselect({
            message: 'Select document framework(s)',
            options: cliOptions.projects?.find(
              (option) => option.value === 'docs',
            )?.types as Option<string>[],
            required: true,
          })) as string[])

        isCancel(docs) && handleCancel()

        return {
          apps: apps || [],
          docs: docs || [],
        }
      },
    },
    { onCancel: handleCancel },
  )) as ResponseType

  // Confirm workspace creation
  const proceed = await confirm({
    message: color.inverse(
      `Proceed with ${
        objective === 'create' ? 'creating' : 'updating'
      } workspace?`,
    ),
  })

  // Exit if workspace creation is cancelled
  ;(isCancel(proceed) || !proceed) && handleCancel()

  const workspacePath = resolve(__cwd, name)

  // Create workspace
  const taskExecutions = await tasks([
    {
      title: 'Deleting existing workspace',
      task: async () => {
        await rm(workspacePath, { recursive: true, force: true }).finally(
          async () => await sleep(1000),
        )
        return 'Workspace deleted.'
      },
      enabled: objective === 'create' && overwrite,
    },
    {
      title: 'Creating workspace repository',
      task: async () => {
        await mkdir(workspacePath, { recursive: true }).finally(
          async () => await sleep(1000),
        )
        return 'Repository created.'
      },
      enabled: objective === 'create',
    },
    {
      title: 'Initializing workspace',
      task: async () => {
        await write(
          resolve(workspacePath, 'package.json'),
          JSON.stringify({ name: name }),
        )
          .then(async () => await initWorkspace(workspacePath))
          .finally(async () => await sleep(1000))

        return 'Workspace initialized.'
      },
      enabled: objective === 'create',
    },
    {
      title: 'Creating project(s)',
      task: async (message) => {
        await sleep(2000)

        const { apps, docs } = projects || { apps: [], docs: [] }

        if (apps.length > 0) {
          message('Creating web app(s)')

          const path = resolve(workspacePath, 'apps')
          await mkdir(path, { recursive: true })
          await editJson(resolve(workspacePath, 'package.json'), {
            workspaces: ['apps/*'],
          })

          await Promise.all(
            apps.map(async (entry) => {
              const callback = cliOptions.projects
                ?.find((option) => option.value === 'apps')
                ?.types?.find((option) => option.value === entry)?.callback

              if (!callback) return

              const projectRepo = getAvailableFolderName(path, entry)

              const main = spawn(callback(projectRepo).split(' '), {
                cwd: path,
                stdio: ['ignore', 'ignore', 'ignore'],
              })

              await main.exited
            }),
          )
        }

        // Wait for clean finish
        await sleep(1000)

        if (docs.length > 0) {
          message('Creating documentation')

          const path = resolve(workspacePath, 'docs')
          await mkdir(path, { recursive: true })
          await editJson(resolve(workspacePath, 'package.json'), {
            workspaces: ['docs/*'],
          })

          await Promise.all(
            docs.map(async (entry) => {
              const callback = cliOptions.projects
                ?.find((option) => option.value === 'docs')
                ?.types?.find((option) => option.value === entry)?.callback

              if (!callback) return

              const projectRepo = getAvailableFolderName(path, entry)

              const main = spawn(callback(projectRepo).split(' '), {
                cwd: path,
                stdio: ['ignore', 'ignore', 'ignore'],
              })

              await main.exited

              await Promise.all(
                [
                  'mcanouil/quarto-highlight-text',
                  'mcanouil/quarto-external',
                  'jmgirard/honeypot',
                  'quarto-ext/fontawesome',
                ].map(async (extension) => {
                  const main = spawn(
                    ['quarto', 'add', extension, '--quiet', '--no-prompt'],
                    {
                      cwd: resolve(path, projectRepo),
                      stdio: ['ignore', 'ignore', 'ignore'],
                    },
                  )

                  await main.exited
                }),
              )

              await write(
                resolve(path, projectRepo, 'package.json'),
                JSON.stringify({
                  name: projectRepo,
                  version: '0.0.1',
                  description: 'A quarto project',
                  scripts: {
                    dev: 'quarto preview index.qmd',
                    render: 'quarto render',
                  },
                }),
              )

              await editYaml(resolve(path, projectRepo, '_quarto.yml'), {
                project: {
                  'execute-dir': 'file',
                  'output-dir': 'render',
                  // render: ["pages"],
                  resources: ['public'],
                },
                execute: { echo: false, output: false, enabled: true },
                // bibliography: ['references.bib', 'extra-references.bib'],
                'cite-method': 'citeproc',
                crossref: {
                  'thm-prefix': 'RQ',
                  'thm-title': 'Research Question',
                },
                filters: [
                  // 'custom-callout',
                  'highlight-text',
                ],
                'callout-appearance': 'simple',
                // 'custom-callout': {
                //   todo: {
                //     title: 'TODO',
                //     'icon-symbol': 'fa-note-sticky',
                //     color: '#ffc400ff',
                //   },
                // },
                colorlinks: true,
                'number-sections': true,
                mermaid: { theme: 'neutral' },
              })

              if (
                projectRepo.includes('default') ||
                projectRepo.includes('revealjs')
              ) {
                await rename(
                  resolve(path, projectRepo, `${projectRepo}.qmd`),
                  resolve(path, projectRepo, 'index.qmd'),
                )

                // Add Quarto plugins and packages if revealjs
                if (projectRepo.includes('revealjs')) {
                  await editYaml(resolve(path, projectRepo, '_quarto.yml'), {
                    'revealjs-plugins': ['attribution'],
                    format: 'rjs-revealjs',
                  })
                  await $`cnwx padd --project ${projectRepo} --pack rjs`
                    .cwd(workspacePath)
                    .quiet()
                }
              }
            }),
          )
        }

        // Wait for clean finish
        await sleep(1000)

        return 'Projects created.'
      },
      enabled:
        (projects && (projects?.apps?.length ?? 0) > 0) ||
        (projects?.docs?.length ?? 0) > 0,
    },
  ])

  isCancel(taskExecutions) && handleCancel()

  // Run final `bun install` task

  await $`bun install`.cwd(workspacePath).quiet()

  // End of CLI process
  outro(`Your workspace is ready! Opening in ${color.blue('VSCode')}.`)

  await $`code ${workspacePath}`.quiet()
}

//
// Run the main function and close cleanly
//

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
