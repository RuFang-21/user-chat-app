import { useCallback, useEffect, useState } from "react"

import { api } from "../services/api"
import { User } from "../services/api/types"

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.getUsers()
      if (result.kind === "ok") {
        setUsers(result.users)
        setFilteredUsers(result.users)
      } else {
        setError(result.kind)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  const searchUsers = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setFilteredUsers(users)
        return
      }

      const lowercaseQuery = query.toLowerCase()
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(lowercaseQuery) ||
          user.email.toLowerCase().includes(lowercaseQuery) ||
          user.phone.toLowerCase().includes(lowercaseQuery) ||
          user.address.city.toLowerCase().includes(lowercaseQuery),
      )
      setFilteredUsers(filtered)
    },
    [users],
  )

  const getUserById = useCallback(async (userId: string | number) => {
    try {
      const result = await api.getUser(userId)
      if (result.kind === "ok") {
        return result.user
      }
      return null
    } catch (e) {
      console.error("Error fetching user:", e)
      return null
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  return {
    users: filteredUsers,
    loading,
    error,
    searchUsers,
    loadUsers,
    getUserById,
  }
}
