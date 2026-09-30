// API contract types for rate-it-service. Everything here is an alias of the
// types generated from the service's OpenAPI spec (`npm run api:sync`), so a
// contract change shows up as a type error instead of a runtime bug. Import API
// types from this file only; never from api.generated.ts directly.

import type { components, paths } from "./api.generated";

type Schemas = components["schemas"];

// ---------------------------------------------------------------------------
// Request and response bodies by path
// ---------------------------------------------------------------------------

export type ApiPath = keyof paths;
type HttpMethod = "get" | "put" | "post" | "delete";
type Operation<P extends ApiPath, M extends HttpMethod> = NonNullable<
  paths[P][M]
>;
type Body<T> = T extends { content: { "application/json": infer B } }
  ? B
  : never;

/** JSON request body of an operation, e.g. `ApiRequest<"/api/login", "post">`. */
export type ApiRequest<P extends ApiPath, M extends HttpMethod> = Body<
  NonNullable<Operation<P, M>["requestBody"]>
>;

/** JSON body of an operation's 2xx responses, e.g. `ApiResponse<"/api/login", "post">`. */
export type ApiResponse<P extends ApiPath, M extends HttpMethod> = Body<
  Operation<P, M>["responses"][Extract<
    keyof Operation<P, M>["responses"],
    200 | 201
  >]
>;

// ---------------------------------------------------------------------------
// Envelopes
// ---------------------------------------------------------------------------

/** A Mongo ObjectId, serialized as a hex string. */
export type ObjectId = Schemas["ObjectId"];

/** A Mongo Date, serialized as an ISO 8601 string (`format: date-time`). */
export type IsoDate = string;

/** Success envelope used by services/*Service.js. */
export interface ApiSuccess<T> {
  status: "success";
  data: T;
}

/** Responses that carry only a status (e.g. follow/unfollow). */
export type ApiStatus = Schemas["StatusResponse"];

/** Error envelope from utils/httpErrors.js (`sendError`). */
export type ApiError = Schemas["ErrorResponse"];

/** Login, signup, and social sign-in. */
export type AuthResponse = Schemas["AuthSuccess"];

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export type PublicUser = Schemas["PublicUser"];
/** The signed-in user's own account. */
export type AccountUser = Schemas["AccountUser"];

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

export type Media = Schemas["Media"];
export type MediaType = Media["mediaType"];

/** Lowercase media type used in URL paths (`/api/media/<category>/info/...`, `/api/search/<category>`). */
export type MediaCategory = "movie" | "tv" | "music" | "book";

// ---------------------------------------------------------------------------
// Ratings, likes, and comments
// ---------------------------------------------------------------------------

/** A rating as stored (the spec's `Rating`). */
export type RatingDocument = Schemas["Rating"];
/** A rating in any ratings list, with media, author, likes and comments. */
export type Rating = Schemas["RatingListItem"];
/** A comment as embedded in a rating. */
export type Comment = Schemas["RatingComment"];
export type LikeDocument = Schemas["Like"];
/** A comment as stored (the spec's `Comment`). */
export type CommentDocument = Schemas["Comment"];
/** Response of POST /api/comments. */
export type NewComment = Schemas["CreatedComment"];
export type CommentLikeDocument = Schemas["CommentLike"];

// ---------------------------------------------------------------------------
// Playlists
// ---------------------------------------------------------------------------

/** A playlist as stored (the spec's `Playlist`). */
export type PlaylistDocument = Schemas["Playlist"];
/** A playlist in a user's list, with its owner. */
export type Playlist = Schemas["PlaylistListItem"];
/** Response of POST /api/playlist/create; `addedBy` is the creator. */
export type CreatedPlaylist = Schemas["CreatedPlaylist"];
export type PlaylistMediaDocument = Schemas["PlaylistMedia"];
export type MediaByPlaylist = ApiResponse<
  "/api/playlist/{playlist}",
  "get"
>["data"]["mediaByPlaylist"];
/** When the media is in no playlist, the service sends `data: []` with a non-"success" status. */
export type PlaylistsWithMediaResponse = ApiResponse<
  "/api/playlist/getPlaylistsWithThisMedia",
  "get"
>;

// ---------------------------------------------------------------------------
// Wishlist
// ---------------------------------------------------------------------------

export type WishlistDocument = Schemas["Wishlist"];
export type WishlistItem = Schemas["WishlistItem"];

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export type MovieTvSearchResult = Schemas["MovieTvSearchResult"];
export type MusicSearchResult = Schemas["MusicSearchResult"];
export type BookSearchResult = Schemas["BookSearchResult"];

export interface SearchResultsByCategory {
  movie: MovieTvSearchResult;
  tv: MovieTvSearchResult;
  music: MusicSearchResult;
  book: BookSearchResult;
}

/** POST /api/search/{movie,tv,music,book}. */
export type MediaSearchResponse<T extends MediaCategory> = ApiResponse<
  `/api/search/${T}`,
  "post"
>;
/** POST /api/search/user: users come back under `mediaList`. */
export type UserSearchResponse = ApiResponse<"/api/search/user", "post">;
/** POST /api/search/all. */
export type FullSearchList = ApiResponse<
  "/api/search/all",
  "post"
>["data"]["fullSearchList"];

// ---------------------------------------------------------------------------
// Request bodies
// ---------------------------------------------------------------------------

export type SignUpRequest = ApiRequest<"/api/create-user", "post">;
export type EditProfileRequest = ApiRequest<"/api/account/update", "put">;
export type ResetPasswordRequest = ApiRequest<
  "/api/account/resetPassword",
  "post"
>;
export type CompleteProfileRequest = ApiRequest<
  "/api/account/complete-profile",
  "put"
>;
/** The name is only sent on first sign-in. */
export type AppleLoginRequest = ApiRequest<"/api/auth/apple", "post">;
export type SubmitRatingRequest = ApiRequest<"/api/ratings", "post">;
export type CreatePlaylistRequest = ApiRequest<"/api/playlist/create", "post">;
export type AddMediaToPlaylistRequest = ApiRequest<
  "/api/playlist/addMedia",
  "post"
>;
export type UpdateMediaPlaylistsRequest = ApiRequest<
  "/api/playlist/addMediaToMultiplePlaylists",
  "post"
>;
export type AddToWishlistRequest = ApiRequest<"/api/wishlist", "post">;
