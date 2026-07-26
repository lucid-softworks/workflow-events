import { describe, expect, it, vi } from "vitest";

import { WorkflowEventBus } from "../src/index.js";

describe("WorkflowEventBus", () => {
  it("records and publishes lifecycle events", () => {
    const bus = new WorkflowEventBus();
    const listener = vi.fn<(event: { readonly type: string }) => void>();
    const unsubscribe = bus.subscribe(listener);
    const event = {
      executionId: "run",
      timestamp: 1,
      type: "task-started" as const,
      taskId: "task",
    };
    bus.emit(event);
    expect(bus.history).toEqual([event]);
    expect(listener).toHaveBeenCalledWith(event);
    unsubscribe();
    bus.emit({ ...event, type: "task-succeeded" });
    expect(listener).toHaveBeenCalledOnce();
    expect(bus.history).toHaveLength(2);
  });

  it("returns history copies and can clear", () => {
    const bus = new WorkflowEventBus();
    bus.emit({
      executionId: "run",
      timestamp: 1,
      type: "workflow-started",
      workflowId: "flow",
    });
    const history = bus.history as unknown[];
    history.length = 0;
    expect(bus.history).toHaveLength(1);
    bus.clear();
    expect(bus.history).toEqual([]);
  });
});
