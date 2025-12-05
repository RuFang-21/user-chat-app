import { FC, useState } from "react"
import { FlatList, TouchableOpacity } from "react-native"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Input, Spinner, Stack, Text, XStack } from "tamagui"

import { ChatScreenProps } from "./props"
import { Screen, ScreenHeader } from "../../components"
import { api } from "../../services/api"

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

export const ChatScreen: FC<ChatScreenProps> = ({ navigation, route }) => {
  const { userId, userName } = route.params as { userId: number; userName: string }
  const [message, setMessage] = useState("")
  const queryClient = useQueryClient()

  // fetch messages
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", userId],
    queryFn: async () => {
      const response = await api.getPostsByUserId(userId)
      if (response.kind === "ok") {
        // Reverse to show newest at bottom with inverted FlatList
        return [...response.posts].reverse()
      }
      throw new Error("Failed to fetch posts")
    },
  })

  // send message mutation
  const mutation = useMutation({
    mutationFn: async (newMessage: string) => {
      const response = await api.createPost({
        title: newMessage,
        body: newMessage,
        userId,
      })
      if (response.kind === "ok") {
        return response.post
      }
      throw new Error("Failed to send message")
    },
    onSuccess: (newPost) => {
      // Manually update cache to show new message immediately
      // Add isMine flag and a random ID to avoid collisions if API returns static ID
      const postWithLocalFlag = {
        ...newPost,
        isMine: true,
        id: Math.floor(Math.random() * 1000000),
      }

      queryClient.setQueryData(["posts", userId], (oldData: any[] | undefined) => {
        return [postWithLocalFlag, ...(oldData || [])]
      })
      setMessage("")
    },
  })

  const handleSend = () => {
    if (message.trim()) {
      mutation.mutate(message)
    }
  }

  const renderItem = ({ item }: { item: any }) => {
    // For demo purposes, alternate messages to show sender/receiver difference
    // Also check for locally added 'isMine' flag
    const isMyMessage = item.isMine || item.id % 2 === 0

    return (
      <Stack
        padding="$3"
        backgroundColor={isMyMessage ? "#DCF8C6" : "white"}
        borderRadius="$4"
        marginBottom="$2"
        alignSelf={isMyMessage ? "flex-end" : "flex-start"}
        maxWidth="80%"
        borderTopLeftRadius={!isMyMessage ? 0 : "$4"}
        borderTopRightRadius={isMyMessage ? 0 : "$4"}
        shadowColor="black"
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={0.1}
        shadowRadius={2}
      >
        <Text color="black" fontSize="$md" lineHeight="$lg">
          {item.body}
        </Text>
        <Text color="$gray10" fontSize="$xs" alignSelf="flex-end" marginTop="$1" opacity={0.7}>
          12:30 PM
        </Text>
      </Stack>
    )
  }

  return (
    <Screen safeAreaEdges={["top", "bottom"]}>
      <ScreenHeader
        unsafe
        title={
          <TouchableOpacity
            onPress={() => navigation.navigate("UserDetail", { id: userId.toString() })}
          >
            <XStack alignItems="center" gap="$3">
              <Stack
                width={35}
                height={35}
                borderRadius="$full"
                backgroundColor={getAvatarColor(userName)}
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="$md" fontWeight="bold" color="white">
                  {userName.charAt(0).toUpperCase()}
                </Text>
              </Stack>
              <Text fontSize="$lg" fontWeight="bold">
                {userName}
              </Text>
            </XStack>
          </TouchableOpacity>
        }
      />

      <Stack flex={1} padding="$4" backgroundColor="$gray2">
        {isLoading ? (
          <Spinner />
        ) : (
          <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            inverted // usually chat is inverted, but api/posts might not be sorted by date descending. keeping it simple.
            // actually api/posts returns 100 posts. let's not invert for now as they are just posts.
            // wait, if I want it to look like chat, I should probably invert it if I want latest at bottom.
            // but for now let's just list them.
          />
        )}
      </Stack>

      <XStack padding="$4" gap="$2" borderTopWidth={1} borderColor="$gray5">
        <Input flex={1} value={message} onChangeText={setMessage} placeholder="Type a message..." />
        <Button onPress={handleSend} disabled={mutation.isPending}>
          {mutation.isPending ? <Spinner /> : "Send"}
        </Button>
      </XStack>
    </Screen>
  )
}
