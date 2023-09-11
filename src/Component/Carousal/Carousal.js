import React from "react";
import "./Carousal.css";
import Card from "@mui/material/Card";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
function Carousal() {
  const Navigate = useNavigate();
  const handleOnClick = () => {
    Navigate("/", { replace: true });
  };
  return (
    <div className="main-container">
      <div className="hero-element">
        <p
          className="title-intro"
          style={{ color: "white", textAlign: "center" }}
          onClick={handleOnClick}
        >
          Welcome to TVC EDUCATE Admin Panel
        </p>
        <p style={{ color: "gray", textAlign: "center" }}>
          One Stop destination to Handle TVC EDUCATE Web Application
        </p>
        <p
          className="title-intro"
          style={{ color: "white", textAlign: "center" }}
        >
          CHANGE CAROUSAL DATA
        </p>
      </div>
      <div className="top-row">
        <div className="slide1">
          <Card sx={{ maxWidth: 500 }}>
            <CardActionArea>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  style={{ paddingBottom: "2rem" }}
                >
                  SLIDE 1 DETAILS
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  style={{ paddingBottom: "2rem" }}
                >
                  {/* Here you can change the Carousal Image on Landing Page */}
                  Select the image you want to display : <span></span>
                  <span
                    className="span"
                    style={{
                      background: "rgb(12, 30, 41)",
                      color: "white",
                      padding: "0.5rem",
                      borderRadius: "1rem",
                    }}
                  >
                    Select the Image{" "}
                    <span>
                      <ArrowDropDownIcon />
                    </span>
                  </span>
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  style={{ paddingBottom: "2rem" }}
                >
                  {/* Here you can change the Carousal Image on Landing Page */}
                  Select the text you want to show : {""}
                  <span
                    className="span"
                    style={{
                      background: "rgb(12, 30, 41)",
                      color: "white",
                      padding: "0.5rem",
                      borderRadius: "1rem",
                    }}
                  >
                    Select the Text
                    <span>
                      <ArrowDropDownIcon />
                    </span>
                  </span>
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <button className="btn">Submit</button>
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
        <div className="slide2">
          <Card sx={{ maxWidth: 500 }}>
            <CardActionArea>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  style={{ paddingBottom: "2rem" }}
                >
                  SLIDE 2 DETAILS
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  style={{ paddingBottom: "2rem" }}
                >
                  {/* Here you can change the Carousal Image on Landing Page */}
                  Select the image you want to display : <span></span>
                  <span
                    className="span"
                    style={{
                      background: "rgb(12, 30, 41)",
                      color: "white",
                      padding: "0.5rem",
                      borderRadius: "1rem",
                    }}
                  >
                    Select the Image{" "}
                    <span>
                      <ArrowDropDownIcon />
                    </span>
                  </span>
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  style={{ paddingBottom: "2rem" }}
                >
                  {/* Here you can change the Carousal Image on Landing Page */}
                  Select the text you want to show : {""}
                  <span
                    className="span"
                    style={{
                      background: "rgb(12, 30, 41)",
                      color: "white",
                      padding: "0.5rem",
                      borderRadius: "1rem",
                    }}
                  >
                    Select the Text
                    <span>
                      <ArrowDropDownIcon />
                    </span>
                  </span>
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <button className="btn">Submit</button>
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      </div>
      <div className="top-row row2">
        <div className="slide3">
          <Card sx={{ maxWidth: 500 }}>
            <CardActionArea>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  style={{ paddingBottom: "2rem" }}
                >
                  SLIDE 3 DETAILS
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  style={{ paddingBottom: "2rem" }}
                >
                  {/* Here you can change the Carousal Image on Landing Page */}
                  Select the image you want to display : <span></span>
                  <span
                    className="span"
                    style={{
                      background: "rgb(12, 30, 41)",
                      color: "white",
                      padding: "0.5rem",
                      borderRadius: "1rem",
                    }}
                  >
                    Select the Image{" "}
                    <span>
                      <ArrowDropDownIcon />
                    </span>
                  </span>
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  style={{ paddingBottom: "2rem" }}
                >
                  {/* Here you can change the Carousal Image on Landing Page */}
                  Select the text you want to show : {""}
                  <span
                    className="span"
                    style={{
                      background: "rgb(12, 30, 41)",
                      color: "white",
                      padding: "0.5rem",
                      borderRadius: "1rem",
                    }}
                  >
                    Select the Text
                    <span>
                      <ArrowDropDownIcon />
                    </span>
                  </span>
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <button className="btn">Submit</button>
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
        <div className="slide4">
          <Card sx={{ maxWidth: 500 }}>
            <CardActionArea>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  style={{ paddingBottom: "2rem" }}
                >
                  SLIDE 4 DETAILS
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  style={{ paddingBottom: "2rem" }}
                >
                  {/* Here you can change the Carousal Image on Landing Page */}
                  Select the image you want to display : <span></span>
                  <span
                    className="span"
                    style={{
                      background: "rgb(12, 30, 41)",
                      color: "white",
                      padding: "0.5rem",
                      borderRadius: "1rem",
                    }}
                  >
                    Select the Image{" "}
                    <span>
                      <ArrowDropDownIcon />
                    </span>
                  </span>
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  style={{ paddingBottom: "2rem" }}
                >
                  {/* Here you can change the Carousal Image on Landing Page */}
                  Select the text you want to show : {""}
                  <span
                    className="span"
                    style={{
                      background: "rgb(12, 30, 41)",
                      color: "white",
                      padding: "0.5rem",
                      borderRadius: "1rem",
                    }}
                  >
                    Select the Text
                    <span>
                      <ArrowDropDownIcon />
                    </span>
                  </span>
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <button className="btn">Submit</button>
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Carousal;
