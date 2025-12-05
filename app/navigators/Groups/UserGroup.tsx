import UserDetailScreen from "@/screens/UserDetailScreen"

import { CommonGroupProps } from "./props"
import { ChatScreen } from "../../screens/ChatScreen"

/**
 * ===========================
 * MAIN
 * ===========================
 */
export const createUserGroup = (props: CommonGroupProps) => {
  const { Stack } = props

  // =============== VIEWS
  return (
    <Stack.Group>
      <Stack.Screen name="UserDetail" component={UserDetailScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Group>
  )
}

/**
 * ===========================
 * EXPORTS
 * ===========================
 */
export default createUserGroup
