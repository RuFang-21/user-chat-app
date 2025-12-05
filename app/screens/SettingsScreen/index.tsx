import { FC } from "react"
import { Separator, Stack, Text, YStack } from "tamagui"

import { SettingsScreenProps } from "./props"
import packageJson from "../../../package.json"
import { Screen, ScreenHeader } from "../../components"
import { openLinkInBrowser } from "../../utils/openLinkInBrowser"

export const SettingsScreen: FC<SettingsScreenProps> = () => {
  const appVersion = packageJson.version

  return (
    <Screen style={{ backgroundColor: "#f2f2f7" }}>
      <ScreenHeader title="Settings" />
      <Stack padding="$4" gap="$4">
        <YStack backgroundColor="white" padding="$4" borderRadius="$4" gap="$2">
          <Text fontSize="$sm" color="$gray11">
            Developer
          </Text>
          <Text fontSize="$lg" fontWeight="bold">
            Callista Chan Ru Fang
          </Text>

          <Separator marginVertical="$2" />

          <Text fontSize="$sm" color="$gray11">
            Portfolio
          </Text>
          <Text
            fontSize="$md"
            color="$blue10"
            onPress={() => openLinkInBrowser("https://callistachan.space")}
          >
            callistachan.space
          </Text>
        </YStack>

        <YStack alignItems="center" marginTop="$4">
          <Text fontSize="$xs" color="$gray10">
            App Version {appVersion}
          </Text>
        </YStack>
      </Stack>
    </Screen>
  )
}
