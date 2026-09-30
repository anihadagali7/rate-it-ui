// Compile-time checks for the helpers in api.ts, run by `npm run typecheck`.
// axios resolves to `AxiosResponse<any>`, so a helper that collapsed to `any`
// or `never` would still type-check in the clients; these catch that.

import type {
  ApiRequest,
  ApiResponse,
  MediaSearchResponse,
  PlaylistsWithMediaResponse,
  Rating,
} from "./api";

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B
  ? 1
  : 2
  ? true
  : false;
type Expect<T extends true> = T;
type IsAny<T> = 0 extends 1 & T ? true : false;
type IsNever<T> = [T] extends [never] ? true : false;

export type Checks = [
  Expect<Equal<ApiResponse<"/api/login", "post">["accessToken"], string>>,
  Expect<Equal<ApiRequest<"/api/login", "post">["password"], string>>,
  // 201-only operation
  Expect<
    Equal<
      ApiResponse<
        "/api/playlist/create",
        "post"
      >["data"]["newPlaylist"]["name"],
      string
    >
  >,
  // 200 and 201 responses are merged
  Expect<
    Equal<
      ApiResponse<
        "/api/media/movie/info/{tmdbId}",
        "get"
      >["data"]["media"]["name"],
      string
    >
  >,
  Expect<
    Equal<
      MediaSearchResponse<"music">["data"]["mediaList"][number]["artists"],
      string
    >
  >,
  Expect<Equal<Rating["likeCount"], number>>,
  Expect<Equal<IsAny<ApiResponse<"/api/ratings/explore", "get">>, false>>,
  Expect<Equal<IsNever<ApiResponse<"/api/ratings/explore", "get">>, false>>,
  Expect<Equal<IsNever<PlaylistsWithMediaResponse>, false>>
];
