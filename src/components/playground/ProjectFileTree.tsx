'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProjectFile } from '@/types/playground';

interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
  file?: ProjectFile;
}

/** Build a tree from flat file list */
function buildTree(files: ProjectFile[]): FileNode[] {
  const root: FileNode[] = [];
  const dirMap = new Map<string, FileNode>();

  for (const file of files) {
    const parts = file.path.split('/');
    if (parts.length === 1) {
      // Root-level file
      root.push({ name: file.name, path: file.path, isDirectory: false, file });
    } else {
      // Nested file - ensure directories exist
      let current = root;
      for (let i = 0; i < parts.length - 1; i++) {
        const dirPath = parts.slice(0, i + 1).join('/');
        if (!dirMap.has(dirPath)) {
          const dir: FileNode = {
            name: parts[i],
            path: dirPath,
            isDirectory: true,
            children: [],
          };
          dirMap.set(dirPath, dir);
          current.push(dir);
        }
        current = dirMap.get(dirPath)!.children!;
      }
      current.push({ name: parts[parts.length - 1], path: file.path, isDirectory: false, file });
    }
  }

  return root;
}

interface FileTreeNodeProps {
  node: FileNode;
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
  depth: number;
}

function FileTreeNode({ node, selectedFile, onSelectFile, depth }: FileTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (node.isDirectory) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center gap-1 w-full text-left px-2 py-1 text-sm rounded',
            'hover:bg-accent hover:text-accent-foreground transition-colors',
            'text-muted-foreground'
          )}
          style={{ paddingLeft: `${(depth + 1) * 8 + 8}px` }}
          aria-expanded={isOpen}
          aria-label={`폴더: ${node.name}`}
        >
          {isOpen ? (
            <ChevronDown className="h-3 w-3 flex-shrink-0" />
          ) : (
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
          )}
          <Folder className="h-3.5 w-3.5 flex-shrink-0 text-blue-500" />
          <span className="truncate">{node.name}</span>
        </button>
        {isOpen && node.children && (
          <div>
            {node.children.map(child => (
              <FileTreeNode
                key={child.path}
                node={child}
                selectedFile={selectedFile}
                onSelectFile={onSelectFile}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isSelected = selectedFile === node.path;
  const hasBug = node.file?.hasBug;

  return (
    <button
      onClick={() => onSelectFile(node.path)}
      className={cn(
        'flex items-center gap-1.5 w-full text-left px-2 py-1 text-sm rounded',
        'hover:bg-accent hover:text-accent-foreground transition-colors',
        isSelected && 'bg-accent text-accent-foreground font-medium'
      )}
      style={{ paddingLeft: `${(depth + 1) * 8 + 16}px` }}
      aria-current={isSelected ? 'true' : undefined}
      aria-label={`파일: ${node.name}${hasBug ? ' (버그 있음)' : ''}`}
    >
      <File className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
      <span className="truncate flex-1">{node.name}</span>
      {hasBug && (
        <AlertTriangle className="h-3 w-3 flex-shrink-0 text-yellow-500" aria-label="버그 있음" />
      )}
    </button>
  );
}

interface ProjectFileTreeProps {
  files: ProjectFile[];
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
  className?: string;
}

export function ProjectFileTree({
  files,
  selectedFile,
  onSelectFile,
  className,
}: ProjectFileTreeProps) {
  const tree = buildTree(files);

  return (
    <div
      className={cn('py-2', className)}
      role="tree"
      aria-label="프로젝트 파일 목록"
    >
      {tree.map(node => (
        <FileTreeNode
          key={node.path}
          node={node}
          selectedFile={selectedFile}
          onSelectFile={onSelectFile}
          depth={0}
        />
      ))}
    </div>
  );
}
