import { CommonGroupProps } from "./props"
import { UserDetailScreen } from "../../screens"

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
    </Stack.Group>
  )
}

/**
 * ===========================
 * EXPORTS
 * ===========================
 */
export default createUserGroup
