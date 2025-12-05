/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"

import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type { ApiConfig, ApiFeedResponse, ApiListResponse, EpisodeItem, Post, User } from "./types"
import Config from "../../config"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getEpisodes(): Promise<{ kind: "ok"; episodes: EpisodeItem[] } | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data

      // This is where we transform the data into the shape we expect for our model.
      const episodes: EpisodeItem[] =
        rawData?.items.map((raw) => ({
          ...raw,
        })) ?? []

      return { kind: "ok", episodes }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a list of users.
   */
  async getUsers(): Promise<{ kind: "ok"; users: User[] } | GeneralApiProblem> {
    const response: ApiResponse<ApiListResponse<User>> = await this.apisauce.get("api/users")

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const users = response.data?.results ?? []
      return { kind: "ok", users }
    } catch (error) {
      if (__DEV__ && error instanceof Error) {
        console.error(`Bad data: ${error.message}\n${response.data}`, error.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async getUser(
    userId: string | number,
  ): Promise<{ kind: "ok"; user: User } | { kind: "bad-data" }> {
    try {
      const response: ApiResponse<User> = await this.apisauce.get(`api/users/${userId}`)

      if (!response.ok) {
        return { kind: "bad-data" }
      }

      return { kind: "ok", user: response.data as User }
    } catch (error) {
      if (__DEV__ && error instanceof Error) {
        console.error(`Bad data: ${error.message}`, error.stack)
      }
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a list of posts (messages).
   */
  async getPosts(): Promise<{ kind: "ok"; posts: Post[] } | GeneralApiProblem> {
    const response: ApiResponse<ApiListResponse<Post>> = await this.apisauce.get("api/posts")

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const posts = response.data?.results ?? []
      return { kind: "ok", posts }
    } catch (error) {
      if (__DEV__ && error instanceof Error) {
        console.error(`Bad data: ${error.message}\n${response.data}`, error.stack)
      }
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a list of posts for a specific user.
   */
  async getPostsByUserId(
    userId: number,
  ): Promise<{ kind: "ok"; posts: Post[] } | GeneralApiProblem> {
    const response: ApiResponse<ApiListResponse<Post>> = await this.apisauce.get(
      `api/posts?userId=${userId}`,
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const posts = response.data?.results ?? []
      return { kind: "ok", posts }
    } catch (error) {
      if (__DEV__ && error instanceof Error) {
        console.error(`Bad data: ${error.message}\n${response.data}`, error.stack)
      }
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a single post by ID.
   */
  async getPost(postId: number): Promise<{ kind: "ok"; post: Post } | GeneralApiProblem> {
    const response: ApiResponse<Post> = await this.apisauce.get(`api/posts/${postId}`)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const post = response.data
      return { kind: "ok", post: post as Post }
    } catch (error) {
      if (__DEV__ && error instanceof Error) {
        console.error(`Bad data: ${error.message}\n${response.data}`, error.stack)
      }
      return { kind: "bad-data" }
    }
  }

  /**
   * Creates a new post (message).
   */
  async createPost(
    post: Omit<Post, "id">,
  ): Promise<{ kind: "ok"; post: Post } | GeneralApiProblem> {
    const response: ApiResponse<Post> = await this.apisauce.post("api/posts", post)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const createdPost = response.data
      return { kind: "ok", post: createdPost as Post }
    } catch (error) {
      if (__DEV__ && error instanceof Error) {
        console.error(`Bad data: ${error.message}\n${response.data}`, error.stack)
      }
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
