import React from "react";
import "./Card.css";
import Card from "@mui/material/Card";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import QuizIcon from "@mui/icons-material/Quiz";
import WhatshotIcon from "@mui/icons-material/Whatshot";

const CardComponent = ({ title, descp, emoji }) => {
  return (
    <div className="Card-container">
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          {/* <CardMedia
            component="img"
            height="140"
            image=<ViewCarouselIcon />
            alt="green iguana"
          /> */}
          <CardContent>
            <Typography>
              {emoji === 1 ? (
                <ViewCarouselIcon sx={{ fontSize: 80 }} />
              ) : emoji === 2 ? (
                <WhatshotIcon sx={{ fontSize: 80 }} />
              ) : emoji === 3 ? (
                <QuizIcon sx={{ fontSize: 80 }} />
              ) : (
                <VerifiedIcon sx={{ fontSize: 80 }} />
              )}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {/* Here you can change the Carousal Image on Landing Page */}
              {descp}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
};

export default CardComponent;
