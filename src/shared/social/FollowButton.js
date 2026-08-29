import Button from "../buttons/Button";

const FOLLOW_BUTTON_WIDTH = 120;

const FollowButton = ({ isFollowing, onFollow, onUnfollow, disabled = false }) => {
  if (isFollowing) {
    return (
      <Button variant="secondary" onClick={onUnfollow} disabled={disabled} width={FOLLOW_BUTTON_WIDTH}>
        Following
      </Button>
    );
  }

  return (
    <Button variant="primary" onClick={onFollow} disabled={disabled} width={FOLLOW_BUTTON_WIDTH}>
      Follow
    </Button>
  );
};

export default FollowButton;
