import { FC } from "react"
import { ScrollView } from "react-native"
import { useQuery } from "@tanstack/react-query"
import { Button, Spinner, Stack, Text, XStack, YStack, useTheme } from "tamagui"

import { UserDetailScreenProps } from "./props"
import ContactIcon from "../../../assets/icons/contact.svg"
import PhoneIcon from "../../../assets/icons/phone.svg"
import { Screen, ScreenFooter, ScreenHeader } from "../../components"
import { api } from "../../services/api"
import { useBlockStore } from "../../store/useBlockStore"

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

/**
 * ===========================
 * MAIN
 * ===========================
 */
export const UserDetailScreen: FC<UserDetailScreenProps> = (props) => {
  const { id } = props.route.params
  const theme = useTheme()
  const iconColor = theme.gray10?.get() || "$gray10"

  // fetch user details
  const { data: user, isLoading: loading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await api.getUser(id)
      if (response.kind === "ok") {
        return response.user
      }
      throw new Error("Failed to fetch user")
    },
  })

  // block store
  const { isBlocked, blockUser, unblockUser } = useBlockStore()
  const blocked = isBlocked(Number(id))

  const toggleBlock = () => {
    if (blocked) {
      unblockUser(Number(id))
    } else {
      blockUser(Number(id))
    }
  }

  if (loading) {
    return (
      <Stack flex={1} justifyContent="center" alignItems="center" gap="$4">
        <Spinner size="large" />
        <Text fontSize="$md" color="$gray11">
          Searching for user #{id}...
        </Text>
      </Stack>
    )
  }

  if (!user) {
    return (
      <Screen>
        <ScreenHeader
          unsafe
          title="User Not Found"
          titleProps={{
            fontSize: "$lg",
            fontWeight: "bold",
          }}
        />
        <Stack flex={1} justifyContent="center" alignItems="center" gap="$4" padding="$4">
          <Text fontSize="$lg" color="$orange10" textAlign="center">
            User #{id} not found
          </Text>
          <Text fontSize="$md" color="$gray11" textAlign="center">
            The user may have been removed or does not exist.
          </Text>
        </Stack>
      </Screen>
    )
  }

  return (
    <Screen style={{ backgroundColor: "#f2f2f7" }}>
      <ScreenHeader
        unsafe
        title="Profile"
        titleProps={{
          fontSize: "$lg",
          fontWeight: "bold",
        }}
      />
      <ScrollView>
        <YStack paddingVertical="$6" alignItems="center" backgroundColor="white" marginBottom="$4">
          <Stack
            width={100}
            height={100}
            borderRadius="$full"
            backgroundColor={getAvatarColor(user.name)}
            alignItems="center"
            justifyContent="center"
            marginBottom="$3"
          >
            <Text fontSize={40} fontWeight="bold" color="white">
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </Stack>
          <Text fontSize="$xl" fontWeight="bold" color="black" textAlign="center">
            {user.name}
          </Text>
          <Text fontSize="$md" color="$gray11" marginTop="$1">
            {user.phone}
          </Text>
        </YStack>

        <YStack
          backgroundColor="white"
          paddingLeft="$4"
          borderTopWidth={1}
          borderBottomWidth={1}
          borderColor="$gray5"
          marginBottom="$6"
        >
          <XStack
            paddingVertical="$3"
            borderBottomWidth={1}
            borderColor="$gray4"
            alignItems="center"
            paddingRight="$4"
          >
            <ContactIcon width={20} height={20} fill={iconColor} />
            <YStack marginLeft="$3" flex={1}>
              <Text fontSize="$xs" color="$gray11">
                Email
              </Text>
              <Text fontSize="$md" color="black">
                {user.email}
              </Text>
            </YStack>
          </XStack>
          <XStack paddingVertical="$3" alignItems="center" paddingRight="$4">
            <PhoneIcon width={20} height={20} stroke={iconColor} />
            <YStack marginLeft="$3" flex={1}>
              <Text fontSize="$xs" color="$gray11">
                Website
              </Text>
              <Text fontSize="$md" color="black">
                {user.website}
              </Text>
            </YStack>
          </XStack>
        </YStack>
      </ScrollView>

      <ScreenFooter>
        <Stack paddingHorizontal="$4" marginBottom="$6">
          <Button
            onPress={toggleBlock}
            backgroundColor={blocked ? "white" : "white"}
            color={blocked ? "$red10" : "$red10"}
            borderColor="$red10"
            borderWidth={1}
            icon={blocked ? undefined : undefined}
          >
            {blocked ? "Unblock User" : "Block User"}
          </Button>
          <Text
            fontSize="$xs"
            color="$gray10"
            textAlign="center"
            marginTop="$2"
            paddingHorizontal="$4"
          >
            {blocked
              ? "You have blocked this contact. Tap to unblock."
              : "Block this contact to stop receiving messages."}
          </Text>
        </Stack>
      </ScreenFooter>
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
export default UserDetailScreen
