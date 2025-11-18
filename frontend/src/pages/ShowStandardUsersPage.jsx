import React from "react";
import { Container } from "@mui/material";
import ShowUsers from "../components/ShowUsers";
import { fetchStandardUsers } from "../services/standardUsers";

import { useEffect, useState } from "react";

const ShowStandardUsersPage = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchStandardUsers().then(setUsers).catch(() => setUsers([]));
  }, []);
  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 3 }}>
      <ShowUsers users={users} title="List of Registered Users" />
    </Container>
  );
};

export default ShowStandardUsersPage;
