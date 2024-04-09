import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
// import SearchIcon from "@mui/icons-material/Search";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Wrapper = styled(Box)({
  backgroundColor: "#f0f2f5",
  height:'8vh',
  position: "relative",
  margin: "5px 10px", // Added margin for spacing
  borderRadius: "5px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Added box shadow
});

const Icon = styled(Box)({
  position: "absolute",
  height: "100%",
  padding: "10px", // Increased padding for icon
  color: "#919191",
});

const InputField = styled(InputBase)({
  width: "100%",
  padding: "12px 16px", // Adjusted padding for input field
  fontSize: "16px", // Added font size
  color: "#333", // Added text color
  "&::placeholder": {
    color: "#919191", // Added placeholder color
  },
});

export default function SearchAppBar({ setText }) {
  return (
    <Wrapper>
      <Icon>
        {/* <SearchIcon fontSize="small" /> */}
      </Icon>
      <InputField
        placeholder="Search or start a new chat"
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
    </Wrapper>
  );
}
