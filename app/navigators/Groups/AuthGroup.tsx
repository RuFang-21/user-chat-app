import { CommonGroupProps } from "./props"
import { SignInScreen } from "../../screens"

/**
 * ===========================
 * MAIN
 * ===========================
 */
export const createAuthGroup = (props: CommonGroupProps) => {
  const { Stack } = props

  // =============== VIEWS
  return (
    <Stack.Group>
      <Stack.Screen name="Signin" component={SignInScreen} />
    </Stack.Group>
  )
}

/**
 * ===========================
 * EXPORTS
 * ===========================
 */
export default createAuthGroup
