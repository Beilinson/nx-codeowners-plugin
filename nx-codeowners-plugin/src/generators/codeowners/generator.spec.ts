import { Tree, joinPathFragments, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readFileIfExisting } from 'nx/src/utils/fileutils';
import { codeownersGenerator } from './generator';
import { CodeownersGeneratorSchema } from './schema';

describe('CODEOWNERS Generator', () => {
  let tree: Tree;
  const options: CodeownersGeneratorSchema = { project: 'test', owners: ['@user1', '@user2'] };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await codeownersGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    const codeowners = readFileIfExisting(joinPathFragments(config.root, 'CODEOWNERS'));
    expect(codeowners).toBeDefined();
  });
});
