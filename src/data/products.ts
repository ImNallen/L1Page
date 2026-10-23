import type { ImageMetadata } from 'astro';
import dataIcon from '../assets/icons/l1-data.svg';
import gitIcon from '../assets/icons/l1-git.svg';
import codeIcon from '../assets/icons/l1-code.svg';
import dataScreenshot from '../assets/screenshots/l1-data.png';
import codeScreenshot from '../assets/screenshots/l1-code.png';

export type NonEmpty<T> = [T, ...T[]];

export type Platform = 'macos' | 'windows' | 'linux';

export type Arch = 'arm64' | 'x64' | 'universal';

export type Download = {
  platform: Platform;
  arch: Arch;
  format: string;
  url: string;
};

export type Release = {
  version: string;
  date: string;
  notes: NonEmpty<string>;
  downloads: NonEmpty<Download>;
};

export type Feature = { title: string; body: string };

export type Screenshot = { src: ImageMetadata; alt: string };

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  icon: ImageMetadata;
  screenshot?: Screenshot;
  platforms: NonEmpty<Platform>;
  features: Feature[];
  releases: Release[];
};

const data: Product = {
  slug: 'data',
  name: 'L1 Data',
  tagline: 'A desktop IDE for PostgreSQL and SQL Server.',
  summary:
    'Write SQL with completion from the live catalog, page through and edit table data, and ask Claude about your database in the assistant panel. L1 Data connects to PostgreSQL and Microsoft SQL Server, directly or through an SSH tunnel.',
  icon: dataIcon,
  screenshot: {
    src: dataScreenshot,
    alt: 'L1 Data running a revenue-by-region query against a PostgreSQL database. The schema tree is on the left, the results grid is below the editor, and the assistant panel on the right answers a question about the query.',
  },
  platforms: ['macos', 'windows', 'linux'],
  features: [
    {
      title: 'PostgreSQL and SQL Server',
      body: "Each tab uses its connection's SQL dialect for highlighting, completion, formatting, and execution. SQL Server tabs run T-SQL batches separated by GO.",
    },
    {
      title: 'Catalog tree',
      body: 'Databases, schemas, tables, views, and functions in one tree, with columns, keys, indexes, and triggers under each table. The search box filters it in place.',
    },
    {
      title: 'Query tabs',
      body: 'Completion for tables and columns from the live catalog, including columns after an alias. ⌘↵ runs the selection or the statement at the cursor.',
    },
    {
      title: 'Table data',
      body: 'Page, filter, and sort any table. On PostgreSQL, add, edit, and delete rows, then submit the changes in one transaction.',
    },
    {
      title: 'Assistant',
      body: 'A chat with Claude in the right panel, on your own Claude subscription through the claude CLI. It sees the active tab and the schema, and SQL in a reply can run in a new tab.',
    },
    {
      title: 'Connections',
      body: 'Paste a postgres:// or sqlserver:// URL to fill in a connection, or connect through an SSH tunnel. Saved passwords are sealed under a key in the OS credential store.',
    },
    {
      title: 'Query history',
      body: 'Every query you run, grouped per connection and database. Filter by failed runs or writes, then rerun a query or open it in a new tab.',
    },
    {
      title: 'Export',
      body: 'Save a result to CSV, up to the row limit.',
    },
  ],
  releases: [],
};

const git: Product = {
  slug: 'git',
  name: 'L1 Git',
  tagline: 'A desktop Git client with a commit graph, diffs, and fast-forward-only updates.',
  summary:
    'Open local repositories and read their branches, tags, stashes, and commit graph. Inspect any commit, compare two commits, and fetch every remote. L1 Git fast-forwards branches that are behind and never merges, rebases, commits, or pushes.',
  icon: gitIcon,
  platforms: ['macos', 'windows', 'linux'],
  features: [
    {
      title: 'Commit graph',
      body: 'The newest 50,000 commits from every local and remote branch, tag, and HEAD, with branch and tag labels on each row.',
    },
    {
      title: 'Commits and diffs',
      body: "Select a commit to see its message, parents, and changed files as a tree. Open a file's diff in a unified or split layout.",
    },
    {
      title: 'File history',
      body: 'List the commits that changed a file, following renames, and compare any two of them.',
    },
    {
      title: 'Fetch and fast-forward',
      body: 'Fetches every saved repository when it opens. Fast-forward moves only the branches that are behind their upstream and have no uncommitted changes.',
    },
    {
      title: 'Uncommitted changes',
      body: 'Each worktree with uncommitted changes gets a row above the commit it has checked out, with a count of each kind of change.',
    },
    {
      title: 'Search and command palette',
      body: '⌘F searches commit subjects, authors, and IDs. ⌘P opens a palette of actions, repositories, and branches.',
    },
  ],
  releases: [],
};

const code: Product = {
  slug: 'code',
  name: 'L1 Code',
  tagline: 'A small, fast IDE for quick edits and testing.',
  summary:
    'The file tree is on the left, a tabbed editor in the middle, and Preview, Pull Request, Terminal, and Changes on the right. Stage and commit without leaving the window.',
  icon: codeIcon,
  screenshot: {
    src: codeScreenshot,
    alt: 'L1 Code with the file tree on the left and the Changes panel on the right, showing the diffs of two Markdown files above a commit message box.',
  },
  platforms: ['macos', 'windows', 'linux'],
  features: [
    {
      title: 'File tree',
      body: "The folder's files in a tree, with a name filter on top. ⌘P opens any file by name.",
    },
    {
      title: 'Editor',
      body: 'A tabbed CodeMirror editor. A save never overwrites a change on disk that the editor has not seen.',
    },
    {
      title: 'Terminal and Preview',
      body: 'A terminal and a preview sit in the right column, next to the file you edit.',
    },
    {
      title: 'Changes',
      body: 'Review the diff of each changed file, stage it, and commit from the Changes panel.',
    },
    {
      title: 'Open from the command line',
      body: 'Run l1code with a path. A running window opens that folder, or the file in its folder.',
    },
  ],
  releases: [],
};

export const products: Product[] = [data, git, code];

export const featured: Product = data;

export function latestRelease(product: Product): Release | undefined {
  return product.releases[0];
}

export type ProductRelease = { product: Product; release: Release };

export function allReleases(): ProductRelease[] {
  return products
    .flatMap((product) => product.releases.map((release) => ({ product, release })))
    .sort((a, b) => b.release.date.localeCompare(a.release.date));
}

export function primaryBuilds(release: Release): Download[] {
  return release.downloads.filter((d, i, all) => all.findIndex((x) => x.platform === d.platform) === i);
}

export const platformName: Record<Platform, string> = {
  macos: 'macOS',
  windows: 'Windows',
  linux: 'Linux',
};

const archName: Record<Platform, Record<Arch, string>> = {
  macos: { arm64: 'Apple silicon', x64: 'Intel', universal: 'Universal' },
  windows: { arm64: 'ARM64', x64: 'x64', universal: 'Universal' },
  linux: { arm64: 'ARM64', x64: 'x64', universal: 'Universal' },
};

export function buildName(d: Download): string {
  return `${platformName[d.platform]}, ${archName[d.platform][d.arch]}, .${d.format}`;
}

const list = new Intl.ListFormat('en', { type: 'conjunction' });

export function listPlatforms(platforms: Platform[]): string {
  return list.format(platforms.map((p) => platformName[p]));
}

export function listNames(items: Product[]): string {
  return list.format(items.map((p) => p.name));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { dateStyle: 'long', timeZone: 'UTC' });
}
