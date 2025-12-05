import { FC, useEffect, useState } from "react"
import { ScrollView } from "react-native"
import { Separator, Spinner, Stack, XStack } from "tamagui"

import { useUsers } from "@/hooks/useUsers"
import { User } from "@/services/api/types"

import { UserDetailScreenProps } from "./props"
import { Screen, ScreenHeader } from "../../components"
import { Text } from "../../components/Text"

/**
 * ===========================
 * MAIN
 * ===========================
 */
export const UserDetailScreen: FC<UserDetailScreenProps> = (props) => {
  const { id } = props.route.params
  const { getUserById } = useUsers()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserById(id).then((userData) => {
      setUser(userData)
      setLoading(false)
    })
  }, [id, getUserById])

  const userContactInfo = [
    { title: "Username", content: user?.username || "" },
    {
      title: "Email",
      content: user?.email || "",
    },
    {
      title: "Phone",
      content: user?.phone || "",
    },
    {
      title: "Website",
      content: user?.website || "",
    },
  ]

  const userAddressInfo = [
    {
      title: "Street",
      content: user?.address.street || "",
    },
    {
      title: "Suite",
      content: user?.address.suite || "",
    },
    {
      title: "City",
      content: user?.address.city || "",
    },
    {
      title: "Zipcode",
      content: user?.address.zipcode || "",
    },
  ]

  const userCompanyInfo = [
    {
      title: "Company Name",
      content: user?.company.name || "",
    },
    {
      title: "Tagline",
      content: user?.company.catchPhrase || "",
    },
    {
      title: "Business",
      content: user?.company.bs || "",
    },
  ]

  const renderUserDetail = ({ title, content }: { title: string; content: string }) => {
    return (
      <XStack gap="$2" marginBottom="$2">
        <Text fontSize={"$md"} fontWeight="600" color="$gray11">
          {title}:
        </Text>
        <Text fontSize={"$md"} flex={1}>
          {content}
        </Text>
      </XStack>
    )
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
    <Screen>
      <ScreenHeader
        unsafe
        title={user?.name || "User Detail"}
        titleProps={{
          fontSize: "$lg",
          fontWeight: "bold",
        }}
      />
      <ScrollView>
        <Stack flex={1} padding="$4" gap="$4">
          <Stack gap="$2">
            <Text fontWeight={"bold"} fontSize={"$lg"} marginBottom="$2">
              Contact Information
            </Text>

            {userContactInfo?.map((info, index) => (
              <Stack key={index}>{renderUserDetail(info)}</Stack>
            ))}
          </Stack>

          <Separator />

          <Stack gap="$2">
            <Text fontWeight={"bold"} fontSize={"$lg"} marginBottom="$2">
              Address
            </Text>

            {userAddressInfo?.map((info, index) => (
              <Stack key={index}>{renderUserDetail(info)}</Stack>
            ))}
          </Stack>

          <Separator />

          <Stack gap="$2">
            <Text fontWeight={"bold"} fontSize={"$lg"} marginBottom="$2">
              Company
            </Text>

            {userCompanyInfo?.map((info, index) => (
              <Stack key={index}>{renderUserDetail(info)}</Stack>
            ))}
          </Stack>
        </Stack>
      </ScrollView>
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
