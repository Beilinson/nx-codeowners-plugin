import { createProjectGraphAsync, generateFiles, joinPathFragments, ProjectGraphProjectNode, Tree } from '@nx/devkit';
import { readFileIfExisting } from 'nx/src/utils/fileutils';

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
  const projectCodeowners = readFileIfExisting(joinPathFragments(project.data.root, 'CODEOWNERS'));
  if (project.data.root === '.' || !projectCodeowners) return;
  const header = `# ${project.type}: ${project.name}`;

  const codeowners = joinStrings(
    projectCodeowners.split('\n').map((line) => {
      if (line.length && !line.startsWith('#')) {
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
  
  generateFiles(tree, joinPathFragments(__dirname, './files'), '', { PLUGIN_HEADER, BASE_CODEOWNERS, PROJECTS_CODEOWNERS });
}

export default syncCodeownersFileGenerator;
