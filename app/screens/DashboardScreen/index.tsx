import { FC, useCallback, useMemo, useState } from "react"
import { FlatList, RefreshControl, TouchableOpacity } from "react-native"
import { debounce } from "lodash"
import { Separator, Spinner, Stack, XStack } from "tamagui"

import EmailIcon from "@assets/icons/email.svg"
import LocationIcon from "@assets/icons/location.svg"
import Logout from "@assets/icons/logout.svg"
import PhoneIcon from "@assets/icons/phone.svg"
import SearchIcon from "@assets/icons/search.svg"

import { DashboardScreenProps } from "./props"
import { Screen, ScreenHeader, Text, TextInput } from "../../components"
import { useAuth } from "../../context/AuthContext"
import { useUsers } from "../../hooks/useUsers"
import { User } from "../../services/api/types"

/**
 * ===========================
 * MAIN
 * ===========================
 */
export const DashboardScreen: FC<DashboardScreenProps> = ({ navigation }) => {
  const { users, loading, error, searchUsers, loadUsers } = useUsers()
  const { logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  // =============== EVENTS
  const debouncedSearch = useMemo(
    () =>
      debounce(
        (text: string) => {
          if (text.trim() === "") {
            loadUsers()
          } else {
            searchUsers(text)
          }
        },
        300,
        { trailing: true },
      ),
    [searchUsers, loadUsers],
  )

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      debouncedSearch(query)
    },
    [debouncedSearch],
  )

  // =============== COMPONENTS

  const renderUserCard = useCallback(({ item }: { item: User }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation?.getParent()?.navigate("UserDetail", { id: item.id.toString() })
        }}
      >
        <Stack
          style={{ borderWidth: 1, borderColor: "#CACACA", borderRadius: 8 }}
          padding="$4"
          gap="$2"
          marginBottom="$4"
        >
          <Text fontWeight="bold" fontSize={"$lg"}>
            {item.name}
          </Text>

          <Separator style={{ marginBottom: 8 }} />

          <XStack gap={"$2"}>
            <Stack
              borderRadius="$full"
              width={24}
              height={24}
              backgroundColor={"$blue100"}
              alignItems="center"
              justifyContent="center"
            >
              <EmailIcon width={14} height={14} color="$blue100" />
            </Stack>
            <Text>{item.email}</Text>
          </XStack>

          <XStack gap={"$2"}>
            <Stack
              borderRadius="$full"
              width={24}
              height={24}
              backgroundColor={"$blue100"}
              alignItems="center"
              justifyContent="center"
            >
              <PhoneIcon width={14} height={14} color="$blue100" />
            </Stack>
            <Text>{item.phone}</Text>
          </XStack>

          <XStack gap={"$2"}>
            <Stack
              borderRadius="$full"
              width={24}
              height={24}
              backgroundColor={"$blue100"}
              alignItems="center"
              justifyContent="center"
            >
              <LocationIcon width={14} height={14} color="$blue100" />
            </Stack>
            <Text>
              {item.address.street}, {item.address.city}
            </Text>
          </XStack>
        </Stack>
      </TouchableOpacity>
    )
  }, [])

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
        title={"User Explorer"}
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
        {loading ? (
          <XStack justifyContent="center" paddingVertical="$8">
            <Spinner />
          </XStack>
        ) : error ? (
          <XStack justifyContent="center" paddingVertical="$8">
            <Text color="$red10">Error: {error}</Text>
          </XStack>
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => {
                  loadUsers()
                }}
              />
            }
            data={users}
            renderItem={renderUserCard}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16, paddingTop: 16 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="none"
            removeClippedSubviews={false}
            ListEmptyComponent={renderListEmptyComponent}
            ListHeaderComponent={
              <Text paddingBottom={"$sm"}>{`Total Users: ${users.length}`}</Text>
            }
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
