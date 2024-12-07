import { formatFiles, generateFiles, joinPathFragments, OverwriteStrategy, readProjectConfiguration, Tree } from '@nx/devkit';
import { CodeownersGeneratorSchema } from './schema';

export async function codeownersGenerator(tree: Tree, options: CodeownersGeneratorSchema) {
  const project = readProjectConfiguration(tree, options.project);
  generateFiles(tree, joinPathFragments(__dirname, './files'), project.root, options, { overwriteStrategy: OverwriteStrategy.ThrowIfExisting });
  await formatFiles(tree);
}

export default codeownersGenerator;
