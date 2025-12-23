//
// Helpers
//

import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { cancel } from '@clack/prompts'
import { file, Glob, spawn, write } from 'bun'
import color from 'picocolors'
import YAML from 'yaml'

import type { PaddType } from './types'

//
// Constants
//

const __cwd = process.cwd()
const {
  bold: BOLD,
  // italic: ITALIC,
  // underline: UNDERLINE,
  dim: DIM,
  // strikethrough: STRIKE,
} = color

//
// Functions
//

function handleCancel() {
  cancel('Operations cancelled. Exiting...')
  process.exit(0)
}

function deepMerge(
  // biome-ignore lint/suspicious/noExplicitAny: No clear type for expected data
  source: { [key: string]: any },
  // biome-ignore lint/suspicious/noExplicitAny: No clear type for expected data
  target: { [key: string]: any },
  // biome-ignore lint/suspicious/noExplicitAny: No clear type for expected data
): { [key: string]: any } {
  const result = { ...source }

  for (const key in target) {
    if (Object.hasOwn(target, key)) {
      if (Array.isArray(target[key]) && Array.isArray(result[key])) {
        result[key] = Array.from(new Set([...result[key], ...target[key]]))
      } else if (
        typeof target[key] === 'object' &&
        target[key] !== null &&
        typeof result[key] === 'object' &&
        result[key] !== null
      ) {
        result[key] = deepMerge(result[key], target[key])
      } else {
        result[key] = target[key]
      }
    }
  }

  return result
}

// biome-ignore lint/suspicious/noExplicitAny: No clear type for expected data
async function editJson(path: string, data: { [key: string]: any }) {
  const details: JSON = await file(resolve(__cwd, path)).json()

  const payload = deepMerge(details, data)

  await write(resolve(path), JSON.stringify(payload, null, 2))

  return true
}

// biome-ignore lint/suspicious/noExplicitAny: No clear type for expected data
async function editYaml(path: string, data: { [key: string]: any }) {
  const raw = await file(resolve(__cwd, path))
    .text()
    .catch(() => '')

  const details = raw.trim() ? YAML.parse(raw) : {}

  const payload = deepMerge(details, data)

  await write(resolve(path), YAML.stringify(payload))

  return true
}

async function initWorkspace(path: string) {
  const tasks = [
    await editJson(resolve(path, 'package.json'), {
      version: '0.1.0',
      private: true,
      workspaces: [],
      scripts: {
        check:
          'biome check --write --error-on-warnings --diagnostic-level=warn',
        do: 'bun run --filter',
        'do:all': "bun run --filter='*'",
        pull: 'cnwx sync --restore',
        push: 'cnwx sync',
        prepush: 'bun check',
      },
      devDependencies: {
        '@biomejs/biome': 'latest',
      },
    }),

    write(
      resolve(path, 'biome.json'),
      await file(resolve(__dirname, '../', 'biome.json')).json(),
    ),

    write(
      resolve(path, '.vscode', 'tasks.json'),
      await file(resolve(__dirname, '../', '.vscode', 'tasks.json')).json(),
    ),

    write(
      resolve(path, '.vscode', '..code-workspace'),
      await file(
        resolve(__dirname, '../', '.vscode', '..code-workspace'),
      ).json(),
    ),

    write(
      resolve(path, '.gitignore'),
      await file(resolve(__dirname, '../', '.gitignore')).text(),
    ),
  ]

  await Promise.all(tasks)
}

function getAvailableFolderName(path: string, name: string): string {
  let nextName = `${name}${1}`
  let i = 2
  while (file(resolve(path, `${nextName}`)).size > 0) {
    nextName = `${name}${i}`
    i++
  }
  return nextName
}

async function syncRepositories(
  type: 'backup' | 'restore',
  source: string,
  destination: string,
) {
  const glob = new Glob('**/*')
  const counts = {
    added: 0,
    updated: 0,
    deleted: 0,
  }
  const files = [] as string[]

  const sourceFiles = await Array.fromAsync(glob.scan({ cwd: source }))

  const destFiles =
    file(destination).size > 0
      ? await Array.fromAsync(glob.scan({ cwd: destination }))
      : []

  if (type === 'backup') {
    const hasIgnores = file(resolve(source, '.gitignore')).size > 0

    if (!hasIgnores) files.push(...sourceFiles)
    else {
      const excludes = await file(resolve(source, '.gitignore'))
        .text()
        .then((text) =>
          text
            .split('\n')
            .map((line) => line.replace(/[*\r\n]/g, ''))
            .filter((line) => !line.startsWith('#') && line.trim() !== ''),
        )

      const filteredFiles = sourceFiles.filter(
        (file) => !excludes.some((exclusion) => file.includes(exclusion)),
      )

      files.push(...filteredFiles)
    }
  } else if (type === 'restore') {
    files.push(...sourceFiles)
  }

  for (const thisFile of files) {
    const sourceFile = file(resolve(source, thisFile))
    const destFile = file(resolve(destination, thisFile))

    const sourceFileStat = await sourceFile.stat()
    const destFileStat = await destFile.stat().catch(() => undefined)

    if (!destFileStat)
      await write(
        resolve(destination, thisFile),
        await sourceFile.arrayBuffer(),
      ).then(() => counts.added++)
    else if (destFileStat.atimeMs < sourceFileStat.mtimeMs)
      await write(
        resolve(destination, thisFile),
        await sourceFile.arrayBuffer(),
      ).then(() => counts.updated++)
  }

  if (type === 'backup') {
    const filesToDelete = destFiles.filter(
      (destFile) => !files.some((file) => file === destFile),
    )

    await Promise.all(
      filesToDelete.map(
        async (fileToDelete) =>
          await rm(resolve(destination, fileToDelete), {
            recursive: true,
            force: true,
          }).then(() => counts.deleted++),
      ),
    )
  }

  return counts
}

async function runPadd(project: string, pack: PaddType, withExtras = false) {
  const {
    type,
    folder,
    dependencies,
    devDependencies,
    postinstalls,
    scripts,
    extras,
    destination,
  } = pack

  const src = resolve(__dirname, '../', 'resources', `${type}s`)
  const dest = resolve(__cwd, `${type}s`, project)

  if (folder) {
    const resourcePath = resolve(src, folder)
    const copyPath = resolve(dest, destination || '_extensions', folder)

    await syncRepositories('backup', resourcePath, copyPath)
      .then(() =>
        console.log(DIM('Copied components from ') + BOLD(color.green(folder))),
      )
      .catch(() =>
        console.log(DIM('Failed to copy ') + BOLD(color.red(folder))),
      )
  }

  if (dependencies) {
    const packs = dependencies

    withExtras && extras.dependencies && packs.push(...extras.dependencies)

    const process = spawn(['bun', 'add', ...packs], {
      cwd: dest,
      stdio: ['ignore', 'ignore', 'ignore'],
    })

    await process.exited
      .then(() => console.log(DIM('Installed dependencies')))
      .catch(() => console.warn('Failed to install some dependencies'))
  }

  if (devDependencies) {
    const packs = devDependencies

    withExtras &&
      extras.devDependencies &&
      packs.push(...extras.devDependencies)

    const process = spawn(['bun', 'add', '--dev', ...packs], {
      cwd: dest,
      stdio: ['ignore', 'ignore', 'ignore'],
    })

    await process.exited
      .then(() => console.log(DIM('Installed dev dependencies')))
      .catch(() => console.warn('Failed to install some dev dependencies'))
  }

  if (postinstalls) {
    let successes = 0
    for (const installation of postinstalls) {
      const commands = installation.split(' ')
      const process = spawn(commands, {
        cwd: dest,
        stdio: ['ignore', 'ignore', 'ignore'],
      })
      await process.exited.then(() => successes++)
    }

    if (successes === postinstalls.length)
      console.log(DIM('Successfully ran all post installations'))
    else
      console.warn(
        `Successfully ran ${successes} out of ${postinstalls.length} post installations`,
      )
  }

  if (scripts) {
    const success =
      (await editJson(resolve(dest, 'package.json'), {
        scripts,
      })) || false
    if (success) console.log(DIM('Added scripts'))
    else console.log(DIM('Failed to add scripts'))
  }
}

export {
  handleCancel,
  deepMerge,
  editJson,
  editYaml,
  initWorkspace,
  getAvailableFolderName,
  syncRepositories,
  runPadd,
}
