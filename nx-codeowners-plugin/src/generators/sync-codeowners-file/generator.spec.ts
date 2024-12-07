import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { syncCodeownersFileGenerator } from './generator';
import { SyncCodeownersFileGeneratorSchema } from './schema';

describe('sync-codeowners-file generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await syncCodeownersFileGenerator(tree);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
