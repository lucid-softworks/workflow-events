export type WorkflowEvent =
  | {
      readonly type: "workflow-started" | "workflow-succeeded";
      readonly executionId: string;
      readonly workflowId: string;
      readonly timestamp: number;
    }
  | {
      readonly type: "workflow-failed" | "workflow-cancelled";
      readonly executionId: string;
      readonly workflowId: string;
      readonly timestamp: number;
      readonly error?: unknown;
    }
  | {
      readonly type: "task-started" | "task-succeeded";
      readonly executionId: string;
      readonly taskId: string;
      readonly timestamp: number;
      readonly output?: unknown;
    }
  | {
      readonly type: "task-failed" | "task-cancelled" | "task-skipped";
      readonly executionId: string;
      readonly taskId: string;
      readonly timestamp: number;
      readonly error?: unknown;
    };

export type WorkflowEventListener = (event: WorkflowEvent) => void;

/** Records events and synchronously notifies current subscribers. */
export class WorkflowEventBus {
  readonly #events: WorkflowEvent[] = [];
  readonly #listeners = new Set<WorkflowEventListener>();

  get history(): readonly WorkflowEvent[] {
    return [...this.#events];
  }

  subscribe(listener: WorkflowEventListener): () => void {
    this.#listeners.add(listener);
    return (): void => {
      this.#listeners.delete(listener);
    };
  }

  emit(event: WorkflowEvent): void {
    this.#events.push(event);
    for (const listener of this.#listeners) listener(event);
  }

  clear(): void {
    this.#events.length = 0;
  }
}
