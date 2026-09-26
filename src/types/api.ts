// API contract types for rate-it-service. Every type is derived from the
// service code (paths below are relative to the rate-it-service repo) and must
// be updated when the contract changes. anihadagali7/rate-it-ui#64 will replace
// these hand-written types with ones generated from the OpenAPI spec, keeping
// the same names.

/** A Mongo ObjectId, serialized as a hex string. */
export type ObjectId = string;

/** A Mongo Date, serialized as an ISO 8601 string. */
export type IsoDate = string;

// ---------------------------------------------------------------------------
// Envelopes
// ---------------------------------------------------------------------------

/** Success envelope used by services/*Service.js. */
export interface ApiSuccess<T> {
  status: "success";
  data: T;
}

/** Responses that carry only a status message (e.g. follow/unfollow). */
export interface ApiStatus {
  status: string;
}

/** Error envelope from utils/httpErrors.js (`sendError`). */
export interface ApiError {
  errors: {
    msg: string;
  };
}

/** Login, signup, and social sign-in: services/authenticationService.js, services/socialAuthService.js. */
export type AuthResponse = ApiSuccess<{ user: AccountUser }> & {
  accessToken: string;
};

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

/**
 * utils/userSerializer.js (`toPublicUser`), fields from repository/userModel.js.
 * Fields that are unset on the document are omitted from the response.
 */
export interface PublicUser {
  _id: ObjectId;
  /** Missing until a social sign-in user completes their profile. */
  userName?: string;
  firstName: string;
  lastName: string;
  picture?: string;
  /** userNames, not ids. */
  followers: string[];
  /** userNames, not ids. */
  following: string[];
}

/** utils/userSerializer.js (`toAccountUser`): the signed-in user's own account. */
export interface AccountUser extends PublicUser {
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
  isAdmin?: boolean;
  isEmailVerified: boolean;
  isProfileComplete: boolean;
}

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

/** repository/mediaModel.js (`mediaType` enum). */
export type MediaType =
  | "MOVIE"
  | "BOOK"
  | "PODCAST"
  | "TV"
  | "MUSIC"
  | "THEATRE";

/** Lowercase media type used in URL paths: routes/mediaRoute.js, routes/searchRoute.js. */
export type MediaCategory = "movie" | "tv" | "music" | "book";

/** repository/mediaModel.js */
export interface Media {
  _id: ObjectId;
  name: string;
  mediaType?: MediaType;
  /** External id (TMDB, Spotify, or Google Books). */
  mediaId?: string;
  artist: string[];
  author: string[];
  producer: string[];
  director: string[];
  host: string[];
  cast: string[];
  genre?: string;
  album?: string;
  description?: string;
  tagLine?: string;
  picture?: string;
  dateReleased?: IsoDate;
}

// ---------------------------------------------------------------------------
// Ratings, likes, and comments
// ---------------------------------------------------------------------------

/** repository/ratingModel.js */
export interface RatingDocument {
  _id: ObjectId;
  media: ObjectId;
  ratedBy: ObjectId;
  /** Stored as a string even though the UI submits a number. */
  rating: string;
  comments?: string;
  isActive?: boolean;
  dateCreated?: IsoDate;
  dateUpdated?: IsoDate;
}

/** A comment as embedded in a rating: services/ratingService.js (`prepareRatingsList`). */
export interface Comment {
  _id: ObjectId;
  text: string;
  dateCreated?: IsoDate;
  commentedBy: PublicUser | null;
  likeCount: number;
  likedByCurrentUser: boolean;
}

/** A rating in any ratings list: services/ratingService.js (`prepareRatingsList`). */
export interface Rating extends Omit<RatingDocument, "media" | "ratedBy"> {
  media: Media | null;
  ratedBy: PublicUser | null;
  likeCount: number;
  likedByCurrentUser: boolean;
  commentList: Comment[];
  commentCount: number;
}

/** repository/likeModel.js */
export interface LikeDocument {
  _id: ObjectId;
  rating: ObjectId;
  likedBy: ObjectId;
  dateCreated?: IsoDate;
}

/** repository/commentModel.js */
export interface CommentDocument {
  _id: ObjectId;
  rating: ObjectId;
  commentedBy: ObjectId;
  text: string;
  dateCreated?: IsoDate;
}

/** Response of POST /api/comments: services/commentService.js (`addComment`). */
export interface NewComment extends Omit<CommentDocument, "commentedBy"> {
  commentedBy: PublicUser;
  likeCount: number;
  likedByCurrentUser: boolean;
}

/** repository/commentLikeModel.js */
export interface CommentLikeDocument {
  _id: ObjectId;
  comment: ObjectId;
  likedBy: ObjectId;
  dateCreated?: IsoDate;
}

// ---------------------------------------------------------------------------
// Playlists
// ---------------------------------------------------------------------------

/** repository/playlistModel.js */
export interface PlaylistDocument {
  _id: ObjectId;
  name: string;
  addedBy: ObjectId;
  posters: string[];
  isActive?: boolean;
  dateCreated?: IsoDate;
}

/** A playlist in a user's list: services/playlistService.js (`preparePlaylistList`). */
export interface Playlist extends Omit<PlaylistDocument, "addedBy"> {
  addedBy: PublicUser | null;
}

/** repository/playlist_mediaModel.js */
export interface PlaylistMediaDocument {
  _id: ObjectId;
  playlist: ObjectId;
  media: ObjectId;
}

/** services/playlistService.js (`getAllMediaInPlaylist`). */
export interface MediaByPlaylist {
  playlist: PlaylistDocument;
  mediaList: (Media | null)[];
}

/**
 * services/playlistService.js (`getPlaylistsWithThisMedia`). When the media is
 * in no playlist the service sends `data: []` with a non-"success" status.
 */
export type PlaylistsWithMediaResponse =
  | ApiSuccess<{ selectedPlaylists: PlaylistDocument[] }>
  | { status: string; data: [] };

// ---------------------------------------------------------------------------
// Wishlist
// ---------------------------------------------------------------------------

/** repository/wishlistModel.js */
export interface WishlistDocument {
  _id: ObjectId;
  media: ObjectId;
  addedBy: ObjectId;
  isActive?: boolean;
  dateCreated?: IsoDate;
}

/** A wishlist entry: services/wishlistService.js (`prepareWishlistList`). */
export interface WishlistItem
  extends Omit<WishlistDocument, "media" | "addedBy"> {
  media: Media | null;
  addedBy: PublicUser | null;
}

// ---------------------------------------------------------------------------
// Search (services/searchService.js)
// ---------------------------------------------------------------------------

/** `buildMovieTvResult` */
export interface MovieTvSearchResult {
  /** TMDB id. */
  mediaId: number;
  name: string;
  description: string;
  /** Empty string when TMDB has no poster. */
  poster: string;
  mediaType: "movie" | "tv";
}

/** `buildMusicResult` */
export interface MusicSearchResult {
  /** Spotify track id. */
  mediaId: string;
  name: string;
  albumType?: string;
  albumName?: string;
  /** Set only when Spotify has a 640px album image. */
  poster?: string;
  /** Artist names joined with commas. */
  artists: string;
  mediaType: "music";
}

/** `buildBookResult` */
export interface BookSearchResult {
  /** Google Books volume id. */
  mediaId: string;
  name: string;
  /** Author names joined with commas. */
  author?: string;
  description?: string;
  poster?: string;
  mediaType: "book";
}

export interface SearchResultsByCategory {
  movie: MovieTvSearchResult;
  tv: MovieTvSearchResult;
  music: MusicSearchResult;
  book: BookSearchResult;
}

/** POST /api/search/{movie,tv,music,book}. */
export type MediaSearchResponse<T extends MediaCategory> = ApiSuccess<{
  mediaList: SearchResultsByCategory[T][];
  totalPages: number;
}> & { mediaType: T };

/** POST /api/search/user: users come back under `mediaList`. */
export type UserSearchResponse = ApiSuccess<{ mediaList: PublicUser[] }> & {
  mediaType: "user";
};

/** POST /api/search/all (`searchAllMedia`). */
export interface FullSearchList {
  movie: MovieTvSearchResult[];
  tv: MovieTvSearchResult[];
  music: MusicSearchResult[];
  book: BookSearchResult[];
}

// ---------------------------------------------------------------------------
// Request bodies (fields read in routes/*Route.js)
// ---------------------------------------------------------------------------

/** routes/authenticationRoute.js (`createUserValidators`). */
export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userName: string;
  phoneNumber?: string;
}

/** routes/userRoute.js (PUT /account/update). */
export interface EditProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

/** routes/authenticationRoute.js (`resetPasswordValidators`). */
export interface ResetPasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/** routes/userRoute.js (PUT /account/complete-profile). */
export interface CompleteProfileRequest {
  userName: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

/** routes/authenticationRoute.js (POST /auth/apple); the name is only sent on first sign-in. */
export interface AppleLoginRequest {
  identityToken: string;
  user?: {
    name?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

/** routes/ratingRoute.js (POST /). */
export interface SubmitRatingRequest {
  /** External media id (`Media.mediaId`). */
  mediaId: string;
  rating: number;
  comments: string;
}

/** routes/playlistRoute.js (POST /create). */
export interface CreatePlaylistRequest {
  playlistName: string;
}

/** routes/playlistRoute.js (POST /addMedia). */
export interface AddMediaToPlaylistRequest {
  playlistId: ObjectId;
  /** `Media._id`. */
  mediaId: ObjectId;
}

/** routes/playlistRoute.js (POST /addMediaToMultiplePlaylists). */
export interface UpdateMediaPlaylistsRequest {
  playlistsToAdd: ObjectId[];
  playlistsToRemove: ObjectId[];
  /** `Media._id`. */
  mediaId: ObjectId;
}

/** routes/wishlistRoute.js (POST /). */
export interface AddToWishlistRequest {
  /** External media id (`Media.mediaId`). */
  mediaId: string;
}
