import { describe, it, expect, vi, beforeEach } from "vitest"
import { actions } from "./+page.server"
import { fail, redirect } from "@sveltejs/kit"

vi.mock("@sveltejs/kit", async () => {
  const actual = await vi.importActual("@sveltejs/kit")
  return {
    ...actual,
    fail: vi.fn(),
    redirect: vi.fn().mockImplementation(() => {
      throw new Error("Redirect error")
    }),
  }
})

vi.mock("$lib/firestore.server", () => ({
  getProfile: vi.fn(),
  updateProfile: vi.fn(),
}))

describe("toggleEmailSubscription", () => {
  const mockGetSession = vi.fn()
  const mockGetProfile = vi.fn()
  const mockUpdateProfile = vi.fn()

  beforeEach(async () => {
    vi.clearAllMocks()

    const firestore = await import("$lib/firestore.server")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(firestore as any).getProfile = mockGetProfile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(firestore as any).updateProfile = mockUpdateProfile
  })

  it("should redirect if no session", async () => {
    mockGetSession.mockResolvedValue({ user: null })

    await expect(
      actions.toggleEmailSubscription({
        locals: {
          getSession: mockGetSession,
        },
      } as any),
    ).rejects.toThrow("Redirect")

    expect(redirect).toHaveBeenCalledWith(303, "/login")
  })

  it("should toggle subscription status from false to true", async () => {
    const mockUser = { id: "user123", email: "test@example.com" }
    mockGetSession.mockResolvedValue({ user: mockUser })

    // Mock getting the current profile
    mockGetProfile.mockResolvedValueOnce({ unsubscribed: false })

    // Mock the update
    mockUpdateProfile.mockResolvedValueOnce(undefined)

    const result = await actions.toggleEmailSubscription({
      locals: { getSession: mockGetSession },
    } as any)

    expect(mockGetProfile).toHaveBeenCalledWith("user123")
    expect(mockUpdateProfile).toHaveBeenCalledWith("user123", {
      unsubscribed: true,
    })
    expect(result).toEqual({ unsubscribed: true })
  })

  it("should toggle subscription status from true to false", async () => {
    const mockUser = { id: "user123", email: "test@example.com" }
    mockGetSession.mockResolvedValue({ user: mockUser })

    // Mock getting the current profile
    mockGetProfile.mockResolvedValueOnce({ unsubscribed: true })

    // Mock the update
    mockUpdateProfile.mockResolvedValueOnce(undefined)

    const result = await actions.toggleEmailSubscription({
      locals: { getSession: mockGetSession },
    } as any)

    expect(mockGetProfile).toHaveBeenCalledWith("user123")
    expect(mockUpdateProfile).toHaveBeenCalledWith("user123", {
      unsubscribed: false,
    })
    expect(result).toEqual({ unsubscribed: false })
  })

  it("should return fail response if update operation fails", async () => {
    const mockUser = { id: "user123", email: "test@example.com" }
    mockGetSession.mockResolvedValue({ user: mockUser })

    // Mock getting the current profile
    mockGetProfile.mockResolvedValueOnce({ unsubscribed: false })

    // Mock the update to throw an error
    mockUpdateProfile.mockRejectedValueOnce(new Error("Update failed"))

    await actions.toggleEmailSubscription({
      locals: { getSession: mockGetSession },
    } as any)

    // Check if fail was called with the correct arguments
    expect(fail).toHaveBeenCalledWith(500, {
      message: "Failed to update subscription status",
    })
  })
})
