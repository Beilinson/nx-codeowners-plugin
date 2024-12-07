# nx-codeowners-plugin

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>
# nx-codeowners-plugin

An NX plugin alternative to `@nx/powerpack-codeowners`, aiming to provide a simpler API leveraging the basic `CODEOWNERS` syntax at the project level. By combining actual `CODEOWNERS` files at the project level, you can use your `git` implementation's syntax (github, gitlab, bitbucket), without requiring adding anything to your `project.json` files.

## Build

```bash
nx build nx-codeowners-plugin
```

## Test

```bash
nx test nx-codeowners-plugin
```