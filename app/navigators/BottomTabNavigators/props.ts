import { BottomTabScreenProps as NativeStackScreenProps } from "@react-navigation/bottom-tabs"

export type BottomTabParamList = {
  Dashboard?: undefined
  Settings?: undefined
}

export type BottomTabScreenProps<T extends keyof BottomTabParamList> = NativeStackScreenProps<
  BottomTabParamList,
  T
>
