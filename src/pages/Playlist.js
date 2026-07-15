import AddIcon from "@mui/icons-material/Add";
import { Box, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import AddPlaylistModal from "../components/modals/AddPlaylistModal";
import DisplayPlaylistByUser from "../components/playlist/DisplayPlaylistByUser";
import Button from "../shared/buttons/Button";
import FeedLayout from "../shared/layout/FeedLayout";
import UserContext from "../shared/context/userContext";
import { tokens } from "../styles/tokens";

const Playlist = () => {
  const { userName } = useParams();
  const { currentUser } = useContext(UserContext);
  const profileUserName = currentUser?.userName;
  const userViewingOwnProfile = userName === profileUserName;
  const [openNewPlaylistModal, setNewPlaylistModal] = useState(false);

  return (
    <FeedLayout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 700,
            color: tokens.colors.textPrimary,
          }}
        >
          Playlist
        </Typography>
        {userViewingOwnProfile ? (
          <Button
            variant="primary"
            leftIcon={<AddIcon />}
            onClick={() => setNewPlaylistModal(true)}
          >
            Create
          </Button>
        ) : null}
      </Box>

      <DisplayPlaylistByUser userName={userName} />

      {openNewPlaylistModal ? (
        <AddPlaylistModal
          open={openNewPlaylistModal}
          onClose={() => setNewPlaylistModal(false)}
          profileUserName={profileUserName}
        />
      ) : null}
    </FeedLayout>
  );
};

export default Playlist;
