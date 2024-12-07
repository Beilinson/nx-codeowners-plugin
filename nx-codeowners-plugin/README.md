# nx-codeowners-plugin

An NX plugin alternative to `@nx/powerpack-codeowners`, aiming to provide a simpler API leveraging the basic `CODEOWNERS` syntax at the project level. By combining actual `CODEOWNERS` files at the project level, you can use your `git` implementation's syntax (github, gitlab, bitbucket), without requiring adding anything to your `project.json` files.

## Install

```bash
nx add nx-codeowners-plugin
```

# Generators

## Sync Workspace CODEOWNERS

Compile all the Project-level `CODEOWNERS` file to a single root `CODEOWNERS` file to be used by your given `Git` implementation (github, gitlab, bitbucket). The generator respects your existing base CODEOWNERS file, appending the project CODEOWNERS content to the end.

It is also recommended to setup as a [Global Sync Generator](https://nx.dev/concepts/sync-generators#global-sync-generators) and run `nx sync` as a git hook.

#### NX >= 19.8

```json
# ./nx.json
{
    ...,
    "sync": {
        "globalGenerators": ["nx-codeowners-plugin:sync-codeowners-file"]
    }
}
```

```bash
nx sync
```

#### NX < 19.8

```bash
nx generate nx-codeowners-plugin:sync-codeowners-file
```

### Example
#### Before:

```
# ./apps/myapp/CODEOWNERS
* @myorg/app-team
```

```
# ./CODEOWNERS
* @myorg/myteam
docs/* @myorg/docs-team
```

#### After

```
# ./CODEOWNERS
* @myorg/myteam
docs/* @myorg/docs-team

# NX-CODEOWNERS-PLUGIN
# The content below was auto-generated with nx-codeowners-plugin
# do not edit it by hand

# app: myapp
./apps/myapp/* @myorg/app-team
```

## Generate Project CODEOWNERS

Generate a native CODEOWNERS file for a target project:

```bash
nx generate nx-codeowners-plugin:codeowners --project=<PROJECT_NAME> --owners=<USERS_OR_GROUPS>
```

### Example:

```CODEOWNERS
# ./<PROJECT_DIR>/CODEOWNERS

* <USERS_OR_GROUPS>
```
