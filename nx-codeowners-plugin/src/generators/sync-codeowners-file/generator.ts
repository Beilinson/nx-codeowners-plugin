import {
  createProjectGraphAsync,
  generateFiles,
  joinPathFragments,
  logger,
  ProjectGraphProjectNode,
  Tree,
} from '@nx/devkit';
import { existsSync, readFileSync } from 'fs';
import { getFileOwnership, validate } from 'github-codeowners/dist/lib/ownership';
import { calcFileStats } from 'github-codeowners/dist/lib/stats';

const PLUGIN_HEADER = '# NX-CODEOWNERS-PLUGIN';

function joinStrings(strings: string[]): string {
  return strings.join('\n');
}

function getWorkspaceOwnersContent(tree: Tree): string | undefined {
  if (!tree.isFile('CODEOWNERS')) return;
  const codeowners = tree.read('CODEOWNERS').toString();
  return codeowners.split(PLUGIN_HEADER)[0].trimEnd();
}

function getProjectOwnersString(project: ProjectGraphProjectNode): string | undefined {
  const codeownersPath = joinPathFragments(project.data.root, 'CODEOWNERS');
  if (project.data.root === '.' || !existsSync(codeownersPath)) return;
  const projectCodeowners = readFileSync(codeownersPath, 'utf-8');
  const header = `# ${project.type}: ${project.name}`;

  const codeowners = joinStrings(
    projectCodeowners.split('\n').map((line) => {
      if (line.length && !line.startsWith('#')) {
        if (line.match(/^\*.[a-z]/)) line = `**/${line}`;
        line = `${project.data.root}/${line}`;
      }
      return line;
    }),
  );
  return joinStrings([header, codeowners, '']);
}

async function getProjectsOwnerString(): Promise<string> {
  const projectGraph = await createProjectGraphAsync();

  return joinStrings(
    Object.values(projectGraph.nodes)
      .map((project) => getProjectOwnersString(project))
      .filter(Boolean),
  );
}

export async function syncCodeownersFileGenerator(tree: Tree) {
  const BASE_CODEOWNERS = getWorkspaceOwnersContent(tree);
  const PROJECTS_CODEOWNERS = await getProjectsOwnerString();

  generateFiles(tree, joinPathFragments(__dirname, './files'), '', {
    PLUGIN_HEADER,
    BASE_CODEOWNERS,
    PROJECTS_CODEOWNERS,
  });
  const options = {
    codeowners: './CODEOWNERS',
    dir: './',
  };
  const output = await validate(options);
  if (output.duplicated.size > 0) {
    logger.warn(joinStrings(['Found duplicate rules:', ...output.duplicated.values()]));
  }
  if (output.unmatched.size > 0) {
    logger.warn(joinStrings(['Found rules which did not match any files:', ...output.unmatched.values()]));
  }
  const files = await getFileOwnership({ ...options, onlyGit: true });
  const stats = calcFileStats(files);

  logger.info('\nCoverage:');
  console.table({ Total: { ...stats.total }, Protected: { ...stats.loved }, Unprotected: { ...stats.unloved } });
  if (stats.unloved.files > 0) {
    logger.verbose('Unprotected files:');
    files
      .filter((file) => file.owners.length === 0)
      .forEach((file) => {
        logger.verbose(file.path, file.lines);
      });
  }
  logger.info('\nOwners:');
  const owners = Object.fromEntries(
    stats.owners.map((owner) => [
      owner.owner,
      {
        ...owner.counters,
        percentage: `${((owner.counters.lines / stats.loved.lines) * 100).toFixed()}%`,
      },
    ]),
  );
  console.table(owners);
}

export default syncCodeownersFileGenerator;
