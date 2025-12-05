import { useCallback, useEffect, useState } from "react"

import { api } from "@/services/api"
import { User } from "@/services/api/types"

export const useUser = (userId: string | number) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadUser = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    setError(null)
    try {
      const result = await api.getUser(userId)
      if (result.kind === "ok") {
        setUser(result.user)
      } else {
        setError(result.kind)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  return {
    user,
    loading,
    error,
    refetch: loadUser,
  }
}
