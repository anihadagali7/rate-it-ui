import Button from "../buttons/Button";

const FollowButton = ({ isFollowing, onFollow, onUnfollow, disabled = false }) => {
  if (isFollowing) {
    return (
      <Button variant="secondary" onClick={onUnfollow} disabled={disabled}>
        Following
      </Button>
    );
  }

  return (
    <Button variant="primary" onClick={onFollow} disabled={disabled}>
      Follow
    </Button>
  );
};

export default FollowButton;
