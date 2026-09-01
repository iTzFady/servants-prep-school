import { beforeEach, describe, expect, it, vi } from "vitest";

const secureStore = { clear: vi.fn() };
const queryClient = { clear: vi.fn() };
const store = { dispatch: vi.fn() };
const clearAuth = vi.fn(() => ({ type: "auth/clearAuth" }));
const clearSentryUser = vi.fn();

vi.mock("@/services/secureStore", () => ({ secureStore }));
vi.mock("@/services/queryClient", () => ({ queryClient }));
vi.mock("@/store/store", () => ({ store }));
vi.mock("@/services/sentryClient", () => ({ clearSentryUser }));
vi.mock("@/store/authSlice", () => ({ clearAuth }));

const { clearAuthSession } = await import("@/services/authSession");

describe("logout session cleanup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    secureStore.clear.mockResolvedValue(undefined);
    queryClient.clear.mockImplementation(() => undefined);
  });

  it("clears local auth even when the remote logout request fails", async () => {
    await expect(clearAuthSession()).resolves.toBeUndefined();

    expect(secureStore.clear).toHaveBeenCalledTimes(1);
    expect(queryClient.clear).toHaveBeenCalledTimes(1);
    expect(clearSentryUser).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith({ type: "auth/clearAuth" });
  });
});
