import { FC, useCallback, useState } from "react"
import { FlatList, RefreshControl, TouchableOpacity } from "react-native"
import { useQuery } from "@tanstack/react-query"
import { Spinner, Stack, XStack } from "tamagui"

import Logout from "@assets/icons/logout.svg"
import SearchIcon from "@assets/icons/search.svg"

import { DashboardScreenProps } from "./props"
import { Screen, ScreenHeader, Text, TextInput } from "../../components"
import { useAuth } from "../../context/AuthContext"
import { api } from "../../services/api"
import { User } from "../../services/api/types"

/**
 * ===========================
 * MAIN
 * ===========================
 */
const AVATAR_COLORS = [
  "#ef5350",
  "#ec407a",
  "#ab47bc",
  "#7e57c2",
  "#5c6bc0",
  "#42a5f5",
  "#29b6f6",
  "#26c6da",
  "#26a69a",
  "#66bb6a",
  "#9ccc65",
  "#d4e157",
  "#ffee58",
  "#ffca28",
  "#ffa726",
  "#ff7043",
  "#8d6e63",
  "#78909c",
]

const getAvatarColor = (name: string) => {
  const charCode = name.charCodeAt(0) || 0
  return AVATAR_COLORS[charCode % AVATAR_COLORS.length]
}

const UserItem = ({ item, navigation }: { item: User; navigation: any }) => {
  const { data: posts } = useQuery({
    queryKey: ["posts", item.id],
    queryFn: async () => {
      const response = await api.getPostsByUserId(item.id)
      if (response.kind === "ok") {
        return response.posts
      }
      return []
    },
  })

  const latestMessage = posts && posts.length > 0 ? posts[0].body : "No messages yet"

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Chat", { userId: item.id, userName: item.name })
      }}
    >
      <XStack
        paddingVertical="$3"
        paddingHorizontal="$4"
        gap="$3"
        alignItems="center"
        borderBottomWidth={1}
        borderBottomColor="#F0F0F0"
      >
        <Stack
          width={50}
          height={50}
          borderRadius="$full"
          backgroundColor={getAvatarColor(item.name)}
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="$lg" fontWeight="bold" color="white">
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </Stack>

        <Stack flex={1} gap="$1">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontWeight="bold" fontSize="$md">
              {item.name}
            </Text>
            <Text fontSize="$xs" color="#888888">
              12:30 PM
            </Text>
          </XStack>

          <Text fontSize="$sm" color="#888888" numberOfLines={1}>
            {latestMessage}
          </Text>
        </Stack>
      </XStack>
    </TouchableOpacity>
  )
}

export const DashboardScreen: FC<DashboardScreenProps> = ({ navigation }) => {
  const { logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  // fetch users
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.getUsers()
      if (response.kind === "ok") {
        return response.users
      }
      throw new Error("Failed to fetch users")
    },
  })

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const filteredUsers = Array.isArray(users)
    ? users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  // =============== COMPONENTS

  const renderUserCard = useCallback(
    ({ item }: { item: User }) => {
      return <UserItem item={item} navigation={navigation} />
    },
    [navigation],
  )

  const renderListEmptyComponent = useCallback(
    () => (
      <XStack justifyContent="center" paddingVertical="$8">
        <Text>{searchQuery ? `No user found for "${searchQuery}"` : "No user found"}</Text>
      </XStack>
    ),
    [searchQuery],
  )

  // =============== VIEWS
  return (
    <Screen>
      <ScreenHeader
        unsafe
        left={false}
        title={"Chats"}
        titleProps={{
          fontSize: "$lg",
          fontWeight: "bold",
        }}
        right={
          <TouchableOpacity onPress={logout}>
            <Logout width={24} height={24} />
          </TouchableOpacity>
        }
      />

      {/* Search input sections */}
      <Stack paddingHorizontal="$4" paddingVertical="$2">
        <TextInput
          placeholder="Search by name"
          value={searchQuery}
          onChangeCallback={handleSearch}
          isControlled={false}
          prefix={<SearchIcon />}
        />
      </Stack>

      {/* Listing of order section */}

      <Stack flex={1}>
        {isLoading ? (
          <XStack justifyContent="center" paddingVertical="$8">
            <Spinner />
          </XStack>
        ) : error ? (
          <XStack justifyContent="center" paddingVertical="$8">
            <Text color="$red10">
              Error: {error instanceof Error ? error.message : "Unknown error"}
            </Text>
          </XStack>
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => {
                  refetch()
                }}
              />
            }
            data={filteredUsers}
            renderItem={renderUserCard}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="none"
            removeClippedSubviews={false}
            ListEmptyComponent={renderListEmptyComponent}
          />
        )}
      </Stack>
    </Screen>
  )
}

/**
 * ===========================
 *
 * EXPORTS
 * ===========================
 */
export * from "./props"
export default DashboardScreen
