import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { useAuth } from "@/hooks/use-auth";

vi.mock("@/lib/api", () => {
  return {
    default: {
      get: vi.fn(),
    },
  };
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const api = require("@/lib/api").default as { get: ReturnType<typeof vi.fn> };

function HookProbe() {
  const { user, loading, error } = useAuth();
  return (
    <div>
      <div data-testid="loading">{loading ? "true" : "false"}</div>
      <div data-testid="error">{error || ""}</div>
      <div data-testid="user">{user?.email || ""}</div>
    </div>
  );
}

describe("useAuth hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    (api.get as unknown as ReturnType<typeof vi.fn>).mockReset();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("carrega usuário com sucesso e atualiza estados", async () => {
    (api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { id: "u1", email: "ana@empresa.com", roles: ["user"], name: "Ana" },
    });

    render(<HookProbe />);

    expect(screen.getByTestId("loading").textContent).toBe("true");

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
      expect(screen.getByTestId("user").textContent).toBe("ana@empresa.com");
      expect(screen.getByTestId("error").textContent).toBe("");
    });
  });

  it("trata erro quando API falha", async () => {
    (api.get as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("Falha API"));

    render(<HookProbe />);

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
      expect(screen.getByTestId("user").textContent).toBe("");
      expect(screen.getByTestId("error").textContent).toContain("Falha");
    });
  });
});