'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePlaygroundStore } from '@/stores/playgroundStore';
import { handleCommand as executeCommand } from '@/lib/playground/command-handler';
import { animateTyping } from '@/lib/playground/typing-animator';
import { PlaygroundLayout } from '@/components/playground/PlaygroundLayout';
import { PlaygroundToolbar } from '@/components/playground/PlaygroundToolbar';
import { ProjectFileTree } from '@/components/playground/ProjectFileTree';
import { CodeViewer } from '@/components/playground/CodeViewer';
import { SimulationBadge } from '@/components/playground/SimulationBadge';
import type { SampleProjectId } from '@/types/playground';

// Lazy load terminal to avoid SSR
const TerminalEmulator = dynamic(
  () => import('@/components/playground/TerminalEmulator').then(m => ({ default: m.TerminalEmulator })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#0d1117] flex items-center justify-center">
        <span className="text-green-400/60 text-sm font-mono animate-pulse">로딩 중...</span>
      </div>
    ),
  }
);

export default function PlaygroundPage() {
  const {
    session,
    currentProject,
    selectedFile,
    isTyping,
    isInitialized,
    commandHistory,
    historyIndex,
    initSession,
    setCurrentProject,
    selectFile,
    addCommand,
    addOutput,
    setTyping,
    navigateHistory,
    exportTranscript,
    getProjects,
  } = usePlaygroundStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [clearSignal, setClearSignal] = useState(0);
  const writeOutputRef = useRef<((text: string, type: string) => void) | null>(null);
  const cancelTypingRef = useRef<(() => void) | null>(null);
  const projects = getProjects();

  // Initialize default project
  useEffect(() => {
    if (!isInitialized) {
      initSession('todo-express');
    }
  }, [isInitialized, initSession]);

  // Register write function from terminal
  useEffect(() => {
    const interval = setInterval(() => {
      const fn = (window as { __terminalWriteOutput?: (text: string, type: string) => void }).__terminalWriteOutput;
      if (fn && !writeOutputRef.current) {
        writeOutputRef.current = fn;
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleClearTerminal = useCallback(() => {
    setClearSignal(s => s + 1);
    writeOutputRef.current?.('', 'system');
  }, []);

  const handleExport = useCallback(() => {
    const transcript = exportTranscript();
    if (!transcript) return;
    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claude-code-session-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportTranscript]);

  const handleCommand = useCallback(
    async (cmd: string) => {
      if (!currentProject || !session) return;

      // Cancel any ongoing typing animation
      cancelTypingRef.current?.();
      cancelTypingRef.current = null;

      // Record command
      addCommand(cmd);
      addOutput({
        type: 'input',
        content: cmd,
        timestamp: new Date().toISOString(),
      });

      // Execute command
      const result = executeCommand(cmd, {
        project: currentProject,
        currentDirectory: session.currentDirectory,
      });

      const { response, clearTerminal } = result;

      if (clearTerminal) {
        handleClearTerminal();
        return;
      }

      // Multi-step animation
      if (response.type === 'multi-step' && response.steps) {
        setTyping(true);
        for (const step of response.steps) {
          await new Promise<void>(resolve => setTimeout(resolve, step.delay));
          writeOutputRef.current?.(step.content, 'output');
          addOutput({
            type: 'output',
            content: step.content,
            timestamp: new Date().toISOString(),
          });
        }
        setTyping(false);
        return;
      }

      // Typing animation for AI responses
      const typingSpeed = response.typingSpeed ?? 20;
      if (typingSpeed > 0 && response.content.length > 0) {
        setTyping(true);
        let displayed = '';

        const { promise, cancel } = animateTyping(
          response.content,
          accumulated => {
            // Write incremental chars - but we buffer for performance
            displayed = accumulated;
          },
          { speed: typingSpeed }
        );

        cancelTypingRef.current = () => {
          cancel();
        };

        // Flush display every 50ms
        const flushInterval = setInterval(() => {
          if (displayed) {
            // We write the full updated content each time
          }
        }, 50);

        const finalText = await promise;
        clearInterval(flushInterval);
        cancelTypingRef.current = null;

        writeOutputRef.current?.(finalText, response.type);
        addOutput({
          type: response.type === 'ai-response' ? 'ai-response' : 'output',
          content: finalText,
          timestamp: new Date().toISOString(),
        });
        setTyping(false);
      } else {
        // Instant output
        if (response.content) {
          writeOutputRef.current?.(response.content, response.type);
          addOutput({
            type: response.type === 'error' ? 'error' : 'output',
            content: response.content,
            timestamp: new Date().toISOString(),
          });
        } else {
          writeOutputRef.current?.('', 'text');
        }
      }
    },
    [currentProject, session, addCommand, addOutput, setTyping, handleClearTerminal]
  );

  const handleProjectChange = useCallback(
    (projectId: string) => {
      setCurrentProject(projectId as SampleProjectId);
    },
    [setCurrentProject]
  );

  const selectedFileData =
    currentProject?.files.find(f => f.path === selectedFile) ?? null;

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-background flex flex-col'
    : 'flex flex-col h-[calc(100vh-4rem)]';

  if (!isInitialized || !currentProject) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-muted-foreground text-sm">초기화 중...</div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {/* Toolbar */}
      <PlaygroundToolbar
        projects={projects}
        currentProjectId={currentProject.id}
        onProjectChange={handleProjectChange}
        onReset={() => usePlaygroundStore.getState().resetSession()}
        onClearTerminal={handleClearTerminal}
        onExport={handleExport}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(f => !f)}
      />

      {/* Main layout */}
      <PlaygroundLayout
        className="flex-1 min-h-0"
        fileTree={
          <div className="h-full overflow-auto">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b">
              {currentProject.icon} {currentProject.name}
            </div>
            <ProjectFileTree
              files={currentProject.files}
              selectedFile={selectedFile}
              onSelectFile={selectFile}
            />
          </div>
        }
        terminal={
          <TerminalEmulator
            key={clearSignal} // remount on clear
            onCommand={handleCommand}
            onHistoryUp={() => navigateHistory('up')}
            onHistoryDown={() => navigateHistory('down')}
            isTyping={isTyping}
            className="w-full h-full"
          />
        }
        codeViewer={
          <CodeViewer
            file={selectedFileData}
            className="h-full"
          />
        }
      />

      {/* Mobile simulation badge (always visible on small screens) */}
      <div className="md:hidden flex items-center justify-center py-1 border-t bg-background">
        <SimulationBadge />
      </div>
    </div>
  );
}
