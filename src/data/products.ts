export type Platform = 'macos' | 'windows' | 'linux';

export type Arch = 'arm64' | 'x64' | 'universal';

export type Download = {
  platform: Platform;
  arch: Arch;
  format: string;
  url: string;
};

export type Availability =
  | { kind: 'coming-soon'; platforms: Platform[] }
  | {
      kind: 'available';
      version: string;
      releasedAt: string;
      releaseNotesUrl: string;
      downloads: Download[];
    };

export type Feature = { title: string; body: string };

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  availability: Availability;
  features: Feature[];
};

export const products: Product[] = [
  {
    slug: 'data',
    name: 'L1 Data',
    tagline: 'A database IDE for the desktop.',
    summary:
      'Write SQL with completion from your live schema, browse tables and keys in a tree, and work through query results in an editable grid.',
    availability: { kind: 'coming-soon', platforms: ['macos', 'windows', 'linux'] },
    features: [
      {
        title: 'SQL editor',
        body: 'Completion for tables, columns, and joins from the connected schema. Run the statement under the cursor or just the selected text.',
      },
      {
        title: 'Schema browser',
        body: "Databases, schemas, tables, views, indexes, and keys in one tree. Open a table's data or its DDL from there.",
      },
      {
        title: 'Result grid',
        body: 'Sort, filter, and page through results. Edit cells in place and commit the changes as one transaction.',
      },
      {
        title: 'More than one engine',
        body: "Keep connections to different database engines side by side. Completion and formatting follow each engine's SQL dialect.",
      },
      {
        title: 'Query history',
        body: 'Every statement you run is kept on your machine with its duration and row count, so you can find and rerun it later.',
      },
      {
        title: 'Export',
        body: 'Save a result set as CSV, JSON, or SQL INSERT statements.',
      },
    ],
  },
];

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

export function statusLabel(a: Availability): string {
  switch (a.kind) {
    case 'coming-soon':
      return 'Not released yet';
    case 'available':
      return `Version ${a.version}`;
    default:
      return assertNever(a);
  }
}

export function platformsOf(a: Availability): Platform[] {
  switch (a.kind) {
    case 'coming-soon':
      return a.platforms;
    case 'available':
      return [...new Set(a.downloads.map((d) => d.platform))];
    default:
      return assertNever(a);
  }
}

export function assertNever(value: never): never {
  throw new Error(`Unhandled variant: ${JSON.stringify(value)}`);
}
