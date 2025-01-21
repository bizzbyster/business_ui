
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CODE_EXTENSIONS: Set<string> = new Set([
    '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
    '.css', '.scss', '.sass', '.less', '.module.css', '.module.scss',
    '.mdx', '.md',
    '.json', '.yaml', '.yml', '.env',
    '.html', '.graphql', '.gql'
]);

async function parseGitignore(rootDir: string): Promise<string[]> {
    try {
        const gitignorePath = path.join(rootDir, '.gitignore');
        const content = await fs.readFile(gitignorePath, 'utf8');
        return content
            .split('\n')
            .map((line: string) => line.trim())
            .filter((line: string) => line && !line.startsWith('#'))
            .map((pattern: string) => {
                pattern = pattern.replace(/^\/*/, '');
                return pattern.endsWith('/') ? `${pattern}**` : pattern;
            });
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.warn('No .gitignore file found. Proceeding without ignore patterns.');
            return [];
        }
        throw error;
    }
}

function isCodeFile(filename: string): boolean {
    return CODE_EXTENSIONS.has(path.extname(filename).toLowerCase());
}

function shouldIgnore(filepath: string, ignorePatterns: string[], rootDir: string): boolean {
    const relPath = path.relative(rootDir, filepath);
    
    const ignoreDirectories = [
        '/.git/',
        '/node_modules/',
        '/.next/',
        '/out/',
        '/build/',
        '/coverage/'
    ];

    if (ignoreDirectories.some(dir => 
        filepath.includes(dir) || 
        filepath.includes(dir.replace(/\//g, path.sep))
    )) {
        return true;
    }

    return ignorePatterns.some((pattern: string) => {
        const regPattern = pattern
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');
        const regex = new RegExp(`^${regPattern}$`);
        return regex.test(relPath) || regex.test(path.basename(filepath));
    });
}

async function* findCodeFiles(rootDir: string, ignorePatterns: string[]): AsyncGenerator<{path: string, content: string}> {
    try {
        const entries = await fs.readdir(rootDir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(rootDir, entry.name);
            const relPath = path.relative(process.cwd(), fullPath);
            
            console.log(`Checking: ${relPath}`);

            if (shouldIgnore(fullPath, ignorePatterns, rootDir)) {
                console.log(`Ignoring: ${relPath}`);
                continue;
            }

            if (entry.isDirectory()) {
                console.log(`Entering directory: ${relPath}`);
                yield* findCodeFiles(fullPath, ignorePatterns);
            } else if (entry.isFile()) {
                if (isCodeFile(entry.name)) {
                    try {
                        const content = await fs.readFile(fullPath, 'utf8');
                        console.log(`Processing: ${relPath}`);
                        yield { path: relPath, content };
                    } catch (error) {
                        console.error(`Error reading file ${fullPath}:`, error);
                    }
                } else {
                    console.log(`Skipping non-code file: ${relPath}`);
                }
            }
        }
    } catch (error) {
        console.error(`Error in findCodeFiles for directory ${rootDir}:`, error);
    }
}

function getOutputFilename(): string {
    return `file_inventory.txt`;
}

async function main(): Promise<void> {
    try {
        const rootDir = process.argv[2] || '.';
        const absoluteRootDir = path.resolve(rootDir);
        const outputFilename = getOutputFilename();
        
        console.log(`Current working directory: ${process.cwd()}`);
        console.log(`Scanning for code files in: ${absoluteRootDir}`);
        console.log('---');

        const ignorePatterns = await parseGitignore(absoluteRootDir);
        let fileContent = '';
        let fileCount = 0;

        try {
            for await (const {path: filepath, content} of findCodeFiles(absoluteRootDir, ignorePatterns)) {
                const displayPath = `./${filepath}`;
                fileContent += `\n${'='.repeat(80)}\n`;
                fileContent += `File: ${displayPath}\n`;
                fileContent += `${'='.repeat(80)}\n\n`;
                fileContent += content;
                fileContent += '\n\n';
                fileCount++;
            }
        } catch (error) {
            console.error('Error during file processing:', error);
        }

        await fs.writeFile(outputFilename, fileContent);
        
        console.log('---');
        console.log(`Scan complete. Processed ${fileCount} files.`);
        console.log(`Output saved to: ${outputFilename}`);
    } catch (error) {
        console.error('Error in main function:', error);
        process.exit(1);
    }
}

// This is the ESM way to check if a file is being run directly
if (import.meta.url === `file://${__filename}`) {
    main();
}

export { findCodeFiles, parseGitignore };
