export interface FriendLocation {
  friendId: number;
  memberId: number;
  nickname: string;
  profile: string; // 프로필 이미지 URL
  location: {
    lng: number;
    lat: number;
  };
}

export interface FriendsLocationResponse {
  httpStatus: number;
  message: string;
  friends: FriendLocation[];
}

export interface FriendLocationError {
  status: string;
  code: string;
  message: string;
} 
