import { Card, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const PlaylistCard = ({ playlist, userName }) => {
  const posters = playlist.posters.slice(0, 4);

  return (
    <Card
      sx={{ borderRadius: 4, overflow: "hidden", width: 200 }}
      component={Link}
      to={`/playlist/${userName}/${playlist._id}`}
    >
      <div className="relative w-full pt-[100%] bg-gray-300">
        {posters.map((posterUrl, index) => {
          const positions = [
            { top: "0", left: "0" },
            { top: "0", left: "50%" },
            { top: "50%", left: "0" },
            { top: "50%", left: "50%" },
          ];
          return (
            <img
              key={index}
              src={posterUrl}
              alt="Poster"
              className="absolute object-cover"
              style={{
                width: posters.length === 1 ? "100%" : "50%",
                height: posters.length === 1 ? "100%" : "50%",
                top: posters.length === 1 ? "0" : positions[index].top,
                left: posters.length === 1 ? "0" : positions[index].left,
              }}
            />
          );
        })}
      </div>

      {/* Playlist name and button */}
      <CardContent className="flex flex-col items-center p-2">
        <Typography variant="subtitle1" className="text-center font-semibold">
          {playlist.name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PlaylistCard;
